
CREATE TABLE public.properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 150),
  type text NOT NULL CHECK (
    type IN ('House', 'Apartment', 'Plot', 'Commercial')
  ),
  purpose text NOT NULL CHECK (purpose IN ('sale', 'rent')),
  price bigint NOT NULL CHECK (price > 0),
  location text NOT NULL CHECK (char_length(location) BETWEEN 1 AND 200),
  size text NOT NULL CHECK (char_length(size) BETWEEN 1 AND 50),
  bedrooms integer NOT NULL DEFAULT 0 CHECK (bedrooms >= 0),
  bathrooms integer NOT NULL DEFAULT 0 CHECK (bathrooms >= 0),
  description text NOT NULL CHECK (char_length(description) BETWEEN 1 AND 3000),
  featured boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX properties_public_listing_idx
ON public.properties (status, created_at DESC);

ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.properties TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.properties TO authenticated;

CREATE POLICY "Public can view published properties"
ON public.properties
FOR SELECT
TO anon, authenticated
USING (
  status = 'published'
  OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can insert properties"
ON public.properties
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update properties"
ON public.properties
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete properties"
ON public.properties
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
