import { PrismaClient } from "@prisma/client";
import { Prisma } from "@prisma/client";

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query"] : [],
});

const Known = (code: string) => (error: any) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === code) {
      return true;
    }
  }

  return false;
};

export const Errors = {
  IsUniqueThrow: Known("P2025"),
  IsUnique: Known("P2002"),
};
