import { HttpException } from "@nestjs/common";
import { EStatus } from "../enums/status";
import { TaskService } from "./task.service";

describe("TaskService", () => {
  let taskService: TaskService;
  let prismaService: any;
  let yandexDiskService: any;
  let projectService: any;

  beforeEach(() => {
    prismaService = {
      listTasks: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
      },
      task: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
      },
      attachment: {
        createMany: jest.fn(),
      },
    };

    yandexDiskService = {
      uploadMultipleFiles: jest.fn(),
    };

    projectService = {};

    taskService = new TaskService(
      prismaService,
      yandexDiskService,
      projectService,
    );
  });

  describe("create", () => {
    it("should throw if list not found", async () => {
      prismaService.listTasks.findFirst.mockResolvedValue(null);

      await expect(
        taskService.create(
          {
            userId: 1,
            description: "desc",
            dueDate: new Date(),
            title: "title",
          },
          123,
        ),
      ).rejects.toThrow(HttpException);

      expect(prismaService.listTasks.findFirst).toHaveBeenCalledWith({
        where: { id: 123 },
      });
    });

    it("should create task successfully", async () => {
      const createTaskDto = {
        userId: 2,
        description: "desc",
        dueDate: new Date("2025-01-01"),
        title: "title",
      };
      prismaService.listTasks.findFirst.mockResolvedValue({ id: 123 });
      const createdTask = {
        id: 1,
        description: createTaskDto.description,
        subtasks: [],
      };
      prismaService.task.create.mockResolvedValue(createdTask);

      const result = await taskService.create(createTaskDto, 123);

      expect(prismaService.task.create).toHaveBeenCalledWith({
        data: {
          task_list: { connect: { id: 123 } },
          assign_user: { connect: { id: createTaskDto.userId } },
          status: EStatus.TODO,
          description: createTaskDto.description,
          due_date: createTaskDto.dueDate,
          title: createTaskDto.title,
          priority: false,
        },
        include: { subtasks: true },
        omit: { createdAt: true, updatedAt: true },
      });
      expect(result).toEqual(createdTask);
    });

    it("should throw if create returns falsy", async () => {
      prismaService.listTasks.findFirst.mockResolvedValue({ id: 123 });
      prismaService.task.create.mockResolvedValue(null);

      await expect(
        taskService.create(
          {
            userId: 1,
            description: "desc",
            dueDate: new Date(),
            title: "title",
          },
          123,
        ),
      ).rejects.toThrow(HttpException);
    });
  });

  describe("findAll", () => {
    it("should return tasks", async () => {
      const tasks = [{ id: 1, subtasks: [], assign_user: {} }];
      prismaService.task.findMany.mockResolvedValue(tasks);

      const result = await taskService.findAll(123);

      expect(prismaService.task.findMany).toHaveBeenCalledWith({
        where: { task_list_id: 123 },
        include: { subtasks: true, assign_user: true },
        omit: { task_list_id: true },
      });
      expect(result).toEqual(tasks);
    });

    it("should throw if no data", async () => {
      prismaService.task.findMany.mockResolvedValue(null);

      await expect(taskService.findAll(123)).rejects.toThrow(HttpException);
    });
  });

  describe("findAllByProject", () => {
    it("should return flattened tasks array", async () => {
      const listTasks = [
        {
          tasks: [
            {
              id: 1,
              assign_user: {},
              attachments: [],
              subtasks: [],
              task_list: {},
            },
            {
              id: 2,
              assign_user: {},
              attachments: [],
              subtasks: [],
              task_list: {},
            },
          ],
        },
        {
          tasks: [
            {
              id: 3,
              assign_user: {},
              attachments: [],
              subtasks: [],
              task_list: {},
            },
          ],
        },
      ];
      prismaService.listTasks.findMany.mockResolvedValue(listTasks);

      const result = await taskService.findAllByProject(10);

      expect(prismaService.listTasks.findMany).toHaveBeenCalledWith({
        where: { project: { id: 10 } },
        include: {
          tasks: {
            include: {
              assign_user: true,
              attachments: true,
              subtasks: true,
              task_list: true,
            },
          },
        },
      });
      expect(result).toEqual({ tasks: listTasks.flatMap((el) => el.tasks) });
    });
  });

  describe("findOne", () => {
    it("should return task by id", async () => {
      const task = { id: 1 };
      prismaService.task.findFirst.mockResolvedValue(task);

      const result = await taskService.findOne(1);

      expect(prismaService.task.findFirst).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          subtasks: true,
          task_list: true,
          assign_user: true,
          attachments: { include: { user: true } },
        },
      });
      expect(result).toEqual(task);
    });
  });

  describe("update", () => {
    const user = { id: 1 } as any;

    it("should throw if task not found", async () => {
      prismaService.task.findFirst.mockResolvedValue(null);

      await expect(
        taskService.update(1, { title: "new" }, user),
      ).rejects.toThrow(HttpException);
    });

    it("should throw if user id not match or status not Review", async () => {
      prismaService.task.findFirst.mockResolvedValue({
        id: 1,
        assign_id: 2,
        status: "TODO",
      });

      await expect(
        taskService.update(1, { title: "new" }, user),
      ).rejects.toThrow(HttpException);
    });

    it("should update task if conditions met", async () => {
      prismaService.task.findFirst.mockResolvedValue({
        id: 1,
        assign_id: user.id,
        status: "Review",
      });
      const updatedTask = { id: 1, title: "new", subtasks: [] };
      prismaService.task.update.mockResolvedValue(updatedTask);

      const result = await taskService.update(1, { title: "new" }, user);

      expect(prismaService.task.update).toHaveBeenCalledWith({
        data: { title: "new" },
        where: { id: 1 },
        include: { subtasks: true },
      });
      expect(result).toEqual(updatedTask);
    });
  });

  describe("addFiles", () => {
    const user = { id: 1 } as any;
    const files = [{ originalname: "file1" }] as any;

    it("should throw if task not found", async () => {
      prismaService.task.findFirst.mockResolvedValue(null);

      await expect(taskService.addFiles(1, files, user)).rejects.toThrow(
        HttpException,
      );
    });

    it("should upload files and create attachments", async () => {
      prismaService.task.findFirst.mockResolvedValue({ id: 1 });
      const uploadedFiles = [
        { imageSrc: "url1", fileName: "file1" },
        { imageSrc: "url2", fileName: "file2" },
      ];
      yandexDiskService.uploadMultipleFiles.mockResolvedValue(uploadedFiles);
      prismaService.attachment.createMany.mockResolvedValue({ count: 2 });

      const result = await taskService.addFiles(1, files, user);

      expect(yandexDiskService.uploadMultipleFiles).toHaveBeenCalledWith(files);
      expect(prismaService.attachment.createMany).toHaveBeenCalledWith({
        data: uploadedFiles.map((el) => ({
          fileUrl: el.imageSrc,
          userId: user.id,
          fileName: el.fileName,
          taskId: 1,
        })),
        skipDuplicates: true,
      });
      expect(result).toEqual({ count: 2 });
    });
  });
});
