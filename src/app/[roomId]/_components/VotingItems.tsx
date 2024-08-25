"use client";

import { api } from "@/trpc/react";
import { Suspense } from "react";
import { Item } from "./Item";

export const VotingItems = ({ roomId }: { roomId: string }) => {
    // TODO: 3.3 Get Voting Items Query
    // Replace the placeholder empty array a suspense query to get the voting items
    const items = [];

    if (items.length === 0) {
        return <div>No voting items</div>;
    }

    return (
        <div>
            {items.map((votingItem, index) => (
                <Item
                    id={votingItem.id}
                    key={votingItem.id}
                    index={index}
                    name={votingItem.name}
                    description={votingItem.description}
                />
            ))}
        </div>
    );
};
