-- Create site_settings table for all homepage dynamic content
CREATE TABLE public.site_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key text NOT NULL UNIQUE,
  value jsonb NOT NULL DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Public can read settings
CREATE POLICY "Site settings are viewable by everyone"
ON public.site_settings
FOR SELECT
USING (true);

-- Only admin can manage settings
CREATE POLICY "Admins can manage site settings"
ON public.site_settings
FOR ALL
USING (is_admin(auth.uid()));

-- Trigger for updated_at
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default settings
INSERT INTO public.site_settings (key, value) VALUES
('hero_slides', '[
  {"image": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&q=80", "title": "Selamat Datang di", "subtitle": "SMAN 1 BELITANG", "description": "Menjadi SMA Prima yang berpacu meraih Prestasi Luhur Budi Pekerti"},
  {"image": "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1920&q=80", "title": "Pendidikan Berkualitas", "subtitle": "Untuk Masa Depan Cemerlang", "description": "Meningkatkan kecerdasan, pengetahuan, kepribadian, dan akhlak mulia"},
  {"image": "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1920&q=80", "title": "PPDB 2025", "subtitle": "Pendaftaran Dibuka!", "description": "Bergabunglah bersama kami untuk meraih prestasi gemilang"}
]'::jsonb),
('ppdb', '{
  "year": "2025",
  "description": "Penerimaan Peserta Didik Baru SMAN 1 Belitang Tahun Ajaran 2025/2026. Daftarkan diri Anda sekarang dan bergabunglah bersama kami!",
  "registration_start": "1 Juni 2025",
  "registration_end": "30 Juni 2025",
  "quota": "300",
  "registration_url": "https://www.ppdbsman1belitang.sch.id/",
  "timeline": [
    {"label": "Pendaftaran Online", "date": "1 - 15 Juni 2025"},
    {"label": "Verifikasi Berkas", "date": "16 - 20 Juni 2025"},
    {"label": "Pengumuman Hasil", "date": "25 Juni 2025"},
    {"label": "Daftar Ulang", "date": "26 - 30 Juni 2025"}
  ]
}'::jsonb),
('visi_misi', '{
  "visi": "Menjadi SMA Prima yang berpacu meraih Prestasi Luhur Budi Pekerti",
  "misi": [
    "Membudayakan sikap disiplin",
    "Menumbuhkan penghayatan ajaran-ajaran agama dan budaya",
    "Meningkatkan prestasi akademik",
    "Membekali keterampilan dan kecakapan hidup",
    "Mewujudkan fisik sekolah dan warga sekolah berpenampilan menarik"
  ],
  "tujuan": "Meningkatkan kecerdasan, pengetahuan, kepribadian, imtaq, akhlak mulia, serta keterampilan berbasis teknologi informasi untuk hidup mandiri dan mengikuti pendidikan lebih lanjut."
}'::jsonb),
('sambutan', '{
  "nama": "H. Prioyitno, S.Pd. MM",
  "jabatan": "Kepala SMAN 1 Belitang",
  "foto": "",
  "konten": "Assalamu''alaikum Warahmatullahi Wabarakatuh.\n\nSelamat datang di website resmi SMAN 1 Belitang. Puji syukur kita panjatkan kehadirat Allah SWT atas segala rahmat dan karunia-Nya.\n\nSMAN 1 Belitang berkomitmen untuk terus meningkatkan mutu pendidikan dan menghasilkan lulusan yang tidak hanya unggul dalam akademik, tetapi juga memiliki akhlak mulia dan siap berkontribusi untuk bangsa.\n\nSemoga website ini dapat menjadi sarana informasi yang bermanfaat bagi seluruh civitas akademika dan masyarakat.\n\nWassalamu''alaikum Warahmatullahi Wabarakatuh."
}'::jsonb),
('stats', '{
  "jumlah_siswa": 1200,
  "fasilitas": 50,
  "prestasi": 100,
  "tahun_berdiri": 1985
}'::jsonb),
('kontak', '{
  "alamat": "Jln. Marga Pemuka Bangsa Raja No.1001 Gumawang Belitang, Kab. OKU Timur, Sumatera Selatan 32382",
  "telepon": "0735-450106",
  "email": "sman1belitang@gmail.com",
  "jam_operasional": "Senin - Sabtu: 07:00 - 15:00 WIB",
  "maps_embed": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3982.5!2d104.5!3d-4.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNMKwMDAnMDAuMCJTIDEwNMKwMzAnMDAuMCJF!5e0!3m2!1sen!2sid!4v1234567890"
}'::jsonb),
('footer', '{
  "tagline": "Menjadi SMA Prima yang berpacu meraih Prestasi Luhur Budi Pekerti",
  "facebook": "",
  "instagram": "",
  "youtube": "",
  "jam_senin_kamis": "07:00 - 15:00",
  "jam_jumat": "07:00 - 11:30",
  "jam_sabtu": "07:00 - 12:00",
  "copyright": "© 2025 SMAN 1 Belitang. Hak Cipta Dilindungi."
}'::jsonb);