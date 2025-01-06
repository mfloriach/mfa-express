/*
  Warnings:

  - A unique constraint covering the columns `[emailSecret]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `emailConfirmed` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailConfirmed" BOOLEAN NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_emailSecret_key" ON "User"("emailSecret");

-- CreateIndex
CREATE INDEX "User_emailSecret_idx" ON "User"("emailSecret");
