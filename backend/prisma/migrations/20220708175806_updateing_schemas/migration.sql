/*
  Warnings:

  - You are about to drop the column `taskId` on the `Task` table. All the data in the column will be lost.
  - Added the required column `taskGroupId` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_taskId_fkey";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "taskId",
ADD COLUMN     "taskGroupId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_taskGroupId_fkey" FOREIGN KEY ("taskGroupId") REFERENCES "task_groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
