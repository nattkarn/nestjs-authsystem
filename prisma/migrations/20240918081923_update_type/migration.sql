/*
  Warnings:

  - The `resetPasswordTokenExpiresAt` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "resetPasswordToken" DROP NOT NULL,
DROP COLUMN "resetPasswordTokenExpiresAt",
ADD COLUMN     "resetPasswordTokenExpiresAt" TIMESTAMP(3);
