"use client";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

export const CreateVotingItem = ({ roomId }: { roomId: string }) => {
    const voteValidator = z.object({
        roomId: z.string(),
        name: z.string().min(1),
        description: z.string().min(1),
    });

    type CreateItemType = z.infer<typeof voteValidator>;

    const form = useForm<CreateItemType>({
        defaultValues: {
            roomId,
            name: "",
            description: "",
        },
        resolver: zodResolver(voteValidator),
    });
    const utils = api.useUtils();

    // TODO: 3.4 Add Voting Item Mutation

    // TODO: 3.11 Invalidate Room On Failed Requests

    const onSubmit: SubmitHandler<CreateItemType> = async (data) => {
        // TODO: 3.4 Call Add Voting Item Mutation
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
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Voting Item Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Name" {...field} />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Voting Item Description</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Description"
                                        {...field}
                                    />
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
                    Submit
                </Button>
            </form>
        </Form>
    );
};
