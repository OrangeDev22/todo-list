/*
  Warnings:

  - You are about to drop the `Task` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_taskGroupId_fkey";

-- AlterTable
ALTER TABLE "task_groups" ADD COLUMN     "tasks" JSONB;

-- DropTable
DROP TABLE "Task";
