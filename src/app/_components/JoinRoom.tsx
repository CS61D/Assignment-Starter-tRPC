"use client";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

export const JoinRoom = () => {
    const { toast } = useToast();
    const router = useRouter();
    const utils = api.useUtils();

    const roomValidator = z.object({
        roomId: z.string().uuid(),
    });

    type JoinRoomType = z.infer<typeof roomValidator>;

    const form = useForm<JoinRoomType>({
        resolver: zodResolver(roomValidator),
    });

    // Will only return the room if the user has access to it

    const onSubmit: SubmitHandler<JoinRoomType> = async (data) => {
        try {
            // TODO: 3.10 Join Room
            toast({
                title: "Not Implemented",
                description: "This feature is not implemented yet",
            });
            // biome-ignore lint/suspicious/noExplicitAny: <because I said so>
        } catch (error: any) {
            let message = "An error occurred";
            if (error.message === "UNAUTHORIZED") {
                message = "You do not have access to this room";
            } else if (error.message === "NOT_FOUND") {
                message = "Room not found";
            }

            toast({
                title: "Error",
                description: message,
            });
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-2/3 space-y-6"
            >
                <div className="max-h-96 w-full overflow-auto p-4">
                    <FormField
                        control={form.control}
                        name="roomId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Room Id</FormLabel>
                                <FormControl>
                                    <Input placeholder="Room Id" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button
                    type="submit"
                    onClick={() => form.handleSubmit(onSubmit)}
                >
                    Join Room
                </Button>
            </form>
        </Form>
    );
};
