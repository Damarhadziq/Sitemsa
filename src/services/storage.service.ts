import { supabase } from '@/lib/supabase';

export class StorageService {
  /**
   * Upload an image (cover/thumbnail/media) to Supabase Storage bucket
   * Primary bucket: 'sintesa_uploads'
   * If bucket is unavailable, gracefully returns optimized Base64 string.
   */
  static async uploadImage(file: File, folder: string = 'covers'): Promise<string> {
    if (supabase) {
      try {
        const ext = file.name.split('.').pop() || 'jpg';
        const cleanName = file.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
        const filePath = `${folder}/${Date.now()}_${cleanName}.${ext}`;

        const possibleBuckets = ['sintesa_uploads', 'materials', 'modules', 'covers', 'public', 'assets'];

        for (const bucket of possibleBuckets) {
          try {
            const { data, error } = await supabase.storage
              .from(bucket)
              .upload(filePath, file, {
                cacheControl: '3600',
                upsert: true,
                contentType: file.type || 'image/jpeg',
              });

            if (error) {
              console.warn(`Supabase storage [${bucket}] upload note:`, error.message);
              continue;
            }

            if (data) {
              const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
              if (urlData?.publicUrl) {
                console.log(`Successfully uploaded to bucket [${bucket}]:`, urlData.publicUrl);
                return urlData.publicUrl;
              }
            }
          } catch (bucketErr) {
            console.warn(`Error attempting bucket [${bucket}]:`, bucketErr);
          }
        }
      } catch (err) {
        console.warn('Supabase storage upload exception:', err);
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
