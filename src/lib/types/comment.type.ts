import { IUser } from './index';

export interface IComment {
  id: number;
  content: string;
  datePosted: Date;
  user: IUser;
}