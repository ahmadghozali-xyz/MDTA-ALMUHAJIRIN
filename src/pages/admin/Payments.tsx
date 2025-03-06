import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Check, X, Calendar, CreditCard, Users, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Student } from '../../types';

interface Payment {
  id: string;
  student_id: string;
  amount: number;
  month: number;
  academic_year: string;
  status: 'paid' | 'unpaid';
  payment_date?: string;
}

interface StudentPayment extends Student {
  payments: Payment[];
}

export function Payments() {
  const [students, setStudents] = useState<StudentPayment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('2024/2025');
  const [loading, setLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState<string>('all');

  useEffect(() => {
    fetchStudentsWithPayments();
  }, [selectedYear]);

  async function fetchStudentsWithPayments() {
    setLoading(true);
    try {
      // Fetch students
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select('*')
        .order('class')
        .order('name');

      if (studentsError) throw studentsError;

      // Fetch payments for all students
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select('*')
        .eq('academic_year', selectedYear);

      if (paymentsError) throw paymentsError;

      // Combine students with their payments
      const studentsWithPayments = studentsData.map(student => ({
        ...student,
        payments: paymentsData.filter(payment => payment.student_id === student.id)
      }));

      setStudents(studentsWithPayments);
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat mengambil data');
    } finally {
      setLoading(false);
    }
  }

  async function handlePaymentConfirmation(studentId: string, month: number, currentStatus: string) {
    if (!confirm(
      currentStatus === 'unpaid' 
        ? 'Konfirmasi pembayaran SPP?' 
        : 'Batalkan status pembayaran SPP?'
    )) return;

    setLoading(true);
    const newStatus = currentStatus === 'unpaid' ? 'paid' : 'unpaid';
    const paymentDate = newStatus === 'paid' ? new Date().toISOString() : null;

    try {
      const { error } = await supabase
        .from('payments')
        .upsert({
          student_id: studentId,
          month,
          academic_year: selectedYear,
          amount: 250000,
          status: newStatus,
          payment_date: paymentDate
        }, {
          onConflict: 'student_id,month,academic_year'
        });

      if (error) throw error;

      // Refresh data
      await fetchStudentsWithPayments();
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat mengupdate pembayaran');
    } finally {
      setLoading(false);
    }
  }

  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.nis.includes(searchQuery);
    const matchesClass = selectedClass === 'all' || student.class === selectedClass;
    return matchesSearch && matchesClass;
  });

  // Calculate statistics
  const stats = {
    totalStudents: filteredStudents.length,
    totalPayments: filteredStudents.reduce((acc, student) => 
      acc + student.payments.filter(p => p.status === 'paid').length, 0
    ),
    totalUnpaid: filteredStudents.reduce((acc, student) => 
      acc + student.payments.filter(p => p.status === 'unpaid').length, 0
    )
  };

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pembayaran SPP</h1>
          <p className="text-gray-600 mt-1">Kelola pembayaran SPP siswa</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="2024/2025">2024/2025</option>
            <option value="2025/2026">2025/2026</option>
          </select>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-4 sm:p-6 rounded-xl shadow-elegant"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Siswa</p>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-1">
                {stats.totalStudents} Siswa
              </h3>
            </div>
            <div className="p-3 bg-gray-100 rounded-full">
              <Users className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-xl shadow-elegant"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm">Total Pembayaran Lunas</p>
              <h3 className="text-2xl font-bold text-green-700 mt-1">
                {stats.totalPayments} Pembayaran
              </h3>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Check className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-elegant"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm">Total Belum Bayar</p>
              <h3 className="text-2xl font-bold text-red-700 mt-1">
                {stats.totalUnpaid} Pembayaran
              </h3>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </motion.div>
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
              placeholder="Cari berdasarkan nama atau NIS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
          
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">Semua Kelas</option>
            <option value="1A">Kelas 1</option>
            <option value="2A">Kelas 2</option>
            <option value="3A">Kelas 3</option>
            <option value="4A">Kelas 4</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50">
                  Siswa
                </th>
                {months.map((month, index) => (
                  <th 
                    key={month} 
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[140px]"
                  >
                    {month}
                  </th>
                ))}
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
                  <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-white">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{student.name}</div>
                      <div className="text-sm text-gray-500">NIS: {student.nis}</div>
                      <div className="text-sm text-gray-500">Kelas: {student.class}</div>
                    </div>
                  </td>
                  {months.map((month, index) => {
                    const payment = student.payments.find(p => p.month === index + 1);
                    const status = payment?.status || 'unpaid';
                    
                    return (
                      <td key={month} className="px-6 py-4 text-center">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handlePaymentConfirmation(student.id, index + 1, status)}
                          disabled={loading}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            status === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          } transition-colors`}
                        >
                          {status === 'paid' ? (
                            <>
                              <Check className="h-4 w-4 mr-1" />
                              Lunas
                            </>
                          ) : (
                            <>
                              <X className="h-4 w-4 mr-1" />
                              Belum
                            </>
                          )}
                        </motion.button>
                      </td>
                    );
                  })}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 border-t pt-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Keterangan:</h3>
          <div className="flex space-x-6">
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 bg-green-100 rounded-full mr-2"></span>
              <span className="text-sm text-gray-600">Lunas</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 bg-yellow-100 rounded-full mr-2"></span>
              <span className="text-sm text-gray-600">Belum Lunas</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            * Status pembayaran SPP akan tersimpan secara permanen di database.
          </p>
        </div>
      </motion.div>
    </div>
  );
}