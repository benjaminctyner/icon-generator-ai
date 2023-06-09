import Link from "next/link";
import { PrimaryLink } from "./PrimaryLInk";
import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { Button } from "./Button";
import { useBuyCredits } from "~/hooks/useBuyCredits";

export function Header() {
  const session = useSession();
  const isLoggedin = !!session.data;
  const { buyCredits } = useBuyCredits();

  return (
    <header className="container  mx-auto flex h-16 items-center justify-between bg-gray-800 px-4 ">
      <PrimaryLink href="/">Icon Generator</PrimaryLink>
      <ul>
        <li>
          <PrimaryLink href="/generate">Generate</PrimaryLink>
        </li>
      </ul>
      <ul className="flex gap-4">
        {isLoggedin ? (
          <>
            <li>
              <>
                <Button
                  onClick={() => {
                    buyCredits().catch(console.error);
                  }}
                >
                  Buy Credits
                </Button>
              </>
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
        ) : (
          <li>
            <Button
              onClick={() => {
                signIn().catch(console.error);
              }}
            >
              Login
            </Button>
          </li>
        )}
      </ul>
    </header>
  );
}
