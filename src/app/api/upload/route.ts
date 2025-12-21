import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const R2_ACCOUNT_ID = 'f1c43c6342e59758f2b37b268b02b514';
const R2_ACCESS_KEY_ID = '318d41de2442e2c51ae3ebeed0a47451';
const R2_SECRET_ACCESS_KEY = 'b858d579b5840e0aeebdd6ae8547cb542ed845ffe8438844386bcfb95374ebca';
const R2_BUCKET_NAME = 'vist-blog';
// Ideally this should be an environment variable or a custom domain
// For now, we'll assume a public bucket url pattern or ask user to configure
const PUBLIC_URL_BASE = 'https://assets.vistwang.com'; 

const S3 = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
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
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    }));

    // Construct public URL
    // Note: The user needs to verify if this is their correct public domain
    const url = `${PUBLIC_URL_BASE}/${key}`;

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
