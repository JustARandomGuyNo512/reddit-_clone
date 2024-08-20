import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { PostValidator } from "@/lib/validators/post";
import { z } from "zod";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return new Response("未认证", { status: 401 });
        }
        const body = await req.json();
        const {subredditId, title, content} = PostValidator.parse(body);
        const hasSubscribed = await db.subscription.findFirst({
            where: {
                subredditId: subredditId,
                userId: session.user.id
            }
        })
        if (!hasSubscribed) {
            return new Response("加入社区后发帖", { status: 400 });
        } else {
            await db.post.create({
                data: {
                    title,
                    content,
                    subredditId,
                    authorId: session.user.id
                }
            })
            return new Response("ok");
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response("无效参数", {
                status: 422,
            })
        }
        return new Response("failed", {
            status: 500,
        })
    }
}