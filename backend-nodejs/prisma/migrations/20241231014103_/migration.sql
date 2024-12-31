/*
  Warnings:

  - You are about to drop the column `taskGroupId` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the `TaskGroup` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `boardId` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_taskGroupId_fkey";

-- DropForeignKey
ALTER TABLE "TaskGroup" DROP CONSTRAINT "TaskGroup_userId_fkey";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "taskGroupId",
ADD COLUMN     "boardId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "TaskGroup";

-- CreateTable
CREATE TABLE "Board" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Board_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Board" ADD CONSTRAINT "Board_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
