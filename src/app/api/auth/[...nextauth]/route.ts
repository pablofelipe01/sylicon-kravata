// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from "@supabase/supabase-js";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import bcrypt from "bcrypt";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        
        try {
          // Buscar usuario por email
          const { data: user, error } = await supabase
            .from("users")
            .select("*")
            .eq("email", credentials.email)
            .single();
          
          if (error || !user) {
            console.error("Usuario no encontrado:", error);
            return null;
          }
          
          // Verificar la contraseña
          // Si usas bcrypt para hashear contraseñas
          // const passwordMatch = await bcrypt.compare(credentials.password, user.password);
          
          // Para desarrollo/pruebas sin bcrypt
          const passwordMatch = user.password === credentials.password;
          
          if (!passwordMatch) {
            console.error("Contraseña incorrecta");
            return null;
          }
          
          return {
            id: user.id,
            email: user.email,
            name: user.name || user.email,
            role: user.role, // 'admin' o 'user'
          };
        } catch (error) {
          console.error("Error en autenticación:", error);
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
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  pages: {
    signIn: '/login',
    error: '/login', // Página de error de autenticación
  },
  secret: process.env.NEXTAUTH_SECRET || "tu-secreto-seguro-para-desarrollo",
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };