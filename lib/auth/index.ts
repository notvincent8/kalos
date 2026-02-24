// Client-side exports (React hooks, signIn, signOut, etc.)
export * from "./client"
// Error handling utilities
export * from "./errors"
// Schemas for form validation
export * from "./schemas"

// Note: Server-side auth (lib/auth/server.ts) should be imported directly
// to avoid bundling server code in client components:
// import { auth } from "@/lib/auth/server"
