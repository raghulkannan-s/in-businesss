/*
  Warnings:

  - The `eligibility` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `category` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "category" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "inScore" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "eligibility",
ADD COLUMN     "eligibility" BOOLEAN NOT NULL DEFAULT true;
