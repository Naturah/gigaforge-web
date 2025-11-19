import * as React from "react";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
  isRouteErrorResponse,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import Nav from "./components/nav";

import styles from "./tailwind.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
];

function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-black text-white">
        <Nav />
        <main className="min-h-screen">
          <Outlet />
        </main>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);

  return (
    <html lang="en">
      <head>
        <title>Error - GigaForge</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-black text-white">
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="bg-black/40 backdrop-blur-lg border border-red-500/30 p-8 rounded-xl max-w-xl w-full text-center">
            <h1 className="text-3xl font-bold text-red-400 mb-4">
              {isRouteErrorResponse(error)
                ? `${error.status} ${error.statusText}`
                : error instanceof Error
                ? error.message
                : "An unexpected error occurred"}
            </h1>
            <a
              href="/"
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-colors inline-block mt-4"
            >
              Return to Home
            </a>
          </div>
        </div>
        <Scripts />
      </body>
    </html>
  );
}

export default App;
