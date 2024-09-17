import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const NEXT_PUPLIC_CLERK_URL = process.env.NEXT_PUPLIC_CLERK_URL;
if (!NEXT_PUPLIC_CLERK_URL) {
  throw new Error("NEXT_PUBLIC_CLERK_URL is not defined");
}

const isPublicRoute = createRouteMatcher(["/", "/pricing"]);

export default clerkMiddleware((auth, request) => {
  // If the user is not authenticated and they are trying to access
  // a private route, redirect them to the Clerk sign in page
  if (!auth().userId && !isPublicRoute(request)) {
    auth().protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
