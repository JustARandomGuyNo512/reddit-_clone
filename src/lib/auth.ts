import NextAuth from 'next-auth';
import Github from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import { nanoid } from 'nanoid';
import { db } from '@/lib/db';
import { JWT } from "next-auth/jwt";

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: '/',
  },
  providers: [
    Google({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET
      }),
    Github
  ],
  callbacks: {
    jwt: async ({token, user}) => {
      const dbUser = await db.user.findFirst({
        where: {
          email: token.email,
        },
      })
      
      if (!dbUser) {
        if (user) {
          token.id = user!.id
        }
        //console.log("aaa", token, user)
        return token
      }

      if (!dbUser.username) {
        await db.user.update({
          where: {
            id: dbUser.id,
          },
          data: {
            username: nanoid(10),
          },
        })
      }
      //console.log(token, user)
      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
        username: dbUser.username,
      }
      // console.log("token:", token, "user:", user, "dbUser:", dbUser)
      // return token;
    },
    session: async ({session, token}) => {
      if (token) {
        session.user.id = token.sub ? token.sub : nanoid(10);
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.picture
        session.user.username = nanoid(10);
      }
      console.log(session)
      return session
    },
    redirect() {
      return '/'
    }
  }
});