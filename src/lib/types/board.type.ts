import { ITask } from './index';
import { ISprint } from './sprint.type';

export interface IBoard {
  id: number;
  name: string;
  tasks: ITask[];
  order: number;
  sprintId?: number;
  sprint?: ISprint;
}

export interface IAddBoard {
  name: string;
  order?: number;
}