"use client";
import { LucideTrash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createRoom as createRoomValidator } from "@/server/api/routers/room/roomValidator";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { type SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import type { z } from "zod";

export const CreateRoom = () => {
    const router = useRouter();
    type CreateRoomForm = z.infer<typeof createRoomValidator>;

    const form = useForm<CreateRoomForm>({
        defaultValues: {
            roomName: "",
            allowedEmails: ["example@gmail.com"],
        },
        resolver: zodResolver(createRoomValidator),
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "allowedEmails",
    });

    // TODO: 3.1: Create Room Mutation: Define mutation

    const onSubmit: SubmitHandler<CreateRoomForm> = async (data) => {
        // TODO: 3.1: Create Room Mutation: Call mutation
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Create Voting Room</Button>
            </DialogTrigger>
            <DialogContent className="border">
                <DialogHeader>
                    <DialogTitle>Create Room</DialogTitle>
                    <DialogDescription>
                        You must add at least one additional email to create a
                        room. Your email is automatically added.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="max-h-96 space-y-2 overflow-auto py-4 pl-1">
                            <div className="flex">
                                <FormField
                                    control={form.control}
                                    name="roomName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Room Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Voting Room"
                                                    {...field}
                                                />
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            {fields.map((field, index) => (
                                <div
                                    key={field.id}
                                    className="flex flex-row items-baseline space-x-2"
                                >
                                    <FormField
                                        key={field.id}
                                        control={form.control}
                                        name={`allowedEmails.${index}`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{`Email ${index + 1}`}</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => {
                                            remove(index);
                                        }}
                                        className="self-end"
                                    >
                                        <LucideTrash />
                                    </Button>
                                </div>
                            ))}
                        </div>

                        <DialogFooter className="sm:justify-start">
                            <Button
                                type="button"
                                onClick={() => {
                                    append("");
                                }}
                            >
                                Add Email
                            </Button>
                            <Button
                                type="submit"
                                onClick={() => form.handleSubmit(onSubmit)}
                                // TODO: 3.1: Create Room Mutation: Disable button while submitting
                            >
                                Submit
                            </Button>
                            <DialogClose asChild>
                                <Button type="button" variant="secondary">
                                    Close
                                </Button>
                            </DialogClose>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
