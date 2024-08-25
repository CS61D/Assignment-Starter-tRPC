import React from "react";

export const Item = ({
    id,
    index,
    name,
    description,
}: {
    id: string;
    index: number;
    name: string;
    description: string;
}) => {
    return (
        <div key={id}>
            <h2 className="font-bold text-xl">
                {index + 1}. {name}:{" "}
                <span className="font-normal text-gray-600 text-md">
                    {description}
                </span>
            </h2>
        </div>
    );
};
