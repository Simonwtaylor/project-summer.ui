import { IUser } from "./user.type";
import { IComment } from "./comment.type";

export interface ITask {
  id: string;
  title: string;
  boardId?: string;
  description?: string;
  dateAdded?: Date;
  user?: IUser;
  comments: IComment[];
}