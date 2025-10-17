export const typeDefs = `#graphql
  type User {
    id: ID!
    name: String!
    email: String!
    createdAt: String
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
    hello: String!
  }

  type Mutation {
    createUser(name: String!, email: String!): User!
    updateUser(id: ID!, name: String, email: String): User!
    deleteUser(id: ID!): DeleteResponse!
  }

  type DeleteResponse {
    success: Boolean!
    message: String!
  }

  type Subscription {
    userAdded: User!
  }
`;
