import { SubtaskService } from "./subtask.service";

describe("SubtaskService", () => {
  let subtaskService: SubtaskService;
  let prismaService: any;

  beforeEach(() => {
    prismaService = {
      subTask: {
        create: jest.fn(),
        findMany: jest.fn(),
        delete: jest.fn(),
      },
    };
    subtaskService = new SubtaskService(prismaService);
  });

  describe("create", () => {
    it("should create a subtask", async () => {
      const taskId = 1;
      const createSubtaskDto = { title: "New subtask" };
      const createdSubtask = { id: 10, title: "New subtask", taskId };

      prismaService.subTask.create.mockResolvedValue(createdSubtask);

      const result = await subtaskService.create(taskId, createSubtaskDto);

      expect(prismaService.subTask.create).toHaveBeenCalledWith({
        data: {
          title: createSubtaskDto.title,
          task: {
            connect: {
              id: taskId,
            },
          },
        },
      });
      expect(result).toEqual(createdSubtask);
    });
  });

  describe("findAll", () => {
    it("should return all subtasks for a task", async () => {
      const taskId = 1;
      const subtasks = [
        { id: 1, title: "Subtask 1", taskId },
        { id: 2, title: "Subtask 2", taskId },
      ];

      prismaService.subTask.findMany.mockResolvedValue(subtasks);

      const result = await subtaskService.findAll(taskId);

      expect(prismaService.subTask.findMany).toHaveBeenCalledWith({
        where: {
          task: {
            id: taskId,
          },
        },
      });
      expect(result).toEqual(subtasks);
    });
  });

  describe("findOne", () => {
    it("should return subtask by id", async () => {
      const id = 1;
      const subtask = [{ id, title: "Subtask 1", taskId: 1 }];

      prismaService.subTask.findMany.mockResolvedValue(subtask);

      const result = await subtaskService.findOne(id);

      expect(prismaService.subTask.findMany).toHaveBeenCalledWith({
        where: { id },
      });
      expect(result).toEqual(subtask);
    });
  });

  describe("update", () => {
    it("should return update message", async () => {
      const id = 1;
      const updateSubtaskDto = { title: "Updated title" };

      const result = await subtaskService.update(id, updateSubtaskDto);

      expect(result).toBe(`This action updates a #${id} subtask`);
    });
  });

  describe("remove", () => {
    it("should delete a subtask", async () => {
      const id = 1;
      const deletedSubtask = { id, title: "Deleted subtask" };

      prismaService.subTask.delete.mockResolvedValue(deletedSubtask);

      const result = await subtaskService.remove(id);

      expect(prismaService.subTask.delete).toHaveBeenCalledWith({
        where: { id },
      });
      expect(result).toEqual(deletedSubtask);
    });
  });
});
