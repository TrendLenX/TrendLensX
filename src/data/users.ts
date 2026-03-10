export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // In production, this should be hashed
  role: 'user' | 'admin';
  frozen: boolean;
  createdAt: string;
}

export const users: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@trendlensx.com',
    password: 'admin123', // Change this in production
    role: 'admin',
    frozen: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user',
    frozen: false,
    createdAt: new Date().toISOString(),
  },
];

// Helper functions for user management
export const addUser = (user: Omit<User, 'id' | 'createdAt'>) => {
  const newUser: User = {
    ...user,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  return newUser;
};

export const freezeUser = (userId: string) => {
  const user = users.find(u => u.id === userId);
  if (user) {
    user.frozen = true;
  }
};

export const unfreezeUser = (userId: string) => {
  const user = users.find(u => u.id === userId);
  if (user) {
    user.frozen = false;
  }
};

export const removeUser = (userId: string) => {
  const index = users.findIndex(u => u.id === userId);
  if (index > -1) {
    users.splice(index, 1);
  }
};