// Mock database
let users = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" },
];

export const getUsers = (req, res) => {
  res.json({
    success: true,
    data: users,
    count: users.length,
  });
};

export const getUserById = (req, res) => {
  const user = users.find((u) => u.id === parseInt(req.params.id));

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  res.json({
    success: true,
    data: user,
  });
};

export const createUser = (req, res) => {
  const { name, email } = req.body;
  const newUser = {
    id: users.length + 1,
    name,
    email,
  };

  users.push(newUser);

  res.status(201).json({
    success: true,
    message: "User created successfully",
    data: newUser,
  });
};

export const updateUser = (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  const userIndex = users.findIndex((u) => u.id === parseInt(id));

  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  users[userIndex] = { ...users[userIndex], name, email };

  res.json({
    success: true,
    message: "User updated successfully",
    data: users[userIndex],
  });
};

export const deleteUser = (req, res) => {
  const { id } = req.params;
  const userIndex = users.findIndex((u) => u.id === parseInt(id));

  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  users.splice(userIndex, 1);

  res.json({
    success: true,
    message: "User deleted successfully",
  });
};
