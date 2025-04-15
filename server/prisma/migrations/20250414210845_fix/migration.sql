-- DropForeignKey
ALTER TABLE "ProjectUserRoles" DROP CONSTRAINT "ProjectUserRoles_project_id_fkey";

-- DropForeignKey
ALTER TABLE "ProjectUserRoles" DROP CONSTRAINT "ProjectUserRoles_role_id_fkey";

-- DropForeignKey
ALTER TABLE "ProjectUserRoles" DROP CONSTRAINT "ProjectUserRoles_user_id_fkey";

-- AddForeignKey
ALTER TABLE "ProjectUserRoles" ADD CONSTRAINT "ProjectUserRoles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectUserRoles" ADD CONSTRAINT "ProjectUserRoles_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectUserRoles" ADD CONSTRAINT "ProjectUserRoles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
