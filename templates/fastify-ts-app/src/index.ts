import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';

dotenv.config();

const fastify: FastifyInstance = Fastify({
  logger: process.env.NODE_ENV === 'production'
    ? true
    : {
        transport: {
          target: 'pino-pretty',
          options: {
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname',
          },
        },
      },
});

// Wrap in async IIFE to use await
(async () => {
  await fastify.register(helmet);
  await fastify.register(cors);

  // Health check
  fastify.get('/health', async (request, reply) => {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  });

  // Root route
  fastify.get('/api', async (request, reply) => {
    return {
      success: true,
      message: 'Welcome to the Fastify TypeScript API',
      version: '1.0.0',
      endpoints: {
        users: '/api/users',
        health: '/health',
      },
    };
  });

  // Register routes
  await fastify.register(userRoutes, { prefix: '/api/users' });

  // Error handler
  fastify.setErrorHandler((error, request, reply) => {
    fastify.log.error(error);
    reply.status(error.statusCode || 500).send({
      success: false,
      message: error.message || 'Internal Server Error',
    });
  });

  // 404 handler
  fastify.setNotFoundHandler((request, reply) => {
    reply.status(404).send({
      success: false,
      message: 'Route not found',
    });
  });

  // Start server
  try {
    const PORT = parseInt(process.env.PORT || '3000', 10);
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    console.log(` Server is running on http://localhost:${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
})();