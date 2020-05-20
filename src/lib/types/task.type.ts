export interface ITask {
  id: string;
  title: string;
  boardId?: string;
  dateAdded?: Date;
}