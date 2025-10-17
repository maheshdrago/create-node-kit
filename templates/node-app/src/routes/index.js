import { Router } from "express";
import userRoutes from "./userRoutes.js";

const router = Router();

// Mount routes
router.use("/users", userRoutes);

// Root route
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to the API",
    version: "1.0.0",
    endpoints: {
      users: "/api/users",
      health: "/health",
    },
  });
});

export default router;
