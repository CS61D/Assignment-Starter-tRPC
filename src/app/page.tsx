import { getServerAuthSession } from "@/server/auth";
import { HydrateClient } from "@/trpc/server";
import { CreateRoom } from "./_components/CreateRoom";
import { JoinRoom } from "./_components/JoinRoom";
import { SignInButton } from "./_components/SignInButton";

export default async function Home() {
    const session = await getServerAuthSession();

    return (
        <HydrateClient>
            <main className="flex min-h-screen flex-col items-center justify-center">
                <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
                    <h1 className="font-extrabold text-5xl tracking-tight sm:text-[5rem]">
                        Ranked Choice Voting
                    </h1>
                    <p>
                        Easily tally ranked choice voting results with your
                        friends. Vote on anything you like!
                    </p>
                    <JoinRoom />
                    {session && <CreateRoom />}
                    <SignInButton session={session} />
                </div>
            </main>
        </HydrateClient>
    );
}
