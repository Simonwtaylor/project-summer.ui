import { IBoard } from "./board.type";
import { IComment } from "./comment.type";

export interface ISprint {
  id: number;
  name: string;
  startDate?: Date;
  endDate?: Date;
  completed?: boolean;
  prefix?: string;
  boards: IBoard[];
  comments: IComment[];
}

export interface IAddSprint {
  name: string;
  startDate?: Date;
  endDate?: Date;
  prefix?: string;
}
