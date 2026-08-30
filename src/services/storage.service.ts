import { supabase } from '@/lib/supabase';

export class StorageService {
  /**
   * Upload an image (cover/thumbnail/media) to Supabase Storage bucket
   * Tries buckets: 'materials', 'modules', 'covers', 'public'
   * If bucket is unavailable or offline, gracefully returns optimized Base64 string.
   */
  static async uploadImage(file: File, folder: string = 'covers'): Promise<string> {
    if (supabase) {
      try {
        const ext = file.name.split('.').pop() || 'jpg';
        const cleanName = file.name.replace(/[^a-zA-Z0-9]/g, '_');
        const filePath = `${folder}/${Date.now()}_${cleanName}.${ext}`;

        const possibleBuckets = ['materials', 'modules', 'covers', 'public', 'assets'];

        for (const bucket of possibleBuckets) {
          try {
            const { data, error } = await supabase.storage
              .from(bucket)
              .upload(filePath, file, {
                cacheControl: '3600',
                upsert: true,
              });

            if (!error && data) {
              const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
              if (urlData?.publicUrl) {
                return urlData.publicUrl;
              }
            }
          } catch {
            // Try next bucket
          }
        }
      } catch (err) {
        console.warn('Supabase storage upload fallback:', err);
      }
    }

    // High-performance Base64 fallback
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const raw = e.target?.result as string;
        resolve(raw);
      };
      reader.readAsDataURL(file);
    });
  }
}
