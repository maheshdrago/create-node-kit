import { Request, Response } from 'express';
import { User, ApiResponse } from '../types/user';

// Mock database
let users: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
];

export const getUsers = (req: Request, res: Response): void => {
  const response: ApiResponse<User[]> = {
    success: true,
    data: users,
    count: users.length,
  };
  res.json(response);
};

export const getUserById = (req: Request, res: Response): void => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  
  if (!user) {
    res.status(404).json({
      success: false,
      message: 'User not found',
    });
    return;
  }

  res.json({
    success: true,
    data: user,
  });
};

export const createUser = (req: Request, res: Response): void => {
  const { name, email } = req.body;
  const newUser: User = {
    id: users.length + 1,
    name,
    email,
  };

  users.push(newUser);

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: newUser,
  });
};

export const updateUser = (req: Request, res: Response): void => {
  const { id } = req.params;
  const { name, email } = req.body;
  const userIndex = users.findIndex(u => u.id === parseInt(id));

  if (userIndex === -1) {
    res.status(404).json({
      success: false,
      message: 'User not found',
    });
    return;
  }

  users[userIndex] = { ...users[userIndex], name, email };

  res.json({
    success: true,
    message: 'User updated successfully',
    data: users[userIndex],
  });
};

export const deleteUser = (req: Request, res: Response): void => {
  const { id } = req.params;
  const userIndex = users.findIndex(u => u.id === parseInt(id));

  if (userIndex === -1) {
    res.status(404).json({
      success: false,
      message: 'User not found',
    });
    return;
  }

  users.splice(userIndex, 1);

  res.json({
    success: true,
    message: 'User deleted successfully',
  });
};