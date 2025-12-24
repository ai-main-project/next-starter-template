import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { env } from '@/lib/config/env';

const S3 = new S3Client({
  region: 'auto',
  endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Double check size on server
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds 5MB' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = file.name.replace(/[^a-zA-Z0-9.-]/g, '');
    const key = `${uniqueSuffix}-${filename}`;

    await S3.send(new PutObjectCommand({
      Bucket: env.R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    }));

    // Construct public URL
    const url = `${env.PUBLIC_URL_BASE}/${key}`;

    return NextResponse.json({ 
      success: true, 
      url: url,
      key: key
    });

  } catch (error) {
    console.error('Error uploading to R2:', error);
    return NextResponse.json(
      { error: 'Failed to upload image', details: String(error) }, 
      { status: 500 }
    );
  }
}
