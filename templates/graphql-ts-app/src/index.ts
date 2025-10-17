import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { typeDefs } from './schema/typeDefs.js';
import { resolvers } from './resolvers/index.js';
import { Context } from './types/context.js';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Apollo Server setup
const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,
  introspection: process.env.NODE_ENV !== 'production',
});

await server.start();

// Middlewares
app.use(cors());
app.use(express.json());

// GraphQL endpoint
app.use(
  '/graphql',
  expressMiddleware(server, {
    context: async ({ req }): Promise<Context> => ({
      token: req.headers.authorization || '',
    }),
  })
);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    graphql: '/graphql',
  });
});

// Root route
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'GraphQL TypeScript API Server',
    graphql: `http://localhost:${PORT}/graphql`,
    health: `http://localhost:${PORT}/health`,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
});
