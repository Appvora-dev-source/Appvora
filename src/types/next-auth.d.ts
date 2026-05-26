import "next-auth";

declare module "next-auth" {
  interface User {
    hasPaid?: boolean;
  }
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      hasPaid?: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    hasPaid: boolean;
  }
}