import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { CommentValidator } from "@/lib/validators/comment";
import { z } from "zod";

export async function PATCH(req:Request) {
    try {
        const body = await req.json();
        const {postId, text, replyToId} = CommentValidator.parse(body);
        const session = await auth();
        if (!session?.user) {
            return new Response(JSON.stringify({message: "Unauthorized"}), {status: 401});
        }
        await db.comment.create({
            data: {
                text,
                authorId: session.user.id,
                postId,
                replyToId
            }
        });
        return new Response("评论成功", {status: 200});
    } catch(error) {
        if (error instanceof z.ZodError) {
            return new Response("无效参数", {status: 400});
        }
        return new Response("服务器错误",
            {status:500}
        );
    }
}