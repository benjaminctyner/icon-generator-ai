import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Button } from "~/component/Button";
import { PrimaryLinkButton } from "~/component/PrimaryLInkButton";
import { api } from "~/utils/api";

function HeroBanner() {
  return (
    <section className="mb-24 mt-24 grid grid-cols-1 gap-12 px-8 sm:grid-cols-2">
      <div className="flex flex-col gap-4">
        <h1 className="text-6xl">Generate icons with a click of a button!</h1>
        <p className="text-2xl">
          Use AI to generate icons, instead of paying a designer and waiting for
          them to do it for you.
        </p>
        <PrimaryLinkButton href="/generate" className="self-start">
          gen
        </PrimaryLinkButton>
      </div>

      <Image
        src={"/landing-banner.png"}
        alt="image of nice looking icons"
        height="300"
        width={"400"}
        className="order-first sm:-order-none"
      />
    </section>
  );
}

const HomePage: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>AI Icon Generator</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container mx-auto flex  flex-col items-center justify-center ">
        <HeroBanner />
      </main>
    </>
  );
};

export default HomePage;
