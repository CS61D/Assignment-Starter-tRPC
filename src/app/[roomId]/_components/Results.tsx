import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { api } from "@/trpc/react";
import React from "react";
import type { ItemRoundResult } from "@/server/api/routers/room/roomHelpers";

export const Results = ({ roomId }: { roomId: string }) => {
    // TODO: 3.9 Get Results Query
    const results: ItemRoundResult[][] = [];

    return (
        <>
            <Accordion type="multiple">
                {results.map((roundResult, index) => {
                    const winner =
                        roundResult[0] && roundResult[0].voteShare > 0.5
                            ? roundResult[0]?.votingItem?.name
                            : null;

                    let eliminated: ItemRoundResult[] = [];
                    if (winner) {
                        eliminated = roundResult.slice(1);
                    } else {
                        eliminated = [
                            roundResult[
                                roundResult.length - 1
                            ] as ItemRoundResult,
                        ];
                    }
                    return (
                        <AccordionItem
                            value={eliminated[0]?.votingItem?.id ?? ""}
                            key={eliminated[0]?.votingItem?.id}
                            className="w-96"
                        >
                            <AccordionTrigger>
                                {/* <h1 className="text-xl font-bold">
									{index + 1}. {eliminated?.votingItem?.name}
								</h1> */}{" "}
                                <h1 className="text-xl font-bold">
                                    Round {results.length - index}:{" "}
                                    {winner
                                        ? `${winner} Wins!`
                                        : "No winner yet"}
                                </h1>
                                {eliminated.length >= 1 && (
                                    <p>
                                        Eliminated{" "}
                                        {eliminated
                                            .map(
                                                (item) => item.votingItem?.name,
                                            )
                                            .join(", ")}
                                    </p>
                                )}
                            </AccordionTrigger>
                            <AccordionContent>
                                <h1 className="text-xl font-semibold">
                                    Round Results:
                                </h1>
                                {roundResult.map((result) => {
                                    return (
                                        <div key={result.votingItem?.id}>
                                            {result.place}.{" "}
                                            {result.votingItem?.name} -{" "}
                                            {result.votes} first place votes -{" "}
                                            {Math.round(result.voteShare * 100)}
                                            % vote share
                                        </div>
                                    );
                                })}
                                <br />
                                {!winner ? (
                                    <p>
                                        The {eliminated[0]?.votes} voters who
                                        voted for{" "}
                                        {eliminated[0]?.votingItem?.name} will
                                        have their vote count for their next
                                        highest choice in the next round
                                    </p>
                                ) : (
                                    <p>
                                        {winner} received more than 50% first
                                        place votes this round and is the winner
                                    </p>
                                )}
                            </AccordionContent>
                        </AccordionItem>
                    );
                })}
            </Accordion>
        </>
    );
};
