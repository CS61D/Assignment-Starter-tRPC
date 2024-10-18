import type { InferSelectModel } from "drizzle-orm";

import type { vote, votingItem } from "@/server/db/schema";

type RoomStatus = "open" | "voting" | "complete";

export const nextStatus = (status: RoomStatus) => {
    switch (status) {
        case "open":
            return "voting";
        case "voting":
            return "complete";
        case "complete":
            return "complete";
    }
};

export type ItemRoundResult = {
    place: number;
    voteShare: number;
    votes: number;
    votingItem: InferSelectModel<typeof votingItem> | undefined;
};

export const calculateResults = (
    allVotes: InferSelectModel<typeof vote>[],
    allOptions: InferSelectModel<typeof votingItem>[],
) => {
    const numberOfOptions = allOptions.length;

    // Map each voter to their votes
    // Put their votes in an array ordered by position
    const userResults: Map<string, InferSelectModel<typeof vote>[]> = new Map();

    for (const vote of allVotes) {
        if (!userResults.has(vote.userId)) {
            userResults.set(vote.userId, Array(numberOfOptions).fill(null));
        }
        const userVotes = userResults.get(vote.userId);
        if (userVotes) {
            userVotes[vote.position - 1] = vote;
            userResults.set(vote.userId, userVotes);
        }
    }

    // Filter out all null values from the user results
    for (const [userId, votes] of userResults.entries()) {
        if (!votes) {
            continue;
        }
        userResults.set(
            userId,
            votes.filter((vote) => vote !== null),
        );
    }

    let hasWinner = false;

    // Each round maps the voting item to it's result within the round
    const roundResults: ItemRoundResult[][] = [];
    const eligibleItems = new Set(allOptions.map((item) => item.id));

    while (!hasWinner) {
        // Tally votes for round
        const currentRoundResults: Map<string, ItemRoundResult> = new Map();
        let totalVotes = 0;

        for (const [userId, userVotes] of userResults.entries()) {
            if (!userVotes) {
                continue;
            }

            // Loop through the votes of a given user in order to find their top eligible vote
            for (const vote of userVotes) {
                if (!vote) {
                    continue;
                }
                if (eligibleItems.has(vote.votingItemId)) {
                    const oldTotal =
                        currentRoundResults.get(vote.votingItemId)?.votes || 0;
                    totalVotes++;
                    const item = allOptions.find(
                        (item) => item.id === vote.votingItemId,
                    );
                    if (!item) {
                        continue;
                    }
                    currentRoundResults.set(vote.votingItemId, {
                        place: 0,
                        voteShare: 0,
                        votes: oldTotal + 1,
                        votingItem: item,
                    });
                    break;
                }
            }
        }

        // Add all eligible items not already in the current round results and set their votes to 0
        for (const item of allOptions) {
            if (
                !currentRoundResults.has(item.id) &&
                eligibleItems.has(item.id)
            ) {
                currentRoundResults.set(item.id, {
                    place: 0,
                    voteShare: 0,
                    votes: 0,
                    votingItem: item,
                });
            }
        }

        // Order the current round results by votes
        // Break ties by the time the voting item was created
        const orderedResults = Array.from(currentRoundResults)
            .sort((a, b) => {
                if (a[1].votes === b[1].votes) {
                    return (
                        // @ts-ignore
                        b[1].votingItem?.createdAt.getTime() -
                        // @ts-ignore
                        a[1].votingItem?.createdAt.getTime()
                    );
                }
                return b[1].votes - a[1].votes;
            })
            .map(([_, value]) => value);

        // Loop through the ordered results again to assign place and vote share
        let place = 1;
        for (const result of orderedResults) {
            result.place = place;
            result.voteShare = result.votes / totalVotes;
            if (result.voteShare > 0.5) {
                hasWinner = true;
            }
            place++;
        }

        // Add the current round results to the round results
        roundResults.push(orderedResults);
        const eliminatedItemId = (orderedResults.at(-1) as ItemRoundResult)
            .votingItem?.id as string;

        eligibleItems.delete(eliminatedItemId);
    }
    return roundResults.reverse();
};
