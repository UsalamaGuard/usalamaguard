import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";

// Simulated database (replace with MongoDB or similar in production)
let users = [];

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = users.find((u) => u.email === credentials.email);
        if (!user || !(await compare(credentials.password, user.password))) {
          throw new Error("Invalid credentials");
        }
        return { email: user.email, notificationEmail: user.notificationEmail };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET);
        token.notificationEmail = user.notificationEmail;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user.notificationEmail = token.notificationEmail;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});