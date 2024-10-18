"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import type { TRPCError } from "@trpc/server";
import { Suspense } from "react";
import { CreateVotingItem } from "./_components/AddVotingItem";
import { CopyButton } from "./_components/CopyButton";
import { RankVotingItems } from "./_components/RankVotingItems";
import { Results } from "./_components/Results";
import { VotingItems } from "./_components/VotingItems";
import { useRouter } from "next/navigation";

const getMessage = (roomStatus: "open" | "voting" | "complete") => {
    switch (roomStatus) {
        case "open":
            return "Add voting items to the room";
        case "voting":
            return "Rank the voting items";
        case "complete":
            return "View the results of the vote. Note, ties are broken by the time the voting item was created.";
    }
};

const RoomPage = ({ params }: { params: { roomId: string } }) => {
    const utils = api.useUtils();
    const router = useRouter();

    // TODO: 3.2 Get Room Query
    // Replace the placeholder room with the actual room
    const room = {
        name: "Test Room",
        allowedEmails: ["example@gmail.com"],
        status: "open" as const,
    };

    // TODO: 3.6 Advance Stage Mutation

    const handleAdvanceStage = () => {
        // TODO: 3.6 Call Advance Stage Mutation
    };

    const refreshVotingItems = () => {
        // Todo: 3.5 Refresh Voting Items
    };

    const renderMainDisplay = () => {
        switch (room.status) {
            case "open":
                return (
                    <>
                        <VotingItems roomId={params.roomId} />
                        <CreateVotingItem roomId={params.roomId} />
                    </>
                );
            case "voting":
                return <RankVotingItems roomId={params.roomId} />;
            case "complete":
                return <Results roomId={params.roomId} />;
        }
    };

    try {
        return (
            <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
                <h1 className="font-extrabold text-5xl">{room.name} </h1>
                <div className="flex flex-col items-center space-y-2 text-center">
                    <span className="font-bold text-lg">
                        Room participants:{" "}
                        <span className="font-normal">
                            {room.allowedEmails}
                        </span>
                    </span>
                    <div className="flex flex-row space-x-2">
                        <span className="font-bold text-lg">
                            {room.status} stage:{" "}
                            <span className="font-normal">
                                {getMessage(room.status)}
                            </span>
                        </span>
                        <Button
                            onClick={() => handleAdvanceStage()}
                            // TODO: 3.6 Disable button when mutation is pending
                            disabled={room.status === "complete"}
                            variant="outline"
                        >
                            Advance stage
                        </Button>
                        <Button
                            onClick={() => router.push("/")}
                            variant="outline"
                        >
                            Back to Join Room
                        </Button>
                        <CopyButton copyText={params.roomId} />
                        {room.status === "open" && (
                            <Button
                                onClick={() => refreshVotingItems()}
                                variant="outline"
                            >
                                Refresh Voting Items
                            </Button>
                        )}
                    </div>
                </div>
                <Suspense fallback={<div>Loading...</div>}>
                    {renderMainDisplay()}
                </Suspense>
            </div>
        );
    } catch (error) {
        console.log(error);
        const serverError = error as TRPCError;
        if (serverError.code === "UNAUTHORIZED") {
            throw new Error("You are not authorized to view this room");
        }
        throw new Error("Room not found");
    }
};

export default RoomPage;
