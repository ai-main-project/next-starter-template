import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import packageJson from '../../../../package.json';



export async function GET() {
  const healthData: any = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: packageJson.version,
    environment: process.env.NODE_ENV,
    checks: {
      database: 'unknown',
    },
  };

  try {
    const { env } = await getCloudflareContext({ async: true });
    
    if (env.DB) {
      // Perform a simple query to verify database connectivity
      await env.DB.prepare('SELECT 1').run();
      healthData.checks.database = 'connected';
    } else {
      healthData.status = 'degraded';
      healthData.checks.database = 'missing_binding';
    }
  } catch (error) {
    console.error('Health check database error:', error);
    healthData.status = 'error';
    healthData.checks.database = 'error';
    healthData.error = String(error);
  }

  const statusCode = healthData.status === 'error' ? 503 : 200;
  
  return NextResponse.json(healthData, { 
    status: statusCode,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    }
  });
}
