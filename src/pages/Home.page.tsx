import {Container} from "@mantine/core";
import {CreateTaskForm} from "@/components/CreateTaskForm/CreateTaskForm";

export function HomePage() {
    return (
        <Container size="md" py="xl">
            <CreateTaskForm/>
        </Container>
    );
}
