-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "stock" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "description" SET DEFAULT 'Placeholder description',
ALTER COLUMN "price" SET DEFAULT 0,
ALTER COLUMN "category" SET DEFAULT 'General';
