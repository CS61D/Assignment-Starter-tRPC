import { appRouter } from "@/server/api/root";
import { renderTrpcPanel } from "trpc-ui";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    return new NextResponse(
        renderTrpcPanel(appRouter, {
            url: "/api/trpc",
            transformer: "superjson",
        }),
        {
            status: 200,
            headers: [["Content-Type", "text/html"] as [string, string]],
        },
    );
}
