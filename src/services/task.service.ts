import type {CreateTaskPayload, Task} from "./task.interfaces";

const API_BASE_URL = 'http://localhost:3000';

export class TaskService {
    private _tasks: Task[] = [];
    private static _instance: TaskService;

    public static getInstance(): TaskService {
        if (!TaskService._instance) {
            TaskService._instance = new TaskService();
        }
        return TaskService._instance;
    }

    private constructor() {
    }

    get tasks() {
        return this._tasks;
    }

    public fetchTasks = async () => {
        this._clearTasks();
        const response = await fetch(`${API_BASE_URL}/tasks`);
        if (!response.ok) {
            throw new Error('Failed to fetch tasks');
        }
        const tasks: Task[] = await response.json();
        this._tasks = tasks.reverse();
        return this._tasks;
    }
    public fetchTaskById = async (id: string) => {
        const response = await fetch(`${API_BASE_URL}/tasks/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch task');
        }
        const newTask = await response.json();
        this._tasks = [newTask, ...this._tasks.filter(task => task.id !== id)];
        return this._tasks;
    }

    private _getCurrentISODateString = (): string => {
        return new Date().toISOString();
    }

    private _validateCreateTaskPayload = (payload: unknown): payload is CreateTaskPayload => {
        if (typeof payload !== 'object' || payload === null) {
            return false;
        }

        const requiredFields = ['title', 'description', 'status', 'priority', 'deadline'];
        for (const field of requiredFields) {
            if (!(field in payload) || typeof payload[field as keyof typeof payload] !== 'string') {
                return false;
            }
        }
        ;
        return true;
    }

    public createTask = async (formValues: unknown) => {
        const isPayloadValid = this._validateCreateTaskPayload(formValues);
        if (!isPayloadValid) {
            throw new Error('Invalid payload for creating task');
        }
        const payload: CreateTaskPayload = {
            ...formValues,
            createdAt: this._getCurrentISODateString(),
        }
        const response = await fetch(`${API_BASE_URL}/tasks`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            throw new Error('Failed to create task');
        }
        return this.fetchTasks();
    }

    public updateTask = async (id: string, payload: Partial<Task>) => {
        const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            throw new Error('Failed to update task');
        }
        return this.fetchTasks();
    }

    public deleteTask = async (id: string) => {
        const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to delete task');
        }
        return this.fetchTasks();
    }

    public _clearTasks = () => {
        this._tasks = [];
    }
}