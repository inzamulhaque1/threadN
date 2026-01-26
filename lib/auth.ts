import { auth } from "@/lib/next-auth";
import { hashPassword, verifyPassword } from "./password";

// Re-export password utilities
export { hashPassword, verifyPassword };

export async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  if (session.user.role !== "admin") {
    throw new Error("Forbidden");
  }
  return session;
}
