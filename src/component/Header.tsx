import Link from "next/link";
import { PrimaryLink } from "./PrimaryLInk";
import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { Button } from "./Button";
import { useBuyCredits } from "~/hooks/useBuyCredits";
import { api } from "~/utils/api";

export function Header() {
  const session = useSession();
  const isLoggedin = !!session.data;
  const { buyCredits } = useBuyCredits();
  const credits = api.user.getCredits.useQuery();

  return (
    <header className="container  mx-auto flex h-16 items-center justify-between bg-gray-800 px-4 ">
      <PrimaryLink href="/">Icon Generator</PrimaryLink>
      <ul>
        <li>
          <PrimaryLink href="/generate">Generate</PrimaryLink>
        </li>
        {isLoggedin && (
          <li>
            <PrimaryLink className="flex gap-4" href="/collection">
              Collection
            </PrimaryLink>
          </li>
        )}
        <li>
          <PrimaryLink className="flex gap-4" href="/community">
            Community
          </PrimaryLink>
        </li>
      </ul>
      <ul className="flex items-center gap-4">
        {isLoggedin ? (
          <>
            Credits Remaining {credits.data}
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
