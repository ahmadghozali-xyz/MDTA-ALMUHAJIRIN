import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Upload, X, Calendar, FileText } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Activity } from '../../types';

export function Activities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    image_url: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchActivities();
  }, []);

  async function fetchActivities() {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('event_date', { ascending: false });

      if (error) throw error;
      console.log('Data kegiatan:', data);
      setActivities(data || []);
    } catch (error) {
      console.error('Error mengambil data kegiatan:', error);
      alert('Terjadi kesalahan saat mengambil data kegiatan');
    }
  }

  async function handleImageUpload(file: File) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}${Date.now()}.${fileExt}`;
      const filePath = fileName;

      // Upload file to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('activities')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('activities')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      let imageUrl = formData.image_url;
      if (imageFile) {
        imageUrl = await handleImageUpload(imageFile);
      }

      const submitData = {
        ...formData,
        image_url: imageUrl,
      };

      if (selectedActivity) {
        const { error } = await supabase
          .from('activities')
          .update(submitData)
          .eq('id', selectedActivity.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('activities')
          .insert(submitData);

        if (error) throw error;
      }

      setIsModalOpen(false);
      setSelectedActivity(null);
      setFormData({
        title: '',
        description: '',
        event_date: '',
        image_url: '',
      });
      setImageFile(null);
      setImagePreview('');
      fetchActivities();
    } catch (error: any) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat menyimpan kegiatan');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Apakah Anda yakin ingin menghapus kegiatan ini?')) return;

    try {
      const activity = activities.find(a => a.id === id);
      if (activity?.image_url) {
        const filePath = activity.image_url.split('/').pop();
        if (filePath) {
          await supabase.storage
            .from('activities')
            .remove([filePath]);
        }
      }

      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchActivities();
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat menghapus kegiatan');
    }
  }

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Hanya file gambar yang diperbolehkan');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file maksimal 5MB');
        return;
      }

      setImageFile(file);
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Kegiatan Madrasah</h1>
        <button
          onClick={() => {
            setSelectedActivity(null);
            setFormData({
              title: '',
              description: '',
              event_date: '',
              image_url: '',
            });
            setImageFile(null);
            setImagePreview('');
            setIsModalOpen(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Tambah Kegiatan
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map((activity) => (
          <div key={activity.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {activity.image_url && (
              <div className="relative h-48">
                <img
                  src={activity.image_url}
                  alt={activity.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{activity.title}</h3>
              <p className="text-gray-600 text-sm mb-2">
                {new Date(activity.event_date).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <p className="text-gray-700 mb-4">{activity.description}</p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setSelectedActivity(activity);
                    setFormData({
                      title: activity.title,
                      description: activity.description || '',
                      event_date: activity.event_date.split('T')[0],
                      image_url: activity.image_url || '',
                    });
                    setImagePreview(activity.image_url || '');
                    setIsModalOpen(true);
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Pencil className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(activity.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

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
              className="bg-white rounded-lg p-8 max-w-md w-full"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {selectedActivity ? 'Edit Kegiatan' : 'Tambah Kegiatan'}
                </h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Judul Kegiatan</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Tanggal Kegiatan</label>
                  <input
                    type="date"
                    value={formData.event_date}
                    onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Deskripsi</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500"
                    rows={4}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Gambar</label>
                  <div className="space-y-4">
                    {imagePreview && (
                      <div className="relative w-full h-48 rounded-lg overflow-hidden">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview('');
                            setFormData({ ...formData, image_url: '' });
                          }}
                          className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200">
                        <Upload className="h-5 w-5 mr-2" />
                        <span>Pilih File</span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageSelect}
                          disabled={isLoading}
                        />
                      </label>
                      {imageFile && (
                        <span className="text-sm text-gray-600">
                          {imageFile.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                    disabled={isLoading}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Menyimpan...
                      </>
                    ) : (
                      selectedActivity ? 'Simpan Perubahan' : 'Tambah'
                    )}
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