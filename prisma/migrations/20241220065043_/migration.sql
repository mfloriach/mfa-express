/*
  Warnings:

  - Added the required column `emailSecret` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailSecret" TEXT NOT NULL;
