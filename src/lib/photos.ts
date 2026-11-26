import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Photo = { id: string; day: number; storage_path: string; caption: string | null; created_at: string; url: string };

export const photosQuery = (day: number) =>
  queryOptions({
    queryKey: ["photos", day],
    queryFn: async (): Promise<Photo[]> => {
      const { data, error } = await supabase
        .from("photos")
        .select("id, day, storage_path, caption, created_at")
        .eq("day", day)
        .order("created_at", { ascending: false });
      if (error) throw error;
      if (!data.length) return [];
      const { data: signed, error: sErr } = await supabase.storage
        .from("fotos")
        .createSignedUrls(data.map((p) => p.storage_path), 60 * 60 * 6);
      if (sErr) throw sErr;
      return data.map((p, i) => ({ ...p, url: signed[i]?.signedUrl ?? "" }));
    },
    staleTime: 60_000,
  });
