import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { User, CreateUserBody, UpdateUserBody } from '../types/user';

// Mock database
let users: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
];

export default async function userRoutes(fastify: FastifyInstance, options: any) {
  // Schema definitions
  const userSchema = {
    type: 'object',
    properties: {
      id: { type: 'number' },
      name: { type: 'string' },
      email: { type: 'string', format: 'email' },
    },
  } as const;

  const createUserSchema = {
    body: {
      type: 'object',
      required: ['name', 'email'],
      properties: {
        name: { type: 'string', minLength: 1 },
        email: { type: 'string', format: 'email' },
      },
    },
  } as const;

  // Get all users
  fastify.get('/', {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'array', items: userSchema },
            count: { type: 'number' },
          },
        },
      },
    },
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      return {
        success: true,
        data: users,
        count: users.length,
      };
    },
  });

  // Get user by ID
  fastify.get<{ Params: { id: string } }>('/:id', {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
      },
    },
    handler: async (request, reply) => {
      const user = users.find(u => u.id === parseInt(request.params.id));
      
      if (!user) {
        return reply.status(404).send({
          success: false,
          message: 'User not found',
        });
      }

      return {
        success: true,
        data: user,
      };
    },
  });

  // Create user
  fastify.post<{ Body: CreateUserBody }>('/', {
    schema: createUserSchema,
    handler: async (request, reply) => {
      const { name, email } = request.body;
      const newUser: User = {
        id: users.length + 1,
        name,
        email,
      };

      users.push(newUser);

      return reply.status(201).send({
        success: true,
        message: 'User created successfully',
        data: newUser,
      });
    },
  });

  // Update user
  fastify.put<{ Params: { id: string }; Body: UpdateUserBody }>('/:id', {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
      },
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
        },
      },
    },
    handler: async (request, reply) => {
      const { id } = request.params;
      const { name, email } = request.body;
      const userIndex = users.findIndex(u => u.id === parseInt(id));

      if (userIndex === -1) {
        return reply.status(404).send({
          success: false,
          message: 'User not found',
        });
      }

      users[userIndex] = { ...users[userIndex], ...request.body };

      return {
        success: true,
        message: 'User updated successfully',
        data: users[userIndex],
      };
    },
  });

  // Delete user
  fastify.delete<{ Params: { id: string } }>('/:id', {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
      },
    },
    handler: async (request, reply) => {
      const { id } = request.params;
      const userIndex = users.findIndex(u => u.id === parseInt(id));

      if (userIndex === -1) {
        return reply.status(404).send({
          success: false,
          message: 'User not found',
        });
      }

      users.splice(userIndex, 1);

      return {
        success: true,
        message: 'User deleted successfully',
      };
    },
  });
}