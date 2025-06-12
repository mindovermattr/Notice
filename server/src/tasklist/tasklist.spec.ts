import { HttpException, HttpStatus } from "@nestjs/common";
import { CreateTasklistDto } from "./dto/create-tasklist.dto";
import { TasklistService } from "./tasklist.service";

describe("TasklistService", () => {
  let tasklistService: TasklistService;
  let mockPrismaService: any;

  beforeEach(() => {
    mockPrismaService = {
      listTasks: {
        create: jest.fn(),
        findMany: jest.fn(),
        delete: jest.fn(),
      },
    };

    tasklistService = new TasklistService(mockPrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create a new tasklist with history", async () => {
      const createTasklistDto: CreateTasklistDto = {
        title: "Test Tasklist",
      };
      const projId = 1;

      const mockTasklist = {
        id: 1,
        title: "Test Tasklist",
        tasks: [],
        history: {
          id: 1,
          history: [`Карточка была создана ${new Date().toLocaleDateString()}`],
        },
      };

      mockPrismaService.listTasks.create.mockResolvedValue(mockTasklist);

      const result = await tasklistService.create(createTasklistDto, projId);

      expect(mockPrismaService.listTasks.create).toHaveBeenCalledWith({
        data: {
          title: createTasklistDto.title,
          history: {
            create: {
              history: [
                `Карточка была создана ${new Date().toLocaleDateString()}`,
              ],
            },
          },
          project: {
            connect: {
              id: projId,
            },
          },
        },
        include: {
          tasks: {
            include: {
              assign_user: true,
            },
          },
          history: true,
        },
      });
      expect(result).toEqual(mockTasklist);
    });
  });

  describe("findAllById", () => {
    it("should return tasklists for a project", async () => {
      const projId = 1;
      const mockTasklists = [
        {
          id: 1,
          title: "Tasklist 1",
          tasks: [],
          history: { id: 1, history: [] },
        },
      ];

      mockPrismaService.listTasks.findMany.mockResolvedValue(mockTasklists);

      const result = await tasklistService.findAllById(projId);

      expect(mockPrismaService.listTasks.findMany).toHaveBeenCalledWith({
        where: {
          project: {
            id: projId,
          },
        },
        include: {
          tasks: {
            include: {
              assign_user: true,
              subtasks: true,
            },
            orderBy: {
              id: "asc",
            },
          },
          history: true,
        },
      });
      expect(result).toEqual(mockTasklists);
    });

    it("should throw NOT_FOUND if no tasklists found", async () => {
      const projId = 999;

      mockPrismaService.listTasks.findMany.mockResolvedValue(null);

      await expect(tasklistService.findAllById(projId)).rejects.toThrow(
        new HttpException("Проект не найден", HttpStatus.NOT_FOUND),
      );
    });
  });

  describe("remove", () => {
    it("should delete a tasklist", async () => {
      const tasklistId = 1;
      const mockDeletedTasklist = {
        id: 1,
        title: "Deleted Tasklist",
      };

      mockPrismaService.listTasks.delete.mockResolvedValue(mockDeletedTasklist);

      const result = await tasklistService.remove(tasklistId);

      expect(mockPrismaService.listTasks.delete).toHaveBeenCalledWith({
        where: {
          id: tasklistId,
        },
      });
      expect(result).toEqual(mockDeletedTasklist);
    });

    it("should throw NOT_FOUND if tasklist not found", async () => {
      const tasklistId = 999;

      mockPrismaService.listTasks.delete.mockResolvedValue(null);

      await expect(tasklistService.remove(tasklistId)).rejects.toThrow(
        new HttpException("Список не найден", HttpStatus.NOT_FOUND),
      );
    });
  });
});
