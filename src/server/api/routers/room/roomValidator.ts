import { z } from "zod";

export const createRoom = z
    .object({
        roomName: z.string().min(1),
        allowedEmails: z.string().email().array().min(1),
    })
    .refine(
        (data) =>
            new Set(data.allowedEmails).size === data.allowedEmails.length,
        {
            message: "Emails must be unique",
            path: ["allowedEmails.0"],
        },
    );

export const withRoom = z.object({
    roomId: z.string().uuid(),
});
