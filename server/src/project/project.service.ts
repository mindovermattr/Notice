import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Role } from "src/enums/roles";
import { PrismaService } from "src/prisma.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";

@Injectable()
export class ProjectService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createProjectDto: CreateProjectDto, authorId: number) {
    const data = await this.prismaService.project.create({
      data: {
        name: createProjectDto.name,
        author_id: authorId,
        user_roles: {
          create: {
            role_id: Role.ADMIN,
            user_id: authorId,
          },
        },
      },
      include: {
        user_roles: {
          select: {
            role_name: true,
          },
        },
      },
    });

    return data;
  }

  async getAll() {
    const data = await this.prismaService.project.findMany({
      include: {
        user_roles: true,
      },
    });

    return data;
  }

  async findAllByUserId(id: number) {
    const data = await this.prismaService.project.findMany({
      where: {
        users: {
          some: {
            id: {
              equals: id,
            },
          },
        },
      },
    });
    return data;
  }

  async findOne(id: number) {
    const data = await this.prismaService.project.findFirst({
      where: {
        id,
      },
    });
    return data;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    const data = await this.prismaService.project.update({
      where: {
        id,
      },
      data: updateProjectDto,
    });
    return data;
  }

  async remove(id: number) {
    const proj = await this.prismaService.project.findFirst({
      where: {
        id,
      },
    });

    if (!proj)
      throw new HttpException("Project does not exist", HttpStatus.BAD_REQUEST);

    const data = await this.prismaService.project.delete({
      where: {
        id,
      },
    });
    return data;
  }

  async addUser(id: number, email: string) {
    const user = await this.prismaService.user.findFirst({
      where: { email },
      include: {
        role: {
          where: {
            project_id: id,
          },
        },
      },
    });

    if (!user)
      throw new HttpException("User does not exist", HttpStatus.BAD_REQUEST);

    const data = await this.prismaService.$transaction(async (prisma) => {
      const proj = await prisma.project.update({
        where: { id },
        data: {
          users: {
            connect: { id: user.id },
          },
        },
      });

      const existingRole = await prisma.projectUserRoles.findFirst({
        where: {
          user_id: user.id,
          project_id: id,
        },
      });

      let role = null;

      if (existingRole) {
        role = await prisma.projectUserRoles.update({
          where: { id: existingRole.id },
          data: {
            role_name: { connect: { id: Role.USER } },
          },
        });
      } else {
        role = await prisma.projectUserRoles.create({
          data: {
            user: { connect: { id: user.id } },
            project: { connect: { id: proj.id } },
            role_name: { connect: { id: Role.USER } },
          },
        });
      }

      return [proj, role];
    });

    return data;
  }

  async removeUser(id: number, userId: number) {
    const user = await this.prismaService.projectUserRoles.findFirst({
      where: {
        project_id: id,
        user_id: userId,
      },
    });

    if (!user)
      throw new HttpException(
        "User doesn't exist in project",
        HttpStatus.BAD_REQUEST,
      );

    const data = await this.prismaService.projectUserRoles.delete({
      where: {
        id: user.id,
      },
    });
    return data;
  }
}
