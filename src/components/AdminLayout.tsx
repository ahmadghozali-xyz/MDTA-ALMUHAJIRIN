import React, { useState } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { BookOpen, Calendar, Users, CreditCard, LogOut, Home, ChevronRight, Wallet, Menu, X, UserPlus } from 'lucide-react';

export function AdminLayout() {
  const { user, signOut } = useAuthStore();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!user) {
    return <Navigate to="/" />;
  }

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/admin' },
    { icon: Users, label: 'Data Siswa', path: '/admin/siswa' },
    { icon: CreditCard, label: 'Pembayaran SPP', path: '/admin/pembayaran' },
    { icon: Wallet, label: 'Manajemen Kas', path: '/admin/kas' },
    { icon: Calendar, label: 'Kegiatan', path: '/admin/kegiatan' },
    { icon: UserPlus, label: 'Pendaftaran', path: '/admin/pendaftaran' },
  ];

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Desktop Sidebar */}
      <motion.div 
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        className="hidden md:block w-72 bg-gradient-to-b from-green-800 to-green-900 text-white"
      >
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <BookOpen className="h-8 w-8 text-white" />
            <div>
              <h1 className="text-xl font-bold">Admin Panel MDTA</h1>
              <p className="text-sm text-green-300 mt-1">{user.email}</p>
            </div>
          </div>
        </div>
        
        <nav className="mt-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-6 py-4 text-sm transition-all relative ${
                  isActive 
                    ? 'text-white bg-green-700/30 border-r-4 border-white' 
                    : 'text-green-100 hover:bg-green-700/20'
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.label}
                {isActive && (
                  <ChevronRight className="h-4 w-4 ml-auto" />
                )}
              </Link>
            );
          })}
          
          <button
            onClick={() => signOut()}
            className="flex items-center px-6 py-4 text-sm w-full text-green-100 hover:bg-green-700/20 transition-all mt-4"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Keluar
          </button>
        </nav>
      </motion.div>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-20 bg-white shadow-md">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <BookOpen className="h-6 w-6 text-green-700" />
            <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={closeMobileMenu}
          >
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="absolute top-0 left-0 bottom-0 w-72 bg-gradient-to-b from-green-800 to-green-900 text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center space-x-3">
                  <BookOpen className="h-8 w-8 text-white" />
                  <div>
                    <h1 className="text-xl font-bold">Admin Panel</h1>
                    <p className="text-sm text-green-300 mt-1">{user.email}</p>
                  </div>
                </div>
              </div>
              
              <nav className="mt-6">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={closeMobileMenu}
                      className={`flex items-center px-6 py-4 text-sm transition-all relative ${
                        isActive 
                          ? 'text-white bg-green-700/30 border-r-4 border-white' 
                          : 'text-green-100 hover:bg-green-700/20'
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {item.label}
                      {isActive && (
                        <ChevronRight className="h-4 w-4 ml-auto" />
                      )}
                    </Link>
                  );
                })}
                
                <button
                  onClick={() => {
                    signOut();
                    closeMobileMenu();
                  }}
                  className="flex items-center px-6 py-4 text-sm w-full text-green-100 hover:bg-green-700/20 transition-all mt-4"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Keluar
                </button>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-gray-50">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-4 md:p-8 mt-16 md:mt-0"
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
}