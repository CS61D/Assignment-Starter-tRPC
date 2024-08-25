import { type InferInsertModel, and, asc, eq } from "drizzle-orm";

import { createTRPCRouter, roomProcedure } from "@/server/api/trpc";
import { vote, votingItem } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { createInsertSchema } from "drizzle-zod";
import { withRoom } from "../room/roomValidator";
import { voteIds } from "./voteValidators";

import { db } from "@/server/db";

export const voteRouter = createTRPCRouter({
    // TODO: 2.4: Add Voting Item
    // addVotingItem:
    // TODO: 2.7: Get My Votes
    // getMyVotes: roomProcedure.input(withRoom).query(async ({ ctx }) => {});
    // TODO: 2.8: Update My Votes
    // updateMyVotes:
});
