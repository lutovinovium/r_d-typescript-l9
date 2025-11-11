import {z} from "zod";
import {Priority, Status} from "@/services/task.constants";

export const createTaskSchema = z.object({
    title: z.string("Title must be a string")
        .min(10, "Title must be at least 10 characters long")
        .max(100, "Title must be at most 100 characters long"),
    description: z.string()
        .min(10, "Description must be at least 10 characters long")
        .max(500, "Description must be at most 500 characters long")
        .optional(),
    deadline: z.iso.date().optional().refine((date) => {
        const now = new Date();
        const parsedDate = z.coerce.date().safeParse(date);

        if (!parsedDate.success) {
            return false;
        }

        return parsedDate.data > now;
    }, {
        error: 'Deadline must be in future'
    }),
    priority: z.enum(Priority, 'Please select a priority'),
    status: z.enum(Status, 'Please select a priority')
});