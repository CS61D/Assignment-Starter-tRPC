"use client";

import {
    DndContext,
    type DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    closestCorners,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    SortableContext,
    arrayMove,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

import { api } from "@/trpc/react";
import { Item } from "./Item";

export const Task = ({
    id,
    title,
    position,
    description,
}: {
    id: string;
    title: string;
    position: number;
    description: string;
}) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="task"
        >
            <Item
                id={id}
                index={position}
                name={title}
                description={description}
            />
        </div>
    );
};

export const RankVotingItems = ({ roomId }: { roomId: string }) => {
    const utils = api.useUtils();

    // TODO: 3.7 Get Votes Query
    const myVotes = [];
    const [tasks, setTasks] = useState(myVotes);

    // TODO: 3.8 Update Voting Items Mutation

    // TODO: 3.11 Invalidate Room On Failed Requests

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    const getTaskPos = (id: string) =>
        tasks.findIndex((task) => task.vote.id === id);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id === over.id) return;

        setTasks((tasks) => {
            const originalPos = getTaskPos(active.id);
            const newPos = getTaskPos(over.id);

            const newVotes = arrayMove(tasks, originalPos, newPos);

            // TODO: 3.8 Update Voting Items Mutation

            return newVotes;
        });
    };

    return (
        <div>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragEnd={handleDragEnd}
            >
                <div className="rounded-md border p-4 shadow-md">
                    <SortableContext
                        items={tasks.map((task) => task.vote.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {tasks.map((task, index) => (
                            <div
                                key={task.vote.id}
                                id={task.vote.id.toString()}
                            >
                                <Task
                                    key={task.vote.id}
                                    id={task.vote.id}
                                    title={task.voting_item.name}
                                    position={index}
                                    description={task.voting_item.description}
                                />
                            </div>
                        ))}
                    </SortableContext>
                </div>
            </DndContext>
        </div>
    );
};
