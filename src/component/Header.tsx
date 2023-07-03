import { signIn, signOut, useSession } from "next-auth/react";
import { useBuyCredits } from "~/hooks/useBuyCredits";
import { api } from "~/utils/api";
import { Button } from "./Button";
import { PrimaryLink } from "./PrimaryLInk";
import Image from "next/image";

export function Header() {
  const session = useSession();
  const { buyCredits } = useBuyCredits();

  const isLoggedIn = !!session.data;

  const credits = api.user.getCredits.useQuery(undefined, {
    enabled: isLoggedIn,
  });

  return (
    <header className="dark:bg-gray-900">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <PrimaryLink href="/">Icon Generator</PrimaryLink>
        <ul className="flex gap-4">
          <li>
            <PrimaryLink href="/generate">Generate</PrimaryLink>
          </li>
          <li>
            <PrimaryLink href="/community">Community</PrimaryLink>
          </li>
          {isLoggedIn && (
            <li>
              <PrimaryLink href="/collection">Collection</PrimaryLink>
            </li>
          )}
        </ul>
        <ul className="flex gap-4">
          {isLoggedIn && (
            <>
              <div className="flex items-center">
                Credits remaining {credits.data}
              </div>
              <li>
                <Button
                  onClick={() => {
                    buyCredits().catch(console.error);
                  }}
                >
                  Buy Credits
                </Button>
              </li>
              <li>
                <Button
                  variant="secondary"
                  onClick={() => {
                    signOut().catch(console.error);
                  }}
                >
                  Logout
                </Button>
              </li>
            </>
          )}
          {!isLoggedIn && (
            <li>
              <button
                onClick={() => {
                  signIn().catch(console.error);
                }}
                className="border-gray-secondary-400/60 text-md hover:bg-vanilla flex w-full items-center border bg-blue-400 px-5 py-3.5 font-medium text-slate-800 duration-150 hover:bg-blue-500 dark:bg-white sm:w-auto sm:text-base"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={21}
                  height={21}
                  viewBox="0 0 21 21"
                  className="mr-3.5 h-5 w-5"
                  fill="none"
                >
                  <path
                    d="M10.3238 4.22336C11.7572 4.22248 13.1446 4.729 14.2402 5.65318L17.3091 2.73066C16.131 1.64437 14.716 0.847624 13.1763 0.403645C11.6365 -0.0403328 10.0145 -0.119321 8.4389 0.172951C6.86332 0.465222 5.37754 1.12071 4.09948 2.08739C2.82142 3.05406 1.78627 4.30533 1.07617 5.74187L4.53599 8.40865C4.93949 7.19191 5.71559 6.13296 6.75435 5.38181C7.79312 4.63065 9.04189 4.22537 10.3238 4.22336Z"
                    fill="#D94F3D"
                  />
                  <path
                    d="M4.22329 10.3237C4.22416 9.67271 4.32968 9.02611 4.53582 8.40865L1.076 5.74187C0.368293 7.16554 0 8.7338 0 10.3237C0 11.9136 0.368293 13.4818 1.076 14.9055L4.53582 12.2387C4.32968 11.6212 4.22416 10.9746 4.22329 10.3237Z"
                    fill="#F2C042"
                  />
                  <path
                    d="M20.2245 8.44666H10.3701V12.67H15.9543C15.6221 13.8641 14.861 14.8937 13.8168 15.5615L17.2499 18.2081C19.4436 16.2391 20.7327 13.0374 20.2245 8.44666Z"
                    fill="#5085ED"
                  />
                  <path
                    d="M13.816 15.5615C12.755 16.1688 11.5455 16.4675 10.3238 16.424C9.04189 16.422 7.79312 16.0167 6.75435 15.2655C5.71559 14.5144 4.93949 13.4554 4.53599 12.2387L1.07617 14.9055C1.93075 16.6282 3.24904 18.0782 4.88275 19.0926C6.51646 20.107 8.40079 20.6454 10.3238 20.6473C12.8542 20.716 15.3207 19.847 17.2491 18.2072L13.816 15.5615Z"
                    fill="#57A75C"
                  />
                </svg>
                Sign in with Google
              </button>
            </li>
          )}
        </ul>
      </div>
    </header>
  );
}
