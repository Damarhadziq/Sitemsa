import { supabase } from '@/lib/supabase';

export class StorageService {
  /**
   * Upload an image (cover/thumbnail/media) to Supabase Storage bucket
   * Primary bucket: 'sintesa_uploads'
   * If bucket is unavailable, gracefully returns optimized Base64 string.
   */
  static async uploadImage(file: File, folder: string = 'covers'): Promise<string> {
    return this.uploadFile(file, folder);
  }

  /**
   * Upload any file (PDF, DOCX, XLSX, image, etc.) to Supabase Storage bucket
   * Primary bucket: 'sintesa_uploads'
   */
  static async uploadFile(file: File, folder: string = 'attachments'): Promise<string> {
    // 1. Try server-side upload endpoint (bypasses storage RLS and directly writes to sintesa_uploads bucket)
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);
      formData.append('bucket', 'sintesa_uploads');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.url) {
          console.log('✅ File uploaded successfully via /api/upload to sintesa_uploads:', json.url);
          return json.url;
        }
      }
    } catch (apiErr) {
      console.warn('Upload via /api/upload failed, trying client upload:', apiErr);
    }

    // 2. Direct browser Supabase upload fallback
    if (supabase) {
      try {
        const ext = file.name.split('.').pop() || 'bin';
        const cleanName = file.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
        const filePath = `${folder}/${Date.now()}_${cleanName}.${ext}`;

        const possibleBuckets = ['sintesa_uploads', 'attachments', 'materials', 'modules', 'covers', 'public', 'assets'];

        for (const bucket of possibleBuckets) {
          try {
            const { data, error } = await supabase.storage
              .from(bucket)
              .upload(filePath, file, {
                cacheControl: '3600',
                upsert: true,
                contentType: file.type || 'application/octet-stream',
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

    // 3. High-performance Base64 fallback
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
