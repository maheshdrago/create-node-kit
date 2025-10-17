import { GraphQLError } from 'graphql';
import { User, CreateUserInput, UpdateUserInput, DeleteResponse } from '../types/user.js';
import { Context } from '../types/context.js';

// Mock database
let users: User[] = [
  { 
    id: '1', 
    name: 'John Doe', 
    email: 'john@example.com',
    createdAt: new Date().toISOString(),
  },
  { 
    id: '2', 
    name: 'Jane Smith', 
    email: 'jane@example.com',
    createdAt: new Date().toISOString(),
  },
];

let nextId = 3;

interface QueryUserArgs {
  id: string;
}

interface MutationCreateUserArgs {
  name: string;
  email: string;
}

interface MutationUpdateUserArgs {
  id: string;
  name?: string;
  email?: string;
}

interface MutationDeleteUserArgs {
  id: string;
}

export const userResolvers = {
  Query: {
    users: (parent: any, args: any, context: Context): User[] => {
      return users;
    },
    
    user: (parent: any, { id }: QueryUserArgs, context: Context): User => {
      const user = users.find(u => u.id === id);
      if (!user) {
        throw new GraphQLError('User not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }
      return user;
    },
  },

  Mutation: {
    createUser: (
      parent: any,
      { name, email }: MutationCreateUserArgs,
      context: Context
    ): User => {
      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new GraphQLError('Invalid email format', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      // Check if email already exists
      if (users.find(u => u.email === email)) {
        throw new GraphQLError('Email already exists', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      const newUser: User = {
        id: String(nextId++),
        name,
        email,
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      return newUser;
    },

    updateUser: (
      parent: any,
      { id, name, email }: MutationUpdateUserArgs,
      context: Context
    ): User => {
      const userIndex = users.findIndex(u => u.id === id);
      
      if (userIndex === -1) {
        throw new GraphQLError('User not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          throw new GraphQLError('Invalid email format', {
            extensions: { code: 'BAD_USER_INPUT' },
          });
        }
      }

      const updatedUser: User = {
        ...users[userIndex],
        ...(name && { name }),
        ...(email && { email }),
      };

      users[userIndex] = updatedUser;
      return updatedUser;
    },

    deleteUser: (
      parent: any,
      { id }: MutationDeleteUserArgs,
      context: Context
    ): DeleteResponse => {
      const userIndex = users.findIndex(u => u.id === id);
      
      if (userIndex === -1) {
        throw new GraphQLError('User not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      users.splice(userIndex, 1);
      return {
        success: true,
        message: 'User deleted successfully',
      };
    },
  },
};
