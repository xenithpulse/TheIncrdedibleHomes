import NextAuth, { getServerSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { mongooseConnect } from '@/lib/mongoose'; // Ensure this connects to your MongoDB
import bcrypt from 'bcrypt';

export const authOptions = {
  secret: process.env.SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        const { db } = await mongooseConnect();

        const { username, password } = credentials;

        // Connect to the database
        console.log("Connecting to database...");

        // Fetch the admin user from the database
        const admin = await db.collection('admins').findOne({ username });
        console.log("Connected to database");

        if (!admin) {
          return null; // User not found
        }

        // Verify the password
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        console.log("Password validation successful.");

        if (!isPasswordValid) {
          return null; // Invalid credentials
        }

        // Return the authenticated user
        return { id: admin._id, name: admin.username };
      },
    }),
  ],

  pages: {
    signIn: "/pages/loginpage", // Redirect to your custom sign-in page
  },

  callbacks: {
    async session({ session, token, user }) {
      // Attach user details to session
      session.user = token.user || null;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
  },

  session: {
    strategy: 'jwt',
    maxAge: 1 * 60 * 60, // Session expires after 2 hours
  },
};

export default NextAuth(authOptions);

// isAdminRequest Function
export async function isAdminRequest(req, res) {
  await mongooseConnect()
  const session = await getServerSession(req, res, authOptions);
  const { db } = await mongooseConnect();


  if (!session || !session.user?.name) {
    res.status(401).json({ error: 'Unauthorized access. Admin only.' });
    throw new Error('Not an admin');
  }


  // Verify the user exists and is an admin
  const admin = await db.collection('admins').findOne({ username: session.user.name });

  if (!admin) {
    res.status(401).json({ error: 'Unauthorized access. Admin only.' });
    throw new Error('Not an admin');
  }
}
