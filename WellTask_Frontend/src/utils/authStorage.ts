import type { User } from "@/types/User";

const USERS_KEY = "users";

export const getAllUsers = (): User[] => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? (JSON.parse(users) as User[]) : [];
};

export const getUserByEmail = (email: string): User | null => {
  const users: User[] = getAllUsers();
  return users.find((user: User) => user.email === email) || null;
};

export const saveUser = (user: User) => {
  const users: User[] = getAllUsers();
  const existingIndex = users.findIndex(
    (user: User) => user.email === user.email
  );

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

export const clearUsers = () => {
  localStorage.removeItem(USERS_KEY);
};
