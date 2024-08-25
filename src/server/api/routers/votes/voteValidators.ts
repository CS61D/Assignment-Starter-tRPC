import { z } from "zod";

export const voteIds = z.object({
    voteIds: z.string().uuid().array(),
});
