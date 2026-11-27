import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/gallery")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = request.headers.get("Origin") ?? "";
        const headers = { "Cache-Control": "no-store", "Vary": "Origin", "Access-Control-Allow-Origin": ["https://acamps2k27.vercel.app", "https://acamps2k271.vercel.app"].includes(origin) ? origin : "https://acamps2k271.vercel.app" };
        const day = Number(new URL(request.url).searchParams.get("day"));
        if (!Number.isInteger(day) || day < 1 || day > 5) return Response.json({ error: "Dia inválido" }, { status: 400, headers });
        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { data, error } = await supabaseAdmin.from("photos").select("id, day, storage_path, caption, created_at").eq("day", day).order("created_at", { ascending: false });
          if (error) throw error;
          const rows = data ?? [];
          if (!rows.length) return Response.json([], { headers });
          const signed = await supabaseAdmin.storage.from("fotos").createSignedUrls(rows.map(p => p.storage_path), 21600);
          if (signed.error) throw signed.error;
          return Response.json(rows.map((p, i) => ({ ...p, url: signed.data?.[i]?.signedUrl ?? "" })), { headers });
        } catch {
          return Response.json({ error: "Erro ao carregar fotos" }, { status: 502, headers });
        }
      },
    },
  },
});
