import { SubredditValidator } from "@/lib/validators/subreddit";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return new Response(JSON.stringify({ error: "Not authenticated" }), {
                status: 401,
            });
        }

        const body = await req.json();
        const {name} = SubredditValidator.parse(body);

        const hasSubreddit = await db.subreddit.findFirst({
            where: {
                name,
            }
        })
        if (hasSubreddit) {
            return new Response(JSON.stringify({ error: "Subreddit already exists" }), {
                status: 409,
            });
        }
        const subreddit = await db.subreddit.create({
            data: {
                name,
                creatorId: session.user.id,
            }
        });

        await db.subscription.create({
            data: {
                userId: session.user.id,
                subredditId: subreddit.id,
            }
        });

        return new Response((subreddit.name), {
            status: 201,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response(error.message, {
                status: 422,
            })
        }
        return new Response("failed", {
            status: 500,
        })
    }
}