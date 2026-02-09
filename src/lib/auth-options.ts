import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "../../prisma/prisma-client";
import { compare } from "bcryptjs";
import { UserRole } from "@prisma/client";

export const authOptions: AuthOptions = {
  providers: [
    // 1. Вхід через Google
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    // 2. Вхід через Email/Password
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const values = {
          email: credentials.email,
        };

        const findUser = await prisma.user.findFirst({
          where: values,
        });

        if (!findUser) return null;

        const isPasswordValid = await compare(
          credentials.password,
          findUser.password as string,
        );

        if (!isPasswordValid) return null;

        // if (!findUser.verified) return null; // Якщо будемо робити підтвердження пошти

        return {
          id: String(findUser.id),
          email: findUser.email,
          name: findUser.fullName,
          role: findUser.role,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      try {
        if (account?.provider === "credentials") {
          return true;
        }

        if (account?.provider === "google") {
          const findUser = await prisma.user.findFirst({
            where: {
              email: user.email as string,
            },
          });

          if (findUser) {
            await prisma.user.update({
              where: {
                id: findUser.id,
              },
              data: {
                provider: account.provider,
                providerId: account.providerAccountId,
              },
            });

            return true;
          }

          await prisma.user.create({
            data: {
              email: user.email as string,
              fullName: user.name || "User #" + user.id,
              password: Math.random().toString(36).slice(-8), // Генеруємо випадковий пароль для Google-юзерів
              role: "USER",
              provider: account.provider,
              providerId: account.providerAccountId,
            },
          });

          return true;
        }

        return false;
      } catch (error) {
        console.error("Error [SIGNIN]", error);
        return false;
      }
    },
    async jwt({ token }) {
      if (!token.email) return token;

      const findUser = await prisma.user.findFirst({
        where: {
          email: token.email,
        },
      });

      if (findUser) {
        token.id = String(findUser.id);
        token.email = findUser.email;
        token.fullName = findUser.fullName;
        token.role = findUser.role;
      }

      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
      }

      return session;
    },
  },
};
