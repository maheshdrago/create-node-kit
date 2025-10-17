import { userResolvers } from './userResolvers';
import { Context } from '../types/context';

export const resolvers = {
  Query: {
    ...userResolvers.Query,
    hello: (): string => 'Hello from GraphQL with TypeScript!',
  },
  Mutation: {
    ...userResolvers.Mutation,
  },
};