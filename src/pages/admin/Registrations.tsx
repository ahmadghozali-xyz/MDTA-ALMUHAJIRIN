import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Search, Edit2, Calendar, User, Phone, MapPin, School } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Registration {
  id: string;
  student_name: string;
  birth_date: string;
  parent_name: string;
  whatsapp: string;
  address: string;
  previous_school?: string;
  status: 'pending' | 'approved' | 'rejected';
  registration_date: string;
}

export function Registrations() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('1A');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  async function fetchRegistrations() {
    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .order('registration_date', { ascending: false });

    if (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat mengambil data pendaftaran');
      return;
    }

    setRegistrations(data || []);
  }

  async function handleApprove(registration: Registration) {
    setLoading(true);
    try {
      // Tambahkan siswa baru
      const { error: studentError } = await supabase
        .from('students')
        .insert({
          name: registration.student_name,
          class: selectedClass,
          gender: 'L', // Default, bisa diubah nanti
          nis: new Date().getFullYear().toString() + Math.floor(Math.random() * 1000).toString().padStart(3, '0'),
          parent_name: registration.parent_name,
          phone: registration.whatsapp,
          address: registration.address
        });

      if (studentError) throw studentError;

      // Update status pendaftaran
      const { error: registrationError } = await supabase
        .from('registrations')
        .update({ status: 'approved' })
        .eq('id', registration.id);

      if (registrationError) throw registrationError;

      alert('Siswa berhasil ditambahkan!');
      setIsModalOpen(false);
      fetchRegistrations();
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat memproses pendaftaran');
    } finally {
      setLoading(false);
    }
  }

  async function handleReject(id: string) {
    try {
      const { error } = await supabase
        .from('registrations')
        .update({ status: 'rejected' })
        .eq('id', id);

      if (error) throw error;

      fetchRegistrations();
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat menolak pendaftaran');
    }
  }

  const filteredRegistrations = registrations.filter(registration =>
    registration.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    registration.parent_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pendaftaran Siswa Baru</h1>
          <p className="text-gray-600 mt-1">Kelola pendaftaran siswa baru MDTA Al Muhajirin</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-elegant p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Cari berdasarkan nama..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orang Tua</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRegistrations.map((registration) => (
                <tr key={registration.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(registration.registration_date).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{registration.student_name}</div>
                    <div className="text-sm text-gray-500">{registration.whatsapp}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {registration.parent_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      registration.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : registration.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {registration.status === 'approved'
                        ? 'Diterima'
                        : registration.status === 'rejected'
                        ? 'Ditolak'
                        : 'Menunggu'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {registration.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedRegistration(registration);
                            setIsModalOpen(true);
                          }}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Check className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleReject(registration.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Konfirmasi */}
      <AnimatePresence>
        {isModalOpen && selectedRegistration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-lg p-6 max-w-lg w-full"
            >
              <h2 className="text-xl font-bold mb-4">Konfirmasi Pendaftaran</h2>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pilih Kelas
                  </label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="1A">Kelas 1</option>
                    <option value="2A">Kelas 2</option>
                    <option value="3A">Kelas 3</option>
                    <option value="4A">Kelas 4</option>
                  </select>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Detail Pendaftaran:</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Nama:</span> {selectedRegistration.student_name}</p>
                    <p><span className="font-medium">Tanggal Lahir:</span> {selectedRegistration.birth_date}</p>
                    <p><span className="font-medium">Orang Tua:</span> {selectedRegistration.parent_name}</p>
                    <p><span className="font-medium">WhatsApp:</span> {selectedRegistration.whatsapp}</p>
                    <p><span className="font-medium">Alamat:</span> {selectedRegistration.address}</p>
                    {selectedRegistration.previous_school && (
                      <p><span className="font-medium">Sekolah Sebelumnya:</span> {selectedRegistration.previous_school}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Batal
                </button>
                <button
                  onClick={() => handleApprove(selectedRegistration)}
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  {loading ? 'Memproses...' : 'Terima dan Tambahkan'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}