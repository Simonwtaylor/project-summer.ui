import { IUser } from "./user.type";
import { IComment } from "./comment.type";
import { IActivity } from './activity.type';
import { IBoard } from "./board.type";

export interface ITask {
  id: string;
  title: string;
  boardId?: string;
  board?: IBoard;
  description?: string;
  completed?: boolean;
  dateAdded?: Date;
  dueDate?: Date;
  storyPoints?: number;
  user?: IUser;
  comments: IComment[];
  activities: IActivity[];
}

export interface IAddTask {
  title: string;
  boardId?: string;
}
