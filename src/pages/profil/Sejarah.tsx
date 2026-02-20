import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { History, MapPin, Calendar, Building2 } from "lucide-react";

const Sejarah = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section Page */}
        <section className="bg-primary py-20 text-primary-foreground text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-accent rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full translate-x-1/3 translate-y-1/3" />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Sejarah Sekolah</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Perjalanan SMAN 1 Belitang dalam mencetak generasi unggul sejak tahun 1979.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-8 space-y-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-6 text-accent">
                  <History className="h-8 w-8" />
                  <h2 className="text-2xl font-bold text-slate-900">Awal Terbentuknya</h2>
                </div>
                <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
                  <p className="mb-4">
                    SMAN 1 Belitang didirikan pada tahun 1979. Pendirian sekolah ini merupakan wujud kepedulian terhadap pendidikan di wilayah Belitang. Langkah awal ini dimulai dengan wakaf sebidang tanah seluas 2 hektar di Jalan Ki Hajar Dewantara No. 1001 Belitang.
                  </p>
                  <p className="mb-4">
                    Tanah tersebut merupakan pemberian dari <strong>Bapak H. Hamzah</strong>, seorang pejabat setara Bupati pada masa itu yang sangat menaruh perhatian besar pada masa depan generasi muda di Sumatera Selatan, khususnya di OKU Timur.
                  </p>
                  <p>
                    Pada masa awal berdirinya, bangunan SMAN 1 Belitang masih sangat sederhana namun fungsional, yang terdiri dari 6 lokal kelas sebagai ruang belajar, 1 ruang kantor untuk guru dan pegawai, serta fasilitas penunjang lainnya seperti perpustakaan dan laboratorium dasar.
                  </p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-6 text-accent">
                  <Building2 className="h-8 w-8" />
                  <h2 className="text-2xl font-bold text-slate-900">Perkembangan & Relokasi</h2>
                </div>
                <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
                  <p className="mb-4">
                    Seiring dengan bertambahnya jumlah siswa dan kebutuhan akan fasilitas yang lebih memadai, pada tahun 1991, operasional SMAN 1 Belitang berpindah lokasi ke Jalan Marga Pemuka Bangsa Raja No. 1, Belitang, Kabupaten OKU Timur.
                  </p>
                  <p>
                    Hingga saat ini, SMAN 1 Belitang terus berkembang menjadi salah satu sekolah menengah atas terkemuka di Sumatera Selatan, dengan fasilitas modern, laboratorium lengkap, dan lingkungan belajar yang asri serta kondusif bagi pertumbuhan akademik maupun karakter siswa.
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar info */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-primary text-primary-foreground p-8 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold mb-6 border-b border-primary-foreground/20 pb-4">Info Singkat</h3>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <Calendar className="h-6 w-6 text-accent shrink-0" />
                    <div>
                      <p className="text-sm opacity-70">Tahun Berdiri</p>
                      <p className="font-semibold text-lg">1979</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Building2 className="h-6 w-6 text-accent shrink-0" />
                    <div>
                      <p className="text-sm opacity-70">Status Sekolah</p>
                      <p className="font-semibold text-lg">Negeri (Terakreditasi A)</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <MapPin className="h-6 w-6 text-accent shrink-0" />
                    <div>
                      <p className="text-sm opacity-70">Lokasi</p>
                      <p className="font-semibold">Jl. Marga Pemuka Bangsa Raja No. 1, OKU Timur</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Sejarah;
