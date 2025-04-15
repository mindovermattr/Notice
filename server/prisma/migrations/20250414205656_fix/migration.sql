/*
  Warnings:

  - Added the required column `role_id` to the `ProjectUserRoles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProjectUserRoles" ADD COLUMN     "role_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "ProjectUserRoles" ADD CONSTRAINT "ProjectUserRoles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
