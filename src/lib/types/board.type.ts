import { ITask } from './index';

export interface IBoard {
  id: number;
  name: string;
  tasks: ITask[];
  order: number;
}

export interface IAddBoard {
  name: string;
  order?: number;
}