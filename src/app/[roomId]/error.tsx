"use client";

export default function RoomError({
    error,
}: {
    error: Error;
}) {
    return (
        <div className="mt-24 text-center">
            <h2>Something went wrong!</h2>
            <p>{error.message}</p>
        </div>
    );
}
