import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "src/decorators/roles";
import { Role } from "src/enums/roles";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();

    const user = request.user;
    const projId = +request.params.projId;

    //console.log(user, projId);
    const proj = await this.prismaService.project.findFirst({
      where: {
        id: projId,
        author_id: +user.id,
      },
      include: {
        user_roles: true,
      },
    });

    if (!proj)
      throw new HttpException(
        "Project doesn't exist or user not author",
        HttpStatus.BAD_REQUEST,
      );

    const userRole = proj.user_roles.find((el) => el.user_id === user.id);
    if (!userRole)
      throw new HttpException(
        "User doesnt exist in this project",
        HttpStatus.BAD_REQUEST,
      );

    return requiredRoles.some((el) => el === userRole.role_id);
  }
}
