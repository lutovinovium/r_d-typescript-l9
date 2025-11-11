import {Priority, Status} from "./task.constants";

export type Task = {
    id: string;
    title: string;
    description: string;
    status: Status;
    priority: Priority;
    createdAt: string; // ISO date string
    doneAt: string | null; // ISO date string or null
    deadline: string; // ISO date string
}

export type CreateTaskPayload = Omit<Task, 'doneAt'>;