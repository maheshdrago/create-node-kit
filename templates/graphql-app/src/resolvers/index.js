import { userResolvers } from "./userResolvers.js";

export const resolvers = {
  Query: {
    ...userResolvers.Query,
    hello: () => "Hello from GraphQL!",
  },
  Mutation: {
    ...userResolvers.Mutation,
  },
};
