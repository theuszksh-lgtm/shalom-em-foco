CREATE TYPE public.app_role AS ENUM ('comunicacao');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE TABLE public.team_settings (
  id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  invite_code text NOT NULL
);
GRANT ALL ON public.team_settings TO service_role;
ALTER TABLE public.team_settings ENABLE ROW LEVEL SECURITY;
INSERT INTO public.team_settings (id, invite_code) VALUES (1, 'ACAMPS2027');

CREATE OR REPLACE FUNCTION public.claim_team_role(_code text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL THEN RETURN false; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.team_settings WHERE invite_code = trim(_code)) THEN RETURN false; END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (auth.uid(), 'comunicacao') ON CONFLICT DO NOTHING;
  RETURN true;
END $$;
REVOKE EXECUTE ON FUNCTION public.claim_team_role(text) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.claim_team_role(text) TO authenticated;

CREATE TABLE public.photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day smallint NOT NULL CHECK (day BETWEEN 1 AND 5),
  storage_path text NOT NULL,
  caption text,
  uploaded_by uuid NOT NULL DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.photos TO anon;
GRANT SELECT, INSERT, DELETE ON public.photos TO authenticated;
GRANT ALL ON public.photos TO service_role;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read" ON public.photos FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "team insert" ON public.photos FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'comunicacao') AND uploaded_by = auth.uid());
CREATE POLICY "team delete" ON public.photos FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'comunicacao'));
CREATE INDEX photos_day_idx ON public.photos (day, created_at DESC);

CREATE POLICY "fotos team upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'fotos' AND public.has_role(auth.uid(), 'comunicacao'));
CREATE POLICY "fotos team delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'fotos' AND public.has_role(auth.uid(), 'comunicacao'));