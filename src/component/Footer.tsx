import { PrimaryLink } from "./PrimaryLInk";

export function Footer() {
  return (
    <footer className=" dark:bg-gray-900">
      <div className="container mx-auto grid h-24 w-full grid-cols-2 items-center bg-gray-900 text-center">
        <PrimaryLink className="text-white" href="/">
          icons.ben-t.dev
        </PrimaryLink>
        <PrimaryLink className="text-white" href="/privacyPolicy">
          Privacy Policy
        </PrimaryLink>
      </div>
    </footer>
  );
}
