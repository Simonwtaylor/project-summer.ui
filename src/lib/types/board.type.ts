import { ITask } from './index';

export interface IBoard {
  id: number;
  name: string;
  tasks: ITask[];
  order: number;
}