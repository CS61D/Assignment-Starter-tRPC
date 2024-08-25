import { eq } from "drizzle-orm";

import {
    createTRPCRouter,
    protectedProcedure,
    roomProcedure,
} from "@/server/api/trpc";
import { room, vote, votingItem } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { calculateResults, nextStatus } from "./roomHelpers";
import { createRoom, withRoom } from "./roomValidator";

import { db } from "@/server/db";

export const roomRouter = createTRPCRouter({
    create: protectedProcedure
        .input(createRoom)
        .mutation(async ({ ctx, input }) => {
            // TODO: 2.1: Create Room
        }),
    // TODO: 2.2: Get Room
    // get:

    // TODO: 2.5: Get Voting Items
    // getVotingItems:

    // TODO: 2.6: Advance Stage
    // advanceStage:

    // TODO: 2.9: Get Results
    // getResults:
});
