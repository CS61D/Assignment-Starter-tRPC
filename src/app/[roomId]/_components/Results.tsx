import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { api } from "@/trpc/react";
import React from "react";

export const Results = ({ roomId }: { roomId: string }) => {
    // TODO: 3.10 Get Results Query

    return (
        <>
            <Accordion type="multiple">
                {results.map((roundResult, index) => {
                    const lastInRound = roundResult[roundResult.length - 1];
                    return (
                        <AccordionItem
                            value={lastInRound?.votingItem?.id ?? ""}
                            key={lastInRound?.votingItem?.id}
                            className="w-96"
                        >
                            <AccordionTrigger>
                                <h1 className="font-bold text-xl">
                                    {index + 1}. {lastInRound?.votingItem?.name}
                                </h1>
                            </AccordionTrigger>
                            <AccordionContent>
                                <p className="font-light">
                                    {lastInRound?.votingItem?.description}
                                </p>
                                <h1 className="font-semibold text-xl">
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
                                {index !== 0 && (
                                    <p>
                                        The {lastInRound?.votes} voters who
                                        voted for{" "}
                                        {lastInRound?.votingItem?.name} will
                                        have their vote count for their next
                                        highest choice in the next round
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
