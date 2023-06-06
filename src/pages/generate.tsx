import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";

import Head from "next/head";
import { useState } from "react";
import { FormGroup } from "~/component/FormGroup";
import { Button } from "~/component/Button";
import { Input } from "~/component/Input";
import { api } from "~/utils/api";

const GeneratePage: NextPage = () => {
  const [form, setForm] = useState({ prompt: "" });
  const [imageUrl, setImageUrl] = useState("");

  const generateIcon = api.generate.generateIcon.useMutation({
    onSuccess(data) {
      console.log("mutation succes", data.imageUrl);
      if (!data.imageUrl) {
        return;
      }
      setImageUrl(data.imageUrl);
    },
  });

  const session = useSession();

  const isLoggedin = !!session.data;

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    //todo submit form to backend
    generateIcon.mutate({
      prompt: form.prompt,
    });
  }

  function updateForm(key: string) {
    return function (e: React.ChangeEvent<HTMLImageElement>) {
      setForm((prev) => ({
        ...prev,
        [key]: e.target.value,
      }));
    };
  }

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center">
        {!isLoggedin && (
          <Button
            onClick={() => {
              signIn().catch(console.error);
            }}
          >
            Login
          </Button>
        )}
        {isLoggedin && (
          <Button
            onClick={() => {
              signOut().catch(console.error);
            }}
          >
            Logout
          </Button>
        )}
        {session.data?.user.name}

        <form
          className="gap gap flex flex-col gap-4"
          onSubmit={handleFormSubmit}
        >
          <FormGroup>
            <label>Prompt</label>
            <Input value={form.prompt} onChange={updateForm("prompt")}></Input>
          </FormGroup>
          <Button className="rounded bg-blue-400 px-4 py-2 hover:bg-blue-500">
            Submit
          </Button>
        </form>
        <img src={imageUrl} />
      </main>
    </>
  );
};

export default GeneratePage;
