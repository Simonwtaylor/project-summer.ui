import { IUser } from "./user.type";
import { IComment } from "./comment.type";

export interface ITask {
  id: string;
  title: string;
  boardId?: string;
  description?: string;
  completed?: boolean;
  dateAdded?: Date;
  storyPoints?: number;
  user?: IUser;
  comments: IComment[];
}

export interface IAddTask {
  title: string;
  boardId?: string;
}
