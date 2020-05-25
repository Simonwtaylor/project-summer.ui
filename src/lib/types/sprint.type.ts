import { IBoard } from "./board.type";

export interface ISprint {
  id: number;
  name: string;
  startDate?: Date;
  endDate?: Date;
  completed?: boolean;
  prefix?: string;
  boards: IBoard[];
}