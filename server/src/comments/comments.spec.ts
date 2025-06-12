import { CommentsService } from "./comments.service";

describe("CommentsService", () => {
  let commentsService: CommentsService;
  let prismaService: any;

  beforeEach(() => {
    prismaService = {
      comment: {
        create: jest.fn(),
        findMany: jest.fn(),
      },
    };
    commentsService = new CommentsService(prismaService);
  });

  describe("create", () => {
    it("should create a comment", async () => {
      const taskId = 1;
      const createCommentDto = { comment: "Test comment" };
      const user = {
        id: 2,
        name: "User Name",
        email: "user@example.com",
        password: "hashedpassword",
        lastname: "Lastname",
        avatarUrl: "http://example.com/avatar.png",
      };
      const createdComment = {
        id: 10,
        comment: createCommentDto.comment,
        task_id: taskId,
        user_id: user.id,
        user,
      };

      prismaService.comment.create.mockResolvedValue(createdComment);

      const result = await commentsService.create(
        taskId,
        createCommentDto,
        user,
      );

      expect(prismaService.comment.create).toHaveBeenCalledWith({
        data: {
          comment: createCommentDto.comment,
          task: {
            connect: { id: taskId },
          },
          user: {
            connect: { id: user.id },
          },
        },
        include: { user: true },
      });
      expect(result).toEqual(createdComment);
    });
  });

  describe("findAll", () => {
    it("should return all comments for a task ordered by createdAt desc", async () => {
      const taskId = 1;
      const comments = [
        {
          id: 1,
          comment: "First comment",
          task_id: taskId,
          user_id: 2,
          user: {
            id: 2,
            name: "User One",
            email: "one@example.com",
            password: "hashed1",
            lastname: "One",
            avatarUrl: "http://example.com/avatar1.png",
          },
          createdAt: new Date("2023-01-01T10:00:00Z"),
        },
        {
          id: 2,
          comment: "Second comment",
          task_id: taskId,
          user_id: 3,
          user: {
            id: 3,
            name: "User Two",
            email: "two@example.com",
            password: "hashed2",
            lastname: "Two",
            avatarUrl: "http://example.com/avatar2.png",
          },
          createdAt: new Date("2023-01-02T10:00:00Z"),
        },
      ];

      prismaService.comment.findMany.mockResolvedValue(comments);

      const result = await commentsService.findAll(taskId);

      expect(prismaService.comment.findMany).toHaveBeenCalledWith({
        where: { task_id: taskId },
        include: { user: true },
        orderBy: { createdAt: "desc" },
      });
      expect(result).toEqual(comments);
    });
  });
});
