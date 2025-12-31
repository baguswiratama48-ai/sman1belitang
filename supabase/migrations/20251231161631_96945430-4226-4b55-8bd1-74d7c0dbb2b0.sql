-- Create prestasi table
CREATE TABLE public.prestasi (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  judul TEXT NOT NULL,
  deskripsi TEXT,
  tingkat TEXT NOT NULL DEFAULT 'Sekolah',
  tahun TEXT NOT NULL,
  kategori TEXT DEFAULT 'Akademik',
  peraih TEXT,
  image_url TEXT,
  is_published BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ekskul table
CREATE TABLE public.ekskul (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nama TEXT NOT NULL,
  deskripsi TEXT,
  pembina TEXT,
  jadwal TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create osis table
CREATE TABLE public.osis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nama TEXT NOT NULL,
  jabatan TEXT NOT NULL,
  kelas TEXT,
  foto_url TEXT,
  periode TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.prestasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ekskul ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.osis ENABLE ROW LEVEL SECURITY;

-- Prestasi policies
CREATE POLICY "Admins can manage prestasi" ON public.prestasi FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admins can view all prestasi" ON public.prestasi FOR SELECT USING (is_admin(auth.uid()));
CREATE POLICY "Published prestasi viewable by everyone" ON public.prestasi FOR SELECT USING (is_published = true);

-- Ekskul policies
CREATE POLICY "Admins can manage ekskul" ON public.ekskul FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admins can view all ekskul" ON public.ekskul FOR SELECT USING (is_admin(auth.uid()));
CREATE POLICY "Active ekskul viewable by everyone" ON public.ekskul FOR SELECT USING (is_active = true);

-- OSIS policies
CREATE POLICY "Admins can manage osis" ON public.osis FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admins can view all osis" ON public.osis FOR SELECT USING (is_admin(auth.uid()));
CREATE POLICY "Active osis viewable by everyone" ON public.osis FOR SELECT USING (is_active = true);

-- Triggers for updated_at
CREATE TRIGGER update_prestasi_updated_at BEFORE UPDATE ON public.prestasi FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_ekskul_updated_at BEFORE UPDATE ON public.ekskul FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_osis_updated_at BEFORE UPDATE ON public.osis FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();