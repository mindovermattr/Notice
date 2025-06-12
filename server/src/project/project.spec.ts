import { HttpException } from "@nestjs/common";
import { Role } from "../enums/roles";
import { ProjectService } from "./project.service";

describe("ProjectService", () => {
  let projectService: ProjectService;
  let prismaService: any;

  beforeEach(() => {
    prismaService = {
      project: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      user: {
        findFirst: jest.fn(),
      },
      projectUserRoles: {
        findFirst: jest.fn(),
        update: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
      },
      $transaction: jest.fn(),
    };

    projectService = new ProjectService(prismaService);
  });

  describe("create", () => {
    it("should create a project", async () => {
      const user = {
        id: 1,
        name: "Test User",
        email: "test@example.com",
        password: "hashedpassword",
        lastname: "User",
        avatarUrl: "http://example.com/avatar.png",
      };
      const dto = { name: "Project 1" };
      const createdProject = {
        id: 10,
        name: dto.name,
        user_roles: [{ role_name: "ADMIN" }],
      };
      prismaService.project.create.mockResolvedValue(createdProject);

      const result = await projectService.create(dto, user);

      expect(prismaService.project.create).toHaveBeenCalledWith({
        data: {
          name: dto.name,
          author_id: user.id,
          user_roles: {
            create: {
              role_id: Role.ADMIN,
              user_id: user.id,
            },
          },
          users: {
            connect: { id: user.id },
          },
        },
        include: {
          user_roles: {
            select: { role_name: true },
          },
        },
      });
      expect(result).toEqual(createdProject);
    });
  });

  describe("getAll", () => {
    it("should return projects for user", async () => {
      const user = {
        id: 1,
        name: "Test User",
        email: "test@example.com",
        password: "hashedpassword",
        lastname: "User",
        avatarUrl: "http://example.com/avatar.png",
      };
      const projects = [{ id: 1, users: [], user_roles: [] }];
      prismaService.project.findMany.mockResolvedValue(projects);

      const result = await projectService.getAll(user);

      expect(prismaService.project.findMany).toHaveBeenCalledWith({
        where: { users: { some: { id: user.id } } },
        include: {
          users: { omit: { password: true } },
          user_roles: {
            where: { user_id: user.id },
            include: { role_name: true },
          },
        },
      });
      expect(result).toEqual(projects);
    });

    it("should throw if no projects found", async () => {
      const user = {
        id: 1,
        name: "Test User",
        email: "test@example.com",
        password: "hashedpassword",
        lastname: "User",
        avatarUrl: "http://example.com/avatar.png",
      };
      prismaService.project.findMany.mockResolvedValue(null);

      await expect(projectService.getAll(user)).rejects.toThrow(HttpException);
    });
  });

  describe("findAllByUserId", () => {
    it("should return projects by user id", async () => {
      const userId = 1;
      const projects = [{ id: 1 }];
      prismaService.project.findMany.mockResolvedValue(projects);

      const result = await projectService.findAllByUserId(userId);

      expect(prismaService.project.findMany).toHaveBeenCalledWith({
        where: { users: { some: { id: { equals: userId } } } },
      });
      expect(result).toEqual(projects);
    });
  });

  describe("findOne", () => {
    it("should return project with user role", async () => {
      const user = {
        id: 1,
        name: "Test User",
        email: "test@example.com",
        password: "hashedpassword",
        lastname: "User",
        avatarUrl: "http://example.com/avatar.png",
      };
      const projectData = {
        id: 1,
        name: "Test",
        author_id: 1,
        users: [{ id: 1 }],
        user_roles: [{ role_name: { role_name: "ADMIN" } }],
      };
      prismaService.project.findFirst.mockResolvedValue(projectData);

      const result = await projectService.findOne(1, user);

      expect(prismaService.project.findFirst).toHaveBeenCalledWith({
        where: {
          id: 1,
          users: { some: { id: { equals: +user.id } } },
        },
        include: {
          users: { omit: { password: true } },
          user_roles: {
            where: { user_id: +user.id },
            include: { role_name: true },
            omit: { id: true, project_id: true, user_id: true, role_id: true },
          },
        },
      });
      expect(result).toEqual({
        id: projectData.id,
        name: projectData.name,
        author_id: projectData.author_id,
        user: projectData.users,
        role: "ADMIN",
      });
    });

    it("should throw if project not found", async () => {
      const user = {
        id: 1,
        name: "Test User",
        email: "test@example.com",
        password: "hashedpassword",
        lastname: "User",
        avatarUrl: "http://example.com/avatar.png",
      };
      prismaService.project.findFirst.mockResolvedValue(null);

      await expect(projectService.findOne(1, user)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe("update", () => {
    it("should update project", async () => {
      const id = 1;
      const dto = { name: "Updated" };
      const updatedProject = { id, name: dto.name };
      prismaService.project.update.mockResolvedValue(updatedProject);

      const result = await projectService.update(id, dto);

      expect(prismaService.project.update).toHaveBeenCalledWith({
        where: { id },
        data: dto,
      });
      expect(result).toEqual(updatedProject);
    });
  });

  describe("remove", () => {
    it("should throw if project not found", async () => {
      prismaService.project.findFirst.mockResolvedValue(null);

      await expect(projectService.remove(1)).rejects.toThrow(HttpException);
    });

    it("should delete project", async () => {
      const project = { id: 1 };
      prismaService.project.findFirst.mockResolvedValue(project);
      prismaService.project.delete.mockResolvedValue(project);

      const result = await projectService.remove(1);

      expect(prismaService.project.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(project);
    });
  });

  describe("addUser", () => {
    it("should throw if user not found", async () => {
      prismaService.user.findFirst.mockResolvedValue(null);

      await expect(projectService.addUser(1, "email@test.com")).rejects.toThrow(
        HttpException,
      );
    });

    it("should add user with existing role", async () => {
      const user = { id: 2 };
      const project = { id: 1 };
      const existingRole = { id: 5 };
      const updatedRole = { id: 5, role_name: { id: Role.USER } };

      prismaService.user.findFirst.mockResolvedValue(user);
      prismaService.$transaction.mockImplementation(async (cb) => {
        return cb({
          project: {
            update: jest.fn().mockResolvedValue(project),
          },
          projectUserRoles: {
            findFirst: jest.fn().mockResolvedValue(existingRole),
            update: jest.fn().mockResolvedValue(updatedRole),
            create: jest.fn(),
          },
        });
      });

      const result = await projectService.addUser(1, "email@test.com");

      expect(result).toEqual([project, updatedRole]);
    });

    it("should add user with new role", async () => {
      const user = { id: 2 };
      const project = { id: 1 };
      const newRole = { id: 10, role_name: { id: Role.USER } };

      prismaService.user.findFirst.mockResolvedValue(user);
      prismaService.$transaction.mockImplementation(async (cb) => {
        return cb({
          project: {
            update: jest.fn().mockResolvedValue(project),
          },
          projectUserRoles: {
            findFirst: jest.fn().mockResolvedValue(null),
            update: jest.fn(),
            create: jest.fn().mockResolvedValue(newRole),
          },
        });
      });

      const result = await projectService.addUser(1, "email@test.com");

      expect(result).toEqual([project, newRole]);
    });
  });

  describe("removeUser", () => {
    it("should throw if user role not found", async () => {
      prismaService.projectUserRoles.findFirst.mockResolvedValue(null);

      await expect(projectService.removeUser(1, 2)).rejects.toThrow(
        HttpException,
      );
    });

    it("should remove user role", async () => {
      const role = { id: 5 };
      prismaService.projectUserRoles.findFirst.mockResolvedValue(role);
      prismaService.projectUserRoles.delete.mockResolvedValue(role);

      const result = await projectService.removeUser(1, 2);

      expect(prismaService.projectUserRoles.delete).toHaveBeenCalledWith({
        where: { id: role.id },
      });
      expect(result).toEqual(role);
    });
  });

 
});
