import { IUser } from './index';

export interface IComment {
  id: number;
  content: string;
  datePosted: Date;
  user: IUser;
}

export interface IAddComment {
  content: string;
  user: IUser;
}