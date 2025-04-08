import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          console.log("Authorizing user with email:", credentials.email);
          const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
          console.log("Backend URL:", backendUrl);
          const res = await axios.post(
            `${backendUrl}/api/auth/login`,
            {
              email: credentials.email,
              password: credentials.password,
            },
            {
              headers: { "Content-Type": "application/json" },
            }
          );
          console.log("Axios response status:", res.status);
          console.log("Axios response data:", res.data);
          if (res.status === 200 && res.data && res.data.id) {
            console.log("Authorization successful for user:", res.data.email);
            return {
              id: res.data.id,
              email: res.data.email,
              firstName: res.data.firstName,
            };
          }
          console.log("Authorization failed: No valid user data returned");
          return null; // Return null for failed auth, handled in LoginPage
        } catch (error) {
          console.error("Authorize error:", {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
          });
          return null; // Return null instead of throwing, let client handle
        }
      },
    }),
  ],
  pages: {
    signIn: "/login", // Keep custom sign-in page
    error: null, // Disable default error page
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.firstName = user.firstName;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.firstName = token.firstName;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "default-secret-for-dev", // Required for JWT encryption
  debug: true,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };