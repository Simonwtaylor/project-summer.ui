export interface ITask {
  id: string;
  title: string;
  boardId?: string;
  description?: string;
  dateAdded?: Date;
}