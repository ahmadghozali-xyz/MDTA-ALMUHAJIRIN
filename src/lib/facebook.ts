import { supabase } from './supabase';

const FB_PAGE_ID = '100092454940466';

export interface FacebookPost {
  id: string;
  message?: string;
  full_picture?: string;
  created_time: string;
  permalink_url: string;
}

export async function fetchFacebookPosts(): Promise<FacebookPost[]> {
  try {
    // Menggunakan endpoint publik Facebook Graph API
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${FB_PAGE_ID}/posts?fields=message,full_picture,created_time,permalink_url&limit=10`
    );
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }

    // Simpan post di Supabase untuk caching
    const { error } = await supabase
      .from('facebook_posts')
      .upsert(
        data.data.map((post: FacebookPost) => ({
          id: post.id,
          message: post.message || '',
          image_url: post.full_picture || '',
          created_at: post.created_time,
          permalink_url: post.permalink_url
        })),
        { onConflict: 'id' }
      );

    if (error) {
      console.error('Error menyimpan cache post Facebook:', error);
    }

    return data.data;
  } catch (error) {
    console.error('Error mengambil post Facebook:', error);
    
    // Gunakan data cache dari Supabase jika gagal mengambil dari Facebook
    const { data: cachedPosts } = await supabase
      .from('facebook_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (cachedPosts) {
      // Ubah format data cache agar sesuai dengan format Facebook API
      return cachedPosts.map(post => ({
        id: post.id,
        message: post.message,
        full_picture: post.image_url,
        created_time: post.created_at,
        permalink_url: post.permalink_url
      }));
    }

    return [];
  }
}