import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, ArrowLeft, Search, Phone, MapPin, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Activity } from '../types';

export function PublicActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  async function fetchActivities() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('event_date', { ascending: false });

      if (error) throw error;
      
      console.log('Fetched activities:', data); // Untuk debugging
      setActivities(data || []);
    } catch (error) {
      console.error('Error mengambil data kegiatan:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredActivities = activities.filter(activity =>
    activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    activity.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm fixed w-full z-50 shadow-elegant">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <BookOpen className="h-8 w-8 text-green-700" />
                <span className="ml-2 text-xl font-bold gradient-text">MDA Al Muhajirin</span>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/#beranda" className="text-green-800 hover:text-green-600 transition-colors">Beranda</Link>
              <Link to="/#visi-misi" className="text-green-800 hover:text-green-600 transition-colors">Visi & Misi</Link>
              <Link to="/#tentang" className="text-green-800 hover:text-green-600 transition-colors">Tentang</Link>
              <Link to="/kegiatan" className="text-green-800 hover:text-green-600 transition-colors">Kegiatan</Link>
            </div>
            <Link 
              to="/" 
              className="flex items-center text-green-700 hover:text-green-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section 
        className="relative pt-32 pb-20 bg-green-800"
        style={{
          backgroundImage: "url('https://albbftgsplpqepfhtllv.supabase.co/storage/v1/object/public/background//PXL_20250124_092544024.jpg?q=80&w=2940&auto=format&fit=crop')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-green-900/70 backdrop-blur-sm"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white mb-4"
          >
            Kegiatan Madrasah
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/90"
          >
            Dokumentasi kegiatan dan acara di MDA Al Muhajirin
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Activities from Database */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari kegiatan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                />
                <Search className="h-5 w-5 text-gray-400 absolute left-4 top-3.5" />
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
                <p className="text-gray-600 mt-4">Memuat kegiatan...</p>
              </div>
            ) : filteredActivities.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Tidak ada kegiatan yang ditemukan.</p>
              </div>
            ) : (
              <div className="grid gap-8">
                {filteredActivities.map((activity) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-elegant overflow-hidden hover:shadow-lg transition-all group"
                  >
                    {activity.image_url && (
                      <div className="relative overflow-hidden h-64 md:h-96">
                        <img
                          src={activity.image_url}
                          alt={activity.title}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(activity.event_date).toLocaleDateString('id-ID', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{activity.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{activity.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:sticky lg:top-24 space-y-8">
            {/* Contact Info */}
            <div className="bg-white rounded-xl shadow-elegant p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Informasi Kontak</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <MapPin className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium text-gray-900">Alamat</h3>
                    <p className="text-gray-600">
                      Jl. Uka, Perumahan Garuda Permai II<br />
                      Kec. Tampan, Kota Pekanbaru<br />
                      Provinsi Riau
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Phone className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium text-gray-900">Telepon</h3>
                    <p className="text-gray-600">(0761) 1234567</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Mail className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium text-gray-900">Email</h3>
                    <p className="text-gray-600">info@almuhajirin.ac.id</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Facebook Timeline */}
            <div className="bg-white rounded-xl shadow-elegant p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Update Facebook</h2>
              <div className="fb-page-wrapper rounded-lg overflow-hidden">
                <div 
                  className="fb-page" 
                  data-href="https://www.facebook.com/profile.php?id=100092454940466"
                  data-tabs="timeline"
                  data-width="500"
                  data-height="800"
                  data-small-header="true"
                  data-adapt-container-width="true"
                  data-hide-cover="false"
                  data-show-facepile="false"
                >
                  <blockquote 
                    cite="https://www.facebook.com/profile.php?id=100092454940466" 
                    className="fb-xfbml-parse-ignore"
                  >
                    <a href="https://www.facebook.com/profile.php?id=100092454940466">
                      MDA Al Muhajirin
                    </a>
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-green-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 gradient-text">MDA Al Muhajirin</h3>
              <p className="text-green-100">
                Membentuk generasi Qurani yang berakhlak mulia dan berwawasan global.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Menu</h3>
              <ul className="space-y-2 text-green-100">
                <li><Link to="/#beranda" className="hover:text-white transition-colors">Beranda</Link></li>
                <li><Link to="/#visi-misi" className="hover:text-white transition-colors">Visi & Misi</Link></li>
                <li><Link to="/#tentang" className="hover:text-white transition-colors">Tentang</Link></li>
                <li><Link to="/kegiatan" className="hover:text-white transition-colors">Kegiatan</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Sosial Media</h3>
              <div className="space-y-2 text-green-100">
                <a 
                  href="https://www.facebook.com/profile.php?id=100092454940466"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors block"
                >
                  Facebook
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-green-800 mt-8 pt-8 text-center text-green-100">
            © 2025 Madrasah Al Muhajirin. Hak Cipta Dilindungi.
          </div>
        </div>
      </footer>
    </div>
  );
}