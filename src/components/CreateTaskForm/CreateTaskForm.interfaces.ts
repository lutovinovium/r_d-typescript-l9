import {z} from "zod";
import {createTaskSchema} from "@/components/CreateTaskForm/CreateTaskForm.schema";

export type CreateTaskFormSchemaType = z.infer<typeof createTaskSchema>;