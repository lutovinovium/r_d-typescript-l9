import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button, Flex, Paper, Title} from "@mantine/core";
import {DatePickerInput, Select, TextInput} from "react-hook-form-mantine";
import {TaskService} from "@/services/task.service";
import {Priority, Status} from "@/services/task.constants";
import {createTaskSchema} from "./CreateTaskForm.schema";
import {CreateTaskFormSchemaType} from "./CreateTaskForm.interfaces";


const taskService = TaskService.getInstance();

const defaultFormValues = {
    title: '',
    description: '',
    deadline: undefined,
    priority: undefined,
    status: undefined
}

export const CreateTaskForm = () => {
    const {control, handleSubmit, formState, reset} = useForm<CreateTaskFormSchemaType>({
        resolver: zodResolver(createTaskSchema),
        defaultValues: defaultFormValues,
        mode: 'onChange'
    });

    const onSuccessfulSubmit = (data: CreateTaskFormSchemaType) => {
        taskService.createTask({
            title: data.title,
            description: data.description || '',
            deadline: data.deadline,
            priority: data.priority,
            status: data.status
        }).then((res) => {
            console.log("Task created successfully");
            console.log('Updated tasks list', res);
            reset(defaultFormValues);
        }).catch((error) => {
            console.error("Error creating task: ", error);
        });

    }

    const getOptionsFromEnum = (enumObject: Record<string, string>) => {
        return Object.values(enumObject).map(priority => ({
            value: priority,
            label: priority.charAt(0) + priority.slice(1).toLowerCase().replace('_', ' ')
        }));
    }


    return <Paper withBorder shadow="md" p="md" mt="md" radius="md" w="50%">
        <form onSubmit={handleSubmit(onSuccessfulSubmit)}>
            <Flex
                mih={50}
                gap="md"
                justify="flex-start"
                align="flex-start"
                direction="column"
                wrap="wrap"
            >
                <Title order={5}>Create new task</Title>
                <TextInput name="title"
                           label="Task title"
                           placeholder="Enter task title"
                           control={control}
                />
                <TextInput name="description"
                           label="Task description"
                           placeholder="Enter task description"
                           control={control}
                />
                <DatePickerInput name="deadline"
                                 label="Task deadline"
                                 placeholder="Select task deadline"
                                 valueFormat="YYYY-MM-DD"
                                 control={control}
                />
                <Select name="priority"
                        label="Task priority"
                        placeholder="Select priority"
                        data={getOptionsFromEnum(Priority)}
                        control={control}
                />
                <Select name="status"
                        label="Task status"
                        placeholder="Select task status"
                        data={getOptionsFromEnum(Status)}
                        control={control}
                />
                <Button variant="filled" type="submit" disabled={!formState.isValid}>Create</Button>
            </Flex>

        </form>
    </Paper>
}
