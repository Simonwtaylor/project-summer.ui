import { ITask } from './task.type';
import { IUser } from './user.type';

export interface IActivity {
	id: string;
	content: string;
	dateAdded?: Date;
	task?: ITask;
	user?: IUser;
}

export interface IAddActivity {
	content: string;
}