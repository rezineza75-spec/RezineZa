export interface User {
  id: string;           // String dans Prisma (Better Auth génère des ids en string)
  name: string;
  email: string;
  image: string | null;
  role: string;         // "user" ou "admin"
}