import { createServerFn } from "@tanstack/react-start";

export const listPhotos = createServerFn({ method: "GET" })
  .inputValidator((d: { day: number }) => {
    const day = Number(d?.day);
    if (!Number.isInteger(day) || day < 1 || day > 5) throw new Error("Dia inválido");
    return { day };
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("photos")
      .select("id, day, storage_path, caption, created_at")
      .eq("day", data.day)
      .order("created_at", { ascending: false });
    if (error) throw new Error("Não foi possível carregar as fotos.");
    if (!rows.length) return [];
    const { data: signed, error: sErr } = await supabaseAdmin.storage
      .from("fotos")
      .createSignedUrls(rows.map((p) => p.storage_path), 60 * 60 * 6);
    if (sErr) throw new Error("Não foi possível carregar as fotos.");
    return rows.map((p, i) => ({ ...p, url: signed[i]?.signedUrl ?? "" }));
  });
