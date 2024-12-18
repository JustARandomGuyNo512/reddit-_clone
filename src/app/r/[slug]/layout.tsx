import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import SubscribeLeaveToggle from "@/components/SubscribeLeaveToggle";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";

const Layout = async ({
  children,
  params: { slug },
}: {
  children: React.ReactNode;
  params: { slug: string };
}) => {
  
  const session = await auth();

  const subreddit = await db.subreddit.findFirst({
    where: { name: slug },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
        },
      },
    },
  })

  const subscription = !session?.user
    ? undefined
    : await db.subscription.findFirst({
        where: {
          subreddit: {
            name: slug,
          },
          user: {
            id: session.user.id,
          },
        },
      });

  const isSubscribed = subscription ? true : false;

  if (!subreddit) {
    return notFound();
  }

  const memberCount = await db.subscription.count({
    where: {
      subreddit: {
        name: slug,
      },
    },
  });

  return (
    <>
      <div className="sm:container max-w-7xl mx-auto h-full pt-12">
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
            <div className="flex flex-col col-span-2 space-y-6">{children}</div>

            <div className="overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last">
              <div className="px-6 py-4">
                <p className="font-semibold py-3">About r/{subreddit?.name}</p>
              </div>

              <dl className="divide-y divide-gray-100 px-6 py-4 text-sm leading-6 bg-white">
                <div className="flex justify-between gap-x-4 py-3">
                  <dt className="text-gray-500">创建于</dt>
                  <dt className="text-gray-700">
                    <time dateTime={subreddit.createdAt.toDateString()}>
                      {format(subreddit.createdAt, "MMMM d, yyyy")}
                    </time>
                  </dt>
                </div>
                <div className="flex justify-between gap-x-4 py-3">
                  <dt className="text-gray-500">成员</dt>
                  <dd className="flex items-start gap-x-2">
                    <div className="text-gray-900">{memberCount}</div>
                  </dd>
                </div>

                {subreddit.creatorId === session?.user?.id ? (
                  <>
                    <div className="flex justify-between gap-x-4 py-3">
                      <dt className="text-gray-500">该社区由你创建</dt>
                    </div>
                  </>
                ) : null}

                {subreddit.creatorId !== session?.user?.id ? (
                  <>
                    <SubscribeLeaveToggle
                      isSubscribed={isSubscribed}
                      subredditId={subreddit.id}
                      subredditName={subreddit.name}
                    />
                  </>
                ) : null}

                <Link
                  className={buttonVariants({
                    variant: "outline",
                    className: "w-full mb-6",
                  })}
                  href={`${slug}/submit`}
                >
                  发帖
                </Link>
                {
                  subreddit.creatorId === session?.user?.id ? (
                    <Link
                      className={buttonVariants({
                      variant: "outline_danger",
                      className: "w-full mb-6",
                    })}
                    href={`/r/delete?name=${slug}`}
                    >
                      删除社区
                    </Link>
                  ) : null
                }
              </dl>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
