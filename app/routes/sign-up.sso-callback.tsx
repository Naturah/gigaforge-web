import { LoaderFunction } from "@remix-run/node";
import { getAuth } from "@clerk/remix/ssr.server";

export const loader: LoaderFunction = async (args) => {
  const { userId } = await getAuth(args);
  
  // If we have a userId, the user is authenticated
  if (userId) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/onboarding",
      },
    });
  }

  // If no userId, redirect to sign-in
  return new Response(null, {
    status: 302,
    headers: {
      Location: "/sign-in",
    },
  });
}; 