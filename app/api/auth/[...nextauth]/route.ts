import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Basit Next-auth konfigürasyonu
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Kullanıcı Adı", type: "text" },
        password: { label: "Şifre", type: "password" }
      },
      async authorize(credentials) {
        if (credentials?.username === "admin" && credentials?.password === "admin123") {
          return {
            id: "1",
            name: "Admin",
            email: "admin@dolunay.com",
            role: "admin"
          };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: "/admin/giris",
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session?.user) {
        session.user.role = token.role;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || "dolunay-gizli-anahtar",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 