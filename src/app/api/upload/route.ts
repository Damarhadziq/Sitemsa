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

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType: file.type || 'application/octet-stream',
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      console.warn(`Upload error to bucket [${bucket}]:`, error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
    const publicUrl = urlData?.publicUrl || '';

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filePath,
      bucket,
    });
  } catch (err: any) {
    console.error('Server upload exception:', err);
    return NextResponse.json({ success: false, error: err.message || 'Upload failed' }, { status: 500 });
  }
}
