import connectDB from "@/config/db";
import User from "@/models/User";

import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 90 * 24 * 60 * 60, // 90 days in seconds
    updateAge: 24 * 60 * 60, // Extend session every 24 hours of activity
  },
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true // Always use secure cookies in production
      }
    }
  },
  callbacks: {
    // Invoked on successful signin
    async signIn({ profile }) {
      // 1. Connect to database
      await connectDB();
      // 2. Check if user exists
      const userExists = await User.findOne({ email: profile.email });
      // 3. If not, then add user to database
      if (!userExists) {
        // Truncate user name if too long
        const username = profile.name.slice(0, 20);

        await User.create({
          email: profile.email,
          username,
          image: profile.picture,
        });
      }
      // 4. Return true to allow sign in
      return true;
    },
    // Modifies the session object
    async session({ session }) {
      try {
        // 1. Connect to database (reuses existing connection if available)
        await connectDB();
        // 2. Get user from database
        const user = await User.findOne({ email: session.user.email });
        // 3. Assign the user id to the session
        if (user) {
          session.user.id = user._id.toString();
        }
      } catch (error) {
        console.error("Session callback error:", error);
        // Return session even if DB lookup fails to prevent logout
      }
      // 4. return session
      return session;
    },
  },
};
