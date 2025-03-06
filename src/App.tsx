import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Menu, X, BookOpen, Star, Users, Calendar, Loader, User, Phone, MapPin, School, ArrowRight } from 'lucide-react';
import { useAuthStore } from './store/authStore';
import { supabase } from './lib/supabase';
import { AdminLayout } from './components/AdminLayout';
import { Dashboard } from './pages/admin/Dashboard';
import { Students } from './pages/admin/Students';
import { Payments } from './pages/admin/Payments';
import { Activities } from './pages/admin/Activities';
import { CashManagement } from './pages/admin/CashManagement';
import { Registrations } from './pages/admin/Registrations';
import { PublicActivities } from './pages/PublicActivities';

const FadeInSection = ({ children, direction = 'up' }: { children: React.ReactNode, direction?: 'up' | 'down' | 'left' | 'right' }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const variants = {
    hidden: {
      opacity: 0,
      x: direction === 'left' ? -50 : direction === 'right' ? 50 : 0,
      y: direction === 'up' ? 50 : direction === 'down' ? -50 : 0,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      }
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants}
    >
      {children}
    </motion.div>
  );
};

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const { signIn, user, loading, setUser } = useAuthStore();
  const [activities, setActivities] = useState([]);
  
  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    
    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');
    
    try {
      await signIn(loginEmail, loginPassword);
      setIsLoginOpen(false);
      setLoginEmail('');
      setLoginPassword('');
    } catch (error) {
      setLoginError('Login gagal: Email atau password salah');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegistration = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    
    const registrationData = {
      student_name: formData.get('studentName'),
      birth_date: formData.get('birthDate'),
      parent_name: formData.get('parentName'),
      whatsapp: formData.get('whatsapp'),
      address: formData.get('address'),
      previous_school: formData.get('previousSchool'),
      status: 'pending',
      registration_date: new Date().toISOString()
    };

    try {
      const { error } = await supabase
        .from('registrations')
        .insert(registrationData);
      
      if (error) throw error;
      
      e.currentTarget.reset();
      setIsRegistrationOpen(false);
      alert('Pendaftaran berhasil dikirim! Admin akan memproses pendaftaran Anda.');
    } catch (error) {
      console.error('Error saat mendaftar:', error);
      alert('Terjadi kesalahan saat mengirim pendaftaran. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-green-600 mx-auto" />
          <p className="mt-2 text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/admin/*" element={
          user ? <AdminLayout /> : <Navigate to="/" replace />
        }>
          <Route index element={<Dashboard />} />
          <Route path="siswa" element={<Students />} />
          <Route path="pembayaran" element={<Payments />} />
          <Route path="kas" element={<CashManagement />} />
          <Route path="kegiatan" element={<Activities />} />
          <Route path="pendaftaran" element={<Registrations />} />
        </Route>
        <Route path="/kegiatan" element={<PublicActivities />} />
        <Route path="/" element={
          user ? <Navigate to="/admin" replace /> : (
            <div className="min-h-screen">
              {/* Navigation */}
              <nav className="bg-white/95 backdrop-blur-sm fixed w-full z-50 shadow-elegant">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                      <BookOpen className="h-8 w-8 text-green-700" />
                      <span className="ml-2 text-xl font-bold gradient-text">Madrasah Al Muhajirin</span>
                    </div>
                    
                    <div className="hidden md:flex items-center space-x-8">
                      <a href="#beranda" className="text-green-800 hover:text-green-600 transition-colors">Beranda</a>
                      <a href="#visi-misi" className="text-green-800 hover:text-green-600 transition-colors">Visi & Misi</a>
                      <a href="#tentang" className="text-green-800 hover:text-green-600 transition-colors">Tentang</a>
                      <Link to="/kegiatan" className="text-green-800 hover:text-green-600 transition-colors">Kegiatan</Link>
                      <button
                        onClick={() => setIsLoginOpen(true)}
                        className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800 transition-colors button-hover shadow-elegant"
                      >
                        Login
                      </button>
                    </div>

                    <div className="md:hidden">
                      <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="text-green-800 hover:text-green-600 transition-colors"
                      >
                        <Menu className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="md:hidden bg-white border-t"
                    >
                      <div className="px-2 pt-2 pb-3 space-y-1">
                        <a href="#beranda" className="block px-3 py-2 text-green-800 hover:bg-green-50 rounded-lg transition-colors">Beranda</a>
                        <a href="#visi-misi" className="block px-3 py-2 text-green-800 hover:bg-green-50 rounded-lg transition-colors">Visi & Misi</a>
                        <a href="#tentang" className="block px-3 py-2 text-green-800 hover:bg-green-50 rounded-lg transition-colors">Tentang</a>
                        <Link to="/kegiatan" className="block px-3 py-2 text-green-800 hover:bg-green-50 rounded-lg transition-colors">Kegiatan</Link>
                        <button
                          onClick={() => setIsLoginOpen(true)}
                          className="w-full text-left px-3 py-2 text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                        >
                          Login
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </nav>

              {/* Hero Section */}
              <section 
                id="beranda" 
                className="relative h-screen"
                style={{
                  backgroundImage: "url('https://albbftgsplpqepfhtllv.supabase.co/storage/v1/object/public/background//PXL_20250124_092544024.jpg?q=80&w=2940&auto=format&fit=crop')",
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              >
                <div className="absolute inset-0 bg-[#004225]/50"></div>
                <div className="relative h-full flex items-center justify-center text-center px-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 text-shadow">
                      Madrasah Al Muhajirin
                    </h1>
                    <p className="text-xl text-white/90 mb-8 font-arabic">
                      Membentuk Generasi Qurani yang Berakhlak Mulia
                    </p>
                    <button
                      onClick={() => setIsRegistrationOpen(true)}
                      className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-green-700 transition-colors button-hover shadow-elegant"
                    >
                      Daftar Sekarang
                    </button>
                  </motion.div>
                </div>
              </section>

              {/* Welcome Section */}
              <section className="py-16 bg-green-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <FadeInSection direction="down">
                    <div className="prose prose-lg mx-auto text-center">
                      <motion.h2 
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="text-3xl font-bold text-gray-900 mb-6"
                      >
                        Kata Sambutan.
                      </motion.h2>
                      <motion.p 
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="text-xl text-gray-700 leading-relaxed"
                      >
                        Selamat datang di website resmi MDTA Al Muhajirin. Kami adalah lembaga pendidikan Islam yang berkomitmen untuk membentuk generasi Qurani yang berakhlak mulia dan berwawasan global. Melalui pendekatan pembelajaran yang komprehensif dan modern, kami memadukan nilai-nilai Islam dengan perkembangan zaman untuk menciptakan lulusan yang unggul dalam karakter dan prestasi.
                      </motion.p>
                    </div>
                  </FadeInSection>
                </div>
              </section>

               {/* Vision Mission Section */}
              <section id="visi-misi" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <FadeInSection direction="up">
                    <div className="text-center mb-12">
                      <h2 className="text-3xl font-bold text-gray-900 mb-4">Visi, Misi dan Motto</h2>
                      <div className="w-20 h-1 bg-green-600 mx-auto"></div>
                    </div>
                  </FadeInSection>
                  
                  <div className="grid md:grid-cols-3 gap-8">
                    <FadeInSection direction="left">
                      <div className="bg-green-50 p-8 rounded-lg shadow-card hover:shadow-lg transition-shadow">
                        <div className="flex items-center mb-4">
                          <Star className="h-8 w-8 text-green-600" />
                          <h3 className="text-2xl font-bold ml-3 gradient-text">Visi</h3>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          Terwujudnya Insan Yang Beriman, Bertaqwa dan Berakhlaqul Karimah
                        </p>
                      </div>
                    </FadeInSection>

                    <FadeInSection direction="up">
                      <div className="bg-green-50 p-8 rounded-lg shadow-card hover:shadow-lg transition-shadow">
                        <div className="flex items-center mb-4">
                          <Users className="h-8 w-8 text-green-600" />
                          <h3 className="text-2xl font-bold ml-3 gradient-text">Misi</h3>
                        </div>
                        <ul className="text-gray-700 space-y-4">
                          <li className="flex items-start">
                            <div className="w-2 h-2 bg-green-600 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                            <p className="leading-relaxed">Terwujudnya santri dalam ilmu agama berpaham Ahlussunnah Waljama'ah</p>
                          </li>
                          <li className="flex items-start">
                            <div className="w-2 h-2 bg-green-600 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                            <p className="leading-relaxed">Menanamkan nilai-nilai ubudiyah dalam kehidupan sehari-hari</p>
                          </li>
                          <li className="flex items-start">
                            <div className="w-2 h-2 bg-green-600 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                            <p className="leading-relaxed">Mendidik dan membimbing santri dalam menjalin ukhuwah islamiyah yang berdasarkan akhlak mulia</p>
                          </li>
                          <li className="flex items-start">
                            <div className="w-2 h-2 bg-green-600 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                            <p className="leading-relaxed">Mencetak generasi muda yang cerdas dan berwawasan islami</p>
                          </li>
                        </ul>
                      </div>
                    </FadeInSection>

                    <FadeInSection direction="right">
                      <div className="bg-green-50 p-8 rounded-lg shadow-card hover:shadow-lg transition-shadow">
                        <div className="flex items-center mb-4">
                          <BookOpen className="h-8 w-8 text-green-600" />
                          <h3 className="text-2xl font-bold ml-3 gradient-text">Motto</h3>
                        </div>
                        <div className="space-y-6">
                          <div>
                            <h4 className="font-bold text-green-700 mb-2">Motto Madrasah</h4>
                            <p className="text-gray-700">
                              "Membaca, Memahami, Mengamalkan"
                            </p>
                          </div>
                          <div>
                            <h4 className="font-bold text-green-700 mb-2">Mutu Pendidikan</h4>
                            <ul className="text-gray-700 space-y-2">
                              <li className="flex items-center">
                                <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                                Hafalan Al-Quran berkualitas
                              </li>
                              <li className="flex items-center">
                                <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                                Pemahaman Islam yang mendalam
                              </li>
                              <li className="flex items-center">
                                <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                                Akhlak yang terpuji
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </FadeInSection>
                  </div>
                </div>
              </section>

              {/* About Section */}
              <section id="tentang" className="py-20 bg-green-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <FadeInSection>
                    <div className="text-center mb-12">
                      <h2 className="text-3xl font-bold text-gray-900 mb-4">Tentang Kami</h2>
                      <div className="w-20 h-1 bg-green-600 mx-auto"></div>
                    </div>
                  </FadeInSection>
                  <FadeInSection>
                    <div className="prose prose-lg mx-auto text-gray-700">
                      <p className="leading-relaxed">
                        Madrasah Al Muhajirin adalah lembaga pendidikan Islam yang berdedikasi untuk
                        membentuk generasi yang unggul dalam ilmu agama dan pengetahuan umum. Didirikan
                        pada tahun 2015.
                      </p>
                      <p className="leading-relaxed">
                        Dengan tenaga pengajar yang berkompeten dan kurikulum yang komprehensif, kami
                        berkomitmen untuk memberikan pendidikan terbaik bagi putra-putri umat Islam.
                      </p>
                    </div>
                  </FadeInSection>
                </div>
              </section>

              {/* Activities Section */}
              <section id="kegiatan" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <FadeInSection>
                    <div className="text-center mb-12">
                      <h2 className="text-3xl font-bold text-gray-900 mb-4">Kegiatan Terbaru</h2>
                      <div className="w-20 h-1 bg-green-600 mx-auto"></div>
                    </div>
                  </FadeInSection>
                  <div className="grid md:grid-cols-3 gap-8">
                    {activities.slice(0, 3).map((activity) => (
                      <FadeInSection key={activity.id}>
                        <div className="bg-white rounded-xl shadow-elegant overflow-hidden hover:shadow-lg transition-all group">
                          {activity.image_url && (
                            <div className="relative overflow-hidden h-48">
                              <img
                                src={activity.image_url}
                                alt={activity.title}
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute top-4 left-4">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  {new Date(activity.event_date).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                  })}
                                </span>
                              </div>
                            </div>
                          )}
                          <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{activity.title}</h3>
                            <p className="text-gray-600 mb-4">{activity.description}</p>
                          </div>
                        </div>
                      </FadeInSection>
                    ))}
                  </div>
                  <div className="text-center mt-8">
                    <Link
                      to="/kegiatan"
                      className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-elegant"
                    >
                      Lihat Semua Kegiatan
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </section>

              {/* Footer */}
              <footer className="bg-green-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid md:grid-cols-3 gap-8">
                    <div>
                      <h3 className="text-xl font-bold mb-4 gradient-text">MDTA Al Muhajirin</h3>
                      <p className="text-green-100">
                        Membentuk generasi Qurani yang berakhlak mulia dan berwawasan global.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-4">Lokasi & Kontak</h3>
                      <div className="space-y-4 text-green-100">
                        <p>
                          <strong className="block text-white">Alamat:</strong>
                          Jl. Uka, Perumahan Garuda Permai II<br />
                          Kec. Tampan, Kota Pekanbaru<br />
                          Provinsi Riau
                        </p>
                        <p>
                          <strong className="block text-white">Telepon:</strong>
                          081276939840
                        </p>
                        <p>
                          <strong className="block text-white">Email:</strong>
                          mdta.almuhajirin@gmail.com
                        </p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-4">Menu</h3>
                      <ul className="space-y-2 text-green-100">
                        <li><a href="#beranda" className="hover:text-white transition-colors">Beranda</a></li>
                        <li><a href="#visi-misi" className="hover:text-white transition-colors">Visi & Misi</a></li>
                        <li><a href="#tentang" className="hover:text-white transition-colors">Tentang</a></li>
                        <li><Link to="/kegiatan" className="hover:text-white transition-colors">Kegiatan</Link></li>
                      </ul>
                    </div>
                  </div>
                  <div className="border-t border-green-800 mt-8 pt-8 text-center text-green-100">
                    © 2025 MDTA Al Muhajirin. Hak Cipta Dilindungi.
                  </div>
                </div>
              </footer>

              {/* Registration Modal */}
              <AnimatePresence>
                {isRegistrationOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                  >
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      className="bg-white rounded-lg p-8 max-w-2xl w-full shadow-card"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Pendaftaran Siswa Baru</h2>
                        <button 
                          onClick={() => setIsRegistrationOpen(false)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-6 w-6" />
                        </button>
                      </div>
                      
                      <form onSubmit={handleRegistration} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Nama Lengkap Calon Siswa
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                name="studentName"
                                required
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                disabled={isLoading}
                              />
                              <User className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Tanggal Lahir
                            </label>
                            <div className="relative">
                              <input
                                type="date"
                                name="birthDate"
                                required
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                disabled={isLoading}
                              />
                              <Calendar className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nama Orang Tua/Wali
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              name="parentName"
                              required
                              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                              disabled={isLoading}
                            />
                            <User className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nomor WhatsApp
                          </label>
                          <div className="relative">
                            <input
                              type="tel"
                              name="whatsapp"
                              required
                              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                              disabled={isLoading}
                            />
                            <Phone className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Alamat Lengkap
                          </label>
                          <div className="relative">
                            <textarea
                              name="address"
                              required
                              rows={3}
                              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                              disabled={isLoading}
                            ></textarea>
                            <MapPin className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Asal Sekolah (jika ada)
                          </label>
                          <div className="relative">
                            <input
                              type=" text"
                              name="previousSchool"
                             className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                              disabled={isLoading}
                            />
                            <School className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                          </div>
                        </div>
                        <div className="flex justify-end space-x-4 mt-6">
                          <button
                            type="button"
                            onClick={() => setIsRegistrationOpen(false)}
                            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            disabled={isLoading}
                          >
                            Batal
                          </button>
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-elegant flex items-center"
                          >
                            {isLoading ? (
                              <>
                                <Loader className="animate-spin h-5 w-5 mr-2" />
                                Memproses...
                              </>
                            ) : (
                              'Kirim Pendaftaran'
                            )}
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Login Modal */}
              <AnimatePresence>
                {isLoginOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                  >
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      className="bg-white rounded-lg p-8 max-w-md w-full shadow-card"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Login</h2>
                        <button 
                          onClick={() => {
                            setIsLoginOpen(false);
                            setLoginError('');
                            setLoginEmail('');
                            setLoginPassword('');
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-6 w-6" />
                        </button>
                      </div>
                      
                      {loginError && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                          {loginError}
                        </div>
                      )}
                      
                      <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                          <label className="block text-gray-700 mb-2">Email</label>
                          <input 
                            type="email"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500 transition-colors"
                            placeholder="Masukkan email"
                            required
                            disabled={isLoading}
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 mb-2">Password</label>
                          <input 
                            type="password"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500 transition-colors"
                            placeholder="Masukkan password"
                            required
                            disabled={isLoading}
                          />
                        </div>
                        <button 
                          type="submit"
                          disabled={isLoading}
                          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors button-hover shadow-elegant flex items-center justify-center"
                        >
                          {isLoading ? (
                            <>
                              <Loader className="animate-spin h-5 w-5 mr-2" />
                              Memproses...
                            </>
                          ) : (
                            'Login'
                          )}
                        </button>
                      </form>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        } />
      </Routes>
    </Router>
  );
}

export default App;