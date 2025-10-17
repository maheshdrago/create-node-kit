import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { typeDefs } from "./schema/typeDefs.js";
import { resolvers } from "./resolvers/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Apollo Server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: process.env.NODE_ENV !== "production",
});

await server.start();

// Middlewares
app.use(cors());
app.use(express.json());

// GraphQL endpoint
app.use(
  "/graphql",
  expressMiddleware(server, {
    context: async ({ req }) => ({
      token: req.headers.authorization || "",
    }),
  })
);

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    graphql: "/graphql",
  });
});

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "GraphQL API Server",
    graphql: `http://localhost:${PORT}/graphql`,
    health: `http://localhost:${PORT}/health`,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
});
