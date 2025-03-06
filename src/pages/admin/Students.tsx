import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Search, UserPlus, X, School, Phone, MapPin, Users, Filter } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../lib/supabase';
import { Student } from '../../types';

export function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState<string>('all');
  const [genderFilter, setGenderFilter] = useState<'all' | 'L' | 'P'>('all');
  const [formData, setFormData] = useState({
    nis: '',
    name: '',
    class: '1A',
    gender: 'L' as 'L' | 'P',
    address: '',
    parent_name: '',
    phone: '',
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  async function fetchStudents() {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('class', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      alert('Error mengambil data siswa: ' + error.message);
      return;
    }

    setStudents(data);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (selectedStudent) {
      const { error } = await supabase
        .from('students')
        .update(formData)
        .eq('id', selectedStudent.id);

      if (error) {
        alert('Error mengupdate siswa: ' + error.message);
        return;
      }
    } else {
      const { error } = await supabase
        .from('students')
        .insert(formData);

      if (error) {
        alert('Error menambah siswa: ' + error.message);
        return;
      }
    }

    setIsModalOpen(false);
    setSelectedStudent(null);
    setFormData({
      nis: '',
      name: '',
      class: '1A',
      gender: 'L',
      address: '',
      parent_name: '',
      phone: '',
    });
    fetchStudents();
  }

  async function handleDelete(id: string) {
    if (!confirm('Apakah Anda yakin ingin menghapus siswa ini?')) return;

    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Error menghapus siswa: ' + error.message);
      return;
    }

    fetchStudents();
  }

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.nis.includes(searchQuery) ||
      student.class.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesClass = classFilter === 'all' || student.class === classFilter;
    const matchesGender = genderFilter === 'all' || student.gender === genderFilter;

    return matchesSearch && matchesClass && matchesGender;
  });

  const studentStats = {
    total: filteredStudents.length,
    byClass: {
      '1A': filteredStudents.filter(s => s.class === '1A').length,
      '2A': filteredStudents.filter(s => s.class === '2A').length,
      '3A': filteredStudents.filter(s => s.class === '3A').length,
      '4A': filteredStudents.filter(s => s.class === '4A').length,
    },
    byGender: {
      L: filteredStudents.filter(s => s.gender === 'L').length,
      P: filteredStudents.filter(s => s.gender === 'P').length,
    }
  };

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Siswa</h1>
          <p className="text-gray-600 mt-1">Kelola data siswa MDTA Al Muhajirin</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setSelectedStudent(null);
            setFormData({
              nis: '',
              name: '',
              class: '1A',
              gender: 'L',
              address: '',
              parent_name: '',
              phone: '',
            });
            setIsModalOpen(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-700 transition-colors shadow-elegant"
        >
          <UserPlus className="h-5 w-5 mr-2" />
          Tambah Siswa
        </motion.button>
      </motion.div>

      {/* Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-elegant">
          <h3 className="text-sm font-medium text-gray-500">Total Siswa</h3>
          <p className="text-2xl font-bold text-gray-900">{studentStats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-elegant">
          <h3 className="text-sm font-medium text-gray-500">Siswa Laki-laki</h3>
          <p className="text-2xl font-bold text-blue-600">{studentStats.byGender.L}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-elegant">
          <h3 className="text-sm font-medium text-gray-500">Siswa Perempuan</h3>
          <p className="text-2xl font-bold text-pink-600">{studentStats.byGender.P}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-elegant">
          <h3 className="text-sm font-medium text-gray-500">Total Kelas</h3>
          <p className="text-2xl font-bold text-green-600">4</p>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-xl shadow-elegant p-6"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Cari berdasarkan nama, NIS, atau kelas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="pl-4 pr-8 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">Semua Kelas</option>
              <option value="1A">Kelas 1</option>
              <option value="2A">Kelas 2</option>
              <option value="3A">Kelas 3</option>
              <option value="4A">Kelas 4</option>
            </select>
            
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value as 'all' | 'L' | 'P')}
              className="pl-4 pr-8 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">Semua Jenis Kelamin</option>
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIS</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kelas</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. Telepon</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <motion.tr 
                  key={student.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.nis}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{student.name}</div>
                      {student.parent_name && (
                        <div className="text-sm text-gray-500">Wali: {student.parent_name}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 text-sm text-green-800 bg-green-100 rounded-full">
                      Kelas {student.class}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-sm rounded-full ${
                      student.gender === 'L' 
                        ? 'text-blue-800 bg-blue-100' 
                        : 'text-pink-800 bg-pink-100'
                    }`}>
                      {student.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.phone || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-3">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          setSelectedStudent(student);
                          setFormData({
                            nis: student.nis,
                            name: student.name,
                            class: student.class,
                            gender: student.gender,
                            address: student.address || '',
                            parent_name: student.parent_name || '',
                            phone: student.phone || '',
                          });
                          setIsModalOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <Pencil className="h-5 w-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(student.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Modal Form */}
      <AnimatePresence>
        {isModalOpen && (
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
              className="bg-white rounded-xl shadow-card p-8 max-w-md w-full"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedStudent ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}
                </h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">NIS</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.nis}
                      onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                    <School className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                    <Users className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kelas</label>
                    <select
                      value={formData.class}
                      onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    >
                      <option value="1A">Kelas 1</option>
                      <option value="2A">Kelas 2</option>
                      <option value="3A">Kelas 3</option>
                      <option value="4A">Kelas 4</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'L' | 'P' })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    >
                      <option value="L">Laki-laki</option>
                      <option value="P">Perempuan</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                  <div className="relative">
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      rows={3}
                    />
                    <MapPin className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Wali</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.parent_name}
                      onChange={(e) => setFormData({ ...formData, parent_name: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <Users className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">No. Telepon</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <Phone className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                  </div>
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-elegant"
                  >
                    {selectedStudent ? 'Simpan Perubahan' : 'Tambah Siswa'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}