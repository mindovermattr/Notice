/*
  Warnings:

  - You are about to drop the column `description` on the `SubTask` table. All the data in the column will be lost.
  - You are about to drop the column `due_date` on the `SubTask` table. All the data in the column will be lost.
  - You are about to drop the column `priority` on the `SubTask` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SubTask" DROP COLUMN "description",
DROP COLUMN "due_date",
DROP COLUMN "priority";
