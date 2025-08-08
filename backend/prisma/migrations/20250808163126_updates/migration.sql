/*
  Warnings:

  - The `optedTo` column on the `Match` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `status` on the `Match` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `playerId` on the `Score` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('scheduled', 'live', 'completed');

-- CreateEnum
CREATE TYPE "OptedTo" AS ENUM ('bat', 'bowl');

-- AlterTable
ALTER TABLE "Match" DROP COLUMN "status",
ADD COLUMN     "status" "MatchStatus" NOT NULL,
DROP COLUMN "optedTo",
ADD COLUMN     "optedTo" "OptedTo";

-- AlterTable
ALTER TABLE "Score" DROP COLUMN "playerId",
ADD COLUMN     "playerId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
