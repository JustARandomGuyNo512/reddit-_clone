"use client";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useForm } from "react-hook-form";
import { PostCreationRequest, PostValidator } from "@/lib/validators/post";
import { zodResolver } from "@hookform/resolvers/zod";
import type EditorJS from "@editorjs/editorjs";
import { uploadFiles } from "@/lib/uploadthing";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { z } from "zod";
type FormData = z.infer<typeof PostValidator>

interface EditorProps {
  subredditId: string;
}

const Editor: FC<EditorProps> = ({ subredditId }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(PostValidator),
    defaultValues: {
      subredditId: subredditId,
      title: "",
      content: null,
    },
  });

  const ref = useRef<EditorJS>();
  const _titleRef = useRef<HTMLTextAreaElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);

  const initEditor = useCallback(async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default;
    const Header = (await import("@editorjs/header")).default;
    const Embed = (await import("@editorjs/embed")).default;
    const Table = (await import("@editorjs/table")).default;
    const List = (await import("@editorjs/list")).default;
    const Code = (await import("@editorjs/code")).default;
    const LinkTool = (await import("@editorjs/link")).default;
    const InlineCode = (await import("@editorjs/inline-code")).default;
    const ImageTool = (await import("@editorjs/image")).default;

    if (!ref.current) {
      const editor = new EditorJS({
        holder: "editor",
        onReady: () => {
          ref.current = editor;
        },
        placeholder: "在此处输入内容",
        inlineToolbar: true,
        data: { blocks: [] },
        tools: {
          header: Header,
          embed: Embed,
          LinkTool: {
            class: LinkTool,
            config: {
              endpoint: "/api/link",
            },
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  const res = await uploadFiles("imageUploader", {
                    files: [file],
                  });
                  console.log(res);
                  return {
                    success: true,
                    file: {
                      url: res[0].url,
                    },
                  };
                },
              },
            },
          },
          list: List,
          code: Code,
          inlineCode: InlineCode,
          table: Table,
        },
      });
    }
  }, []);

  useEffect(() => {
    const init = async() => {
      await initEditor();

      setTimeout(() => {
        _titleRef.current?.focus();
      }, 0);
    }

    if (isMounted) {
      init();
      return () => {
        ref.current?.destroy();
        ref.current = undefined;
      }
    }
  }, [isMounted, initEditor]);

  useEffect(() => {
    if (Object.keys(errors).length > 0){
      for (const [key, value] of Object.entries(errors)) {
        toast({
          title: "出错了",
          description: value.message as string,
          variant: "destructive",
        });
      }
    }
  }, [errors]);

  const { ref: titleRef, ...rest } = register('title')

  const {mutate: createPost} = useMutation({
    mutationFn: async ({title, content, subredditId}: PostCreationRequest) => {
      const payload: PostCreationRequest = {
        title: title,
        content: content,
        subredditId: subredditId,
      }
      const {data} = await axios.post("/api/subreddit/post/create", payload);
      return data;
    },
    onError: () =>{
      return toast({
        title: "出错了",
        description: "请稍后再试",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      const newPath = pathname.split("/").slice(0, -1).join("/");
      router.push(newPath);
      router.refresh();
      return toast({
        title: "成功",
        description: "帖子已创建"
      })
    }
  });

  async function onSubmit(data: any) {
    const blocks = await ref.current?.save()
    // console.log(data);
    const payload: any = {
      title: data.title,
      content: blocks,
      subredditId,
    }

    createPost(payload)
  }

  return (
    <div className="w-full p-4 bg-zinc-50 rounded-lg border border-zinc-200">
      <form id="subreddit-post-form" className="w-fit" onSubmit={handleSubmit(onSubmit)}>
        <div className="prose prose-stone dark:prose-invert">
          <TextareaAutosize
            className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"
            placeholder="标题"
            {...rest}
            ref={(e) => {
              titleRef(e);
              // @ts-ignore
              _titleRef.current = e;
            }}
          />
          <div id='editor' className='min-h-[500px]' />
        </div>
      </form>
    </div>
  );
};

export default Editor;
