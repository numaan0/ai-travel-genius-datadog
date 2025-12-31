// Auto-generated types: user
export interface User {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  // TODO: Add user properties
}

export type CreateUser = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
