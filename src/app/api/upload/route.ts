import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient, supabase as clientSupabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'covers';
    const bucket = (formData.get('bucket') as string) || 'sintesa_uploads';

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    const ext = file.name.split('.').pop() || 'jpg';
    const cleanName = file.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    const filePath = `${folder}/${Date.now()}_${cleanName}.${ext}`;

    const supabase = getSupabaseServerClient() || clientSupabase;

    if (!supabase) {
      return NextResponse.json({ success: false, error: 'Supabase is not configured' }, { status: 500 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const candidateBuckets = [bucket, 'sintesa_uploads', 'attachments', 'materials', 'public'];
    const tried = new Set<string>();

    let lastError: any = null;

    for (const b of candidateBuckets) {
      if (tried.has(b)) continue;
      tried.add(b);

      try {
        // Attempt direct upload
        let { data, error } = await supabase.storage
          .from(b)
          .upload(filePath, buffer, {
            contentType: file.type || 'application/octet-stream',
            cacheControl: '3600',
            upsert: true,
          });

        // If bucket not found, attempt to create it as a public bucket
        if (error && (error.message?.toLowerCase().includes('bucket not found') || (error as any).statusCode === 404)) {
          try {
            await supabase.storage.createBucket(b, { public: true });
            const retry = await supabase.storage.from(b).upload(filePath, buffer, {
              contentType: file.type || 'application/octet-stream',
              cacheControl: '3600',
              upsert: true,
            });
            data = retry.data;
            error = retry.error;
          } catch (createErr) {
            console.warn(`Could not auto-create bucket [${b}]:`, createErr);
          }
        }

        if (!error && data) {
          const { data: urlData } = supabase.storage.from(b).getPublicUrl(filePath);
          const publicUrl = urlData?.publicUrl || '';

          return NextResponse.json({
            success: true,
            url: publicUrl,
            filePath,
            bucket: b,
          });
        }

        if (error) {
          lastError = error;
          console.warn(`Upload note on bucket [${b}]:`, error.message);
        }
      } catch (err: any) {
        lastError = err;
      }
    }

    return NextResponse.json({ success: false, error: lastError?.message || 'Failed to upload to storage' }, { status: 500 });
  } catch (err: any) {
    console.error('Server upload exception:', err);
    return NextResponse.json({ success: false, error: err.message || 'Upload failed' }, { status: 500 });
  }
}
