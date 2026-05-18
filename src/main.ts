import * as path from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

const originalPort = process.env.PORT;
try {
  dotenv.config({ path: path.join(__dirname, '..', '.env') });
} catch (e) {}
if (originalPort) {
  process.env.PORT = originalPort;
}

// Debug: write what environment variables are actually available
try {
  const envKeys = Object.keys(process.env).join(', ');
  const dbStatus = process.env.DATABASE_URL ? 'PRESENT' : 'MISSING';
  const logContent = `[${new Date().toISOString()}] ENV KEYS: ${envKeys}\nDATABASE_URL is ${dbStatus}\nPORT: ${process.env.PORT}\n`;
  fs.writeFileSync(path.join(__dirname, '..', 'env-debug.log'), logContent);
} catch (e) {}

import * as express from 'express';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    // Allow self-signed certs for Aiven
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    
    const app = await NestFactory.create(AppModule);
    
    app.enableCors();
    
    // Serve premium static dashboard landing page at the root route
    app.use(express.static(path.join(__dirname, '..', 'public')));
    
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      transform: true,
    }));

    const port = process.env.PORT || 3000;
    await app.listen(port);
    
    try {
      fs.writeFileSync(path.join(__dirname, '..', 'startup-success.log'), `[${new Date().toISOString()}] Successfully started on port ${port}\n`);
    } catch (e) {}

    console.log(`Application is running on: ${await app.getUrl()}`);
  } catch (err: any) {
    try {
      fs.writeFileSync(path.join(__dirname, '..', 'startup-crash.log'), `[${new Date().toISOString()}] FATAL BOOTSTRAP CRASH:\nMessage: ${err.message}\nStack: ${err.stack}\n`);
    } catch (e) {}
    console.error('FATAL STARTUP CRASH', err);
    process.exit(1);
  }
}
bootstrap();
