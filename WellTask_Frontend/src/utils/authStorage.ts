import type { User } from "@/types/User";

const USERS_KEY = "users";
const CURRENT_USER_KEY = "currentUserId";

export const getAllUsers = (): User[] => {
  const users = localStorage.getItem(USERS_KEY);
  if (users) {
    return JSON.parse(users) as User[];
  } else {
    return [];
  }
};

export const getUserByEmail = (email: string): User | null => {
  const users: User[] = getAllUsers();
  const foundUser = users.find((user: User) => user.email === email);
  if (foundUser) {
    return foundUser;
  } else {
    return null;
  }
};

export const saveUser = (user: User) => {
  const users: User[] = getAllUsers();
  const existingIndex = users.findIndex((u: User) => u.email === user.email);

  if (existingIndex >= 0) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }

  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const saveAllUsers = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const setCurrentUser = (userId: string) => {
  localStorage.setItem(CURRENT_USER_KEY, userId);
};

export const getCurrentUser = (): User | null => {
  const userId = localStorage.getItem(CURRENT_USER_KEY);
  if (userId) {
    const users = getAllUsers();
    const foundUser = users.find((u) => u.id === userId);
    if (foundUser) {
      return foundUser;
    } else {
      return null;
    }
  } else {
    return null;
  }
};

export const clearCurrentUser = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};
