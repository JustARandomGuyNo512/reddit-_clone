import { auth } from "@/lib/auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";
 
const f = createUploadthing();
 
//const auth = (req: Request) => ({ id: "fakeId" });
export const ourFileRouter = {

  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async ( req ) => {
      const session = await auth();
      if (!session?.user) throw new Error("Unauthorized");
      console.log("User id:", session.user.id);
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // console.log("Upload complete for userId:", metadata.userId);
      // console.log("file url", file.url);
      // return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;