import { queryOptions } from "@tanstack/react-query";
import { listPhotos } from "@/lib/photos.functions";

export type Photo = { id: string; day: number; storage_path: string; caption: string | null; created_at: string; url: string };

export const photosQuery = (day: number) =>
  queryOptions({
    queryKey: ["photos", day],
    queryFn: (): Promise<Photo[]> => listPhotos({ data: { day } }),
    staleTime: 60_000,
  });
