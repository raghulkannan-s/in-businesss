/*
  Warnings:

  - You are about to drop the column `createdById` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `updatedById` on the `Product` table. All the data in the column will be lost.
  - Added the required column `createdByPhone` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "createdById",
DROP COLUMN "updatedById",
ADD COLUMN     "createdByPhone" TEXT NOT NULL,
ADD COLUMN     "updatedByPhone" TEXT;
