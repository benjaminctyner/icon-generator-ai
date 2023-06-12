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
    <section className="mb-24 mt-12 grid grid-cols-1 gap-12 px-8 sm:mt-24 sm:grid-cols-2">
      <div className="flex flex-col gap-4">
        <h1 className="text-6xl">Generate icons with a click of a button.</h1>
        <p className="text-2xl">
          Use AI to generate icons in seconds instead of paying a designer and
          waisting time. Login to get started!
        </p>
        <PrimaryLinkButton href="/generate" className="self-start">
          Generated your Icons
        </PrimaryLinkButton>
      </div>
      <Image
        src="/landing-banner.png"
        alt="an image of a bunch of nice looking icons"
        width="400"
        height="300"
        className="order-first sm:-order-none"
      />
    </section>
  );
}

const HomePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>AI Icon Generator</title>
        <meta name="AI Icon Generator App" content="AI Icon Generator App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container mx-auto flex min-h-screen flex-col">
        <HeroBanner />
      </main>
    </>
  );
};

export default HomePage;
