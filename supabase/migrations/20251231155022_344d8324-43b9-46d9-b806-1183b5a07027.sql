-- Table for Sejarah Sekolah (School History)
CREATE TABLE public.sejarah (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  year text,
  image_url text,
  order_index integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.sejarah ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sejarah viewable by everyone" ON public.sejarah
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage sejarah" ON public.sejarah
  FOR ALL USING (is_admin(auth.uid()));

-- Table for Struktur Organisasi
CREATE TABLE public.struktur_organisasi (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nama text NOT NULL,
  jabatan text NOT NULL,
  foto_url text,
  order_index integer DEFAULT 0,
  level integer DEFAULT 1,
  parent_id uuid REFERENCES public.struktur_organisasi(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.struktur_organisasi ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Struktur viewable by everyone" ON public.struktur_organisasi
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage struktur" ON public.struktur_organisasi
  FOR ALL USING (is_admin(auth.uid()));

-- Table for Guru (Teachers)
CREATE TABLE public.guru (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nama text NOT NULL,
  nip text,
  jabatan text NOT NULL,
  mata_pelajaran text,
  pendidikan text,
  email text,
  telepon text,
  foto_url text,
  is_active boolean DEFAULT true,
  order_index integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.guru ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Guru viewable by everyone" ON public.guru
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can view all guru" ON public.guru
  FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY "Admins can manage guru" ON public.guru
  FOR ALL USING (is_admin(auth.uid()));

-- Table for Tenaga Kependidikan (Staff)
CREATE TABLE public.tendik (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nama text NOT NULL,
  nip text,
  jabatan text NOT NULL,
  pendidikan text,
  email text,
  telepon text,
  foto_url text,
  is_active boolean DEFAULT true,
  order_index integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.tendik ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tendik viewable by everyone" ON public.tendik
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can view all tendik" ON public.tendik
  FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY "Admins can manage tendik" ON public.tendik
  FOR ALL USING (is_admin(auth.uid()));

-- Table for Kelas (Class data for Siswa page)
CREATE TABLE public.kelas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nama_kelas text NOT NULL,
  tingkat text NOT NULL,
  jurusan text,
  wali_kelas text,
  jumlah_siswa integer DEFAULT 0,
  tahun_ajaran text NOT NULL,
  order_index integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.kelas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kelas viewable by everyone" ON public.kelas
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage kelas" ON public.kelas
  FOR ALL USING (is_admin(auth.uid()));

-- Table for Fasilitas
CREATE TABLE public.fasilitas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nama text NOT NULL,
  deskripsi text,
  image_url text NOT NULL,
  kategori text DEFAULT 'Umum',
  is_published boolean DEFAULT true,
  order_index integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.fasilitas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published fasilitas viewable by everyone" ON public.fasilitas
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can view all fasilitas" ON public.fasilitas
  FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY "Admins can manage fasilitas" ON public.fasilitas
  FOR ALL USING (is_admin(auth.uid()));

-- Table for Kalender Akademik
CREATE TABLE public.kalender_akademik (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  judul text NOT NULL,
  deskripsi text,
  tanggal_mulai date NOT NULL,
  tanggal_selesai date,
  kategori text DEFAULT 'Umum',
  is_published boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.kalender_akademik ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published kalender viewable by everyone" ON public.kalender_akademik
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can view all kalender" ON public.kalender_akademik
  FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY "Admins can manage kalender" ON public.kalender_akademik
  FOR ALL USING (is_admin(auth.uid()));

-- Table for Alumni
CREATE TABLE public.alumni (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nama text NOT NULL,
  angkatan text NOT NULL,
  foto_url text,
  pekerjaan text,
  instansi text,
  testimoni text,
  is_published boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.alumni ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published alumni viewable by everyone" ON public.alumni
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can view all alumni" ON public.alumni
  FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY "Admins can manage alumni" ON public.alumni
  FOR ALL USING (is_admin(auth.uid()));

-- Create triggers for updated_at
CREATE TRIGGER update_sejarah_updated_at BEFORE UPDATE ON public.sejarah
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_struktur_updated_at BEFORE UPDATE ON public.struktur_organisasi
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_guru_updated_at BEFORE UPDATE ON public.guru
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tendik_updated_at BEFORE UPDATE ON public.tendik
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_kelas_updated_at BEFORE UPDATE ON public.kelas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_fasilitas_updated_at BEFORE UPDATE ON public.fasilitas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_kalender_updated_at BEFORE UPDATE ON public.kalender_akademik
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_alumni_updated_at BEFORE UPDATE ON public.alumni
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();