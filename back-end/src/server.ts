import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import Fastify from 'fastify';
import { middleware } from './middleware/middleware.js';
import Ajv from 'ajv'
import fastifyCookie from '@fastify/cookie';
import fastifyJwt from '@fastify/jwt';

dotenv.config();

const fastify = Fastify({
  logger: true,
  ajv: { 
    customOptions: { 
      coerceTypes: true, 
    } 
  }
})

// Input Validation 
export const ajv = new Ajv({ allErrors: true });

// CORS
const frontend_url = process.env.FRONTEND_URL
if (!frontend_url) {
  throw new Error('FRONTEND_URL env variable not found')
}

import fastifyCors from '@fastify/cors'
import authRoutes from './routes/authRoutes.js';
import mongoose from 'mongoose';
await fastify.register(fastifyCors, {
  origin: [frontend_url],
  methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
  credentials: true,
  allowedHeaders: [       // common headers you'll need
    'Content-Type',
    'Authorization',
    'Cookie'
  ]
})


// Cookies and Token
const cookie_secret = process.env.COOKIE_SECRET
if (!cookie_secret) {
  throw new Error('COOKIE_SECRET env variable not found')
}
const jwt_secret = process.env.JWT_SECRET
if (!jwt_secret) {
  throw new Error('JWT_SECRET env variable not found')
}

// Register cookie + JWT plugin, configuring access‐token cookie
await fastify.register(fastifyCookie, {
  secret: cookie_secret
})

await fastify.register(fastifyJwt, {
  secret: jwt_secret,
})

// Add middleware
fastify.addHook('preHandler', middleware);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI!)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    console.log('📦 Database:', process.env.MONGODB_URI);
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

// Registering Routes
fastify.register(authRoutes);

const PORT = Number(process.env.PORT) || 5000;
// Run the server!
try {
  await fastify.listen({ port: PORT, host: '0.0.0.0' });
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log('🌐 Frontend URL:', frontend_url);
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}


