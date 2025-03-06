import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, CreditCard, Calendar, TrendingUp, BookOpen, Clock, Check, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Student, Payment, Activity } from '../../types';

interface DashboardStats {
  totalStudents: number;
  paymentStats: {
    paid: number;
    unpaid: number;
    percentage: number;
  };
  activitiesThisMonth: number;
  attendanceRate: number;
}

interface RecentActivity {
  id: string;
  type: 'payment' | 'student' | 'activity';
  title: string;
  description: string;
  timestamp: string;
}

const StatCard = ({ icon: Icon, title, value, trend }: { 
  icon: React.ElementType; 
  title: string; 
  value: string | number;
  trend?: string;
}) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white p-6 rounded-xl shadow-elegant hover:shadow-lg transition-shadow"
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <div className="p-3 rounded-lg bg-green-50">
          <Icon className="h-6 w-6 text-green-600" />
        </div>
        <div className="ml-4">
          <h2 className="text-sm font-medium text-gray-600">{title}</h2>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
      {trend && (
        <div className="flex items-center text-green-600">
          <TrendingUp className="h-4 w-4 mr-1" />
          <span className="text-sm font-medium">{trend}</span>
        </div>
      )}
    </div>
  </motion.div>
);

const ActivityItem = ({ title, description, timestamp, icon: Icon }: {
  title: string;
  description: string;
  timestamp: string;
  icon: React.ElementType;
}) => (
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors"
  >
    <div className="p-2 rounded-full bg-green-50">
      <Icon className="h-5 w-5 text-green-600" />
    </div>
    <div>
      <h3 className="font-medium text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
      <p className="text-xs text-gray-400 mt-1">{timestamp}</p>
    </div>
  </motion.div>
);

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    paymentStats: {
      paid: 0,
      unpaid: 0,
      percentage: 0
    },
    activitiesThisMonth: 0,
    attendanceRate: 92
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      // Fetch students count
      const { count: studentsCount } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true });

      // Fetch payments for current month
      const currentMonth = new Date().getMonth() + 1;
      const { data: payments } = await supabase
        .from('payments')
        .select('*')
        .eq('month', currentMonth)
        .eq('academic_year', '2024/2025');

      const paidCount = payments?.filter(p => p.status === 'paid').length || 0;
      const totalPayments = payments?.length || 0;

      // Fetch activities for current month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data: activities } = await supabase
        .from('activities')
        .select('*')
        .gte('event_date', startOfMonth.toISOString())
        .order('created_at', { ascending: false });

      // Fetch recent activities
      const recentPayments = await supabase
        .from('payments')
        .select('*, students(name)')
        .eq('status', 'paid')
        .order('payment_date', { ascending: false })
        .limit(5);

      const recentActivitiesData = await supabase
        .from('activities')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      // Combine and sort recent activities
      const combinedActivities: RecentActivity[] = [
        ...(recentPayments.data?.map(payment => ({
          id: payment.id,
          type: 'payment' as const,
          title: 'Pembayaran SPP',
          description: `${(payment.students as any).name} telah melakukan pembayaran SPP`,
          timestamp: new Date(payment.payment_date!).toLocaleString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        })) || []),
        ...(recentActivitiesData.data?.map(activity => ({
          id: activity.id,
          type: 'activity' as const,
          title: activity.title,
          description: activity.description || '',
          timestamp: new Date(activity.created_at).toLocaleString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        })) || [])
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      setStats({
        totalStudents: studentsCount || 0,
        paymentStats: {
          paid: paidCount,
          unpaid: totalPayments - paidCount,
          percentage: totalPayments ? (paidCount / totalPayments) * 100 : 0
        },
        activitiesThisMonth: activities?.length || 0,
        attendanceRate: 92
      });

      setRecentActivities(combinedActivities);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard MDTA</h1>
          <p className="text-gray-600 mt-1">Selamat datang kembali, Admin</p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">
            {new Date().toLocaleDateString('id-ID', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={Users} 
          title="Total Siswa" 
          value={stats.totalStudents}
        />
        <StatCard 
          icon={CreditCard} 
          title="Pembayaran SPP Bulan Ini" 
          value={`${stats.paymentStats.percentage.toFixed(1)}%`}
          trend={`${stats.paymentStats.paid} dari ${stats.paymentStats.paid + stats.paymentStats.unpaid} siswa`}
        />
        <StatCard 
          icon={Calendar} 
          title="Kegiatan Bulan Ini" 
          value={stats.activitiesThisMonth}
        />
        <StatCard 
          icon={BookOpen} 
          title="Tingkat Kehadiran" 
          value={`${stats.attendanceRate}%`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Aktivitas Terbaru */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-elegant p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Aktivitas Terbaru</h2>
          {recentActivities.length > 0 ? (
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <ActivityItem 
                  key={activity.id}
                  title={activity.title}
                  description={activity.description}
                  timestamp={activity.timestamp}
                  icon={activity.type === 'payment' ? CreditCard : Calendar}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Belum ada aktivitas terbaru</p>
          )}
        </motion.div>

        {/* Statistik Pembayaran */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-elegant p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistik Pembayaran SPP Bulan Ini</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Lunas</span>
              <div className="flex items-center">
                <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 rounded-full" 
                    style={{ width: `${stats.paymentStats.percentage}%` }}
                  ></div>
                </div>
                <span className="ml-4 text-sm font-medium text-gray-900">
                  {stats.paymentStats.paid} siswa
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Belum Bayar</span>
              <div className="flex items-center">
                <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500 rounded-full" 
                    style={{ width: `${100 - stats.paymentStats.percentage}%` }}
                  ></div>
                </div>
                <span className="ml-4 text-sm font-medium text-gray-900">
                  {stats.paymentStats.unpaid} siswa
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}