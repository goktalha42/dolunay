import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { executeQuery } from "@/lib/db";
import bcrypt from "bcrypt";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Kimlik Bilgileri",
      credentials: {
        username: { label: "Kullanıcı Adı", type: "text" },
        password: { label: "Şifre", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }
        
        try {
          // Veritabanından kullanıcıyı bul
          const users = await executeQuery(
            "SELECT * FROM users WHERE username = ?",
            [credentials.username]
          );
          
          if (!users || users.length === 0) {
            return null;
          }
          
          const user = users[0];
          
          // Şifre kontrolü - mock veride doğru şifre 123456
          let passwordMatch = false;
          
          try {
            passwordMatch = await bcrypt.compare(
              credentials.password,
              user.password
            );
          } catch (e) {
            // Bcrypt hash kontrolünde hata oluşursa, basit kontrol yap
            if (credentials.password === "123456" && user.username === "admin") {
              passwordMatch = true;
            }
          }
          
          if (!passwordMatch) {
            return null;
          }
          
          // Döndürülen user nesnesi JWT token içine yerleştirilecek
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            username: user.username
          };
        } catch (error) {
          console.error("Auth hatası:", error);
          
          // Hata durumunda admin/123456 ise oturum aç
          if (credentials.username === "admin" && credentials.password === "123456") {
            return {
              id: 1,
              name: "Admin Kullanıcı",
              email: "admin@dolunay.com",
              role: "admin",
              username: "admin"
            };
          }
          
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.username = token.username;
      }
      return session;
    }
  },
  pages: {
    signIn: "/admin",
    error: "/admin",
  },
  secret: process.env.NEXTAUTH_SECRET || "dolunay-admin-panel-gizli-anahtar",
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 gün
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 