// Mock database
let users = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    createdAt: new Date().toISOString(),
  },
];

let nextId = 3;

export const userResolvers = {
  Query: {
    users: () => users,
    user: (parent, { id }) => {
      const user = users.find((u) => u.id === id);
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    },
  },
  Mutation: {
    createUser: (parent, { name, email }) => {
      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Invalid email format");
      }

      // Check if email already exists
      if (users.find((u) => u.email === email)) {
        throw new Error("Email already exists");
      }

      const newUser = {
        id: String(nextId++),
        name,
        email,
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      return newUser;
    },
    updateUser: (parent, { id, name, email }) => {
      const userIndex = users.findIndex((u) => u.id === id);

      if (userIndex === -1) {
        throw new Error("User not found");
      }

      if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          throw new Error("Invalid email format");
        }
      }

      const updatedUser = {
        ...users[userIndex],
        ...(name && { name }),
        ...(email && { email }),
      };

      users[userIndex] = updatedUser;
      return updatedUser;
    },
    deleteUser: (parent, { id }) => {
      const userIndex = users.findIndex((u) => u.id === id);

      if (userIndex === -1) {
        throw new Error("User not found");
      }

      users.splice(userIndex, 1);
      return {
        success: true,
        message: "User deleted successfully",
      };
    },
  },
};
