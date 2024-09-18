-- DropIndex
DROP INDEX "User_roleId_key";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "roleId" DROP DEFAULT;
