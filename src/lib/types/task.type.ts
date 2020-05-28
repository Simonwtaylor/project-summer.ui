import { IUser } from "./user.type";

export interface ITask {
  id: string;
  title: string;
  boardId?: string;
  description?: string;
  dateAdded?: Date;
  user?: IUser;
}