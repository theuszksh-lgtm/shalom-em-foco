DROP POLICY IF EXISTS "public read" ON public.photos;
CREATE POLICY "team read" ON public.photos FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'comunicacao'::public.app_role));
REVOKE SELECT ON public.photos FROM anon;
GRANT ALL ON public.photos TO service_role;
DROP POLICY IF EXISTS "fotos public read" ON storage.objects;
CREATE POLICY "fotos team read" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'fotos' AND public.has_role(auth.uid(), 'comunicacao'::public.app_role));