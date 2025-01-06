/*
  Warnings:

  - You are about to drop the column `emailConfirmed` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `emailSecret` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `mfaSecretTemp` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_emailSecret_idx";

-- DropIndex
DROP INDEX "User_emailSecret_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "emailConfirmed",
DROP COLUMN "emailSecret",
DROP COLUMN "mfaSecretTemp";
