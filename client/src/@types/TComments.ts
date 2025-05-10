export type TComment = {
  id: number;
  comment: string;
};

export type TCommentFindAll = {
  id: number;
  createdAt: string;
  comment: string;
  user: TUser;
};
