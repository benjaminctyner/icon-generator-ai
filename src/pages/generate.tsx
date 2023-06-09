/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { Button } from "~/component/Button";
import { FormGroup } from "~/component/FormGroup";
import { Input } from "~/component/Input";
import { api } from "~/utils/api";
import { Spinner } from "../component/Spinner";

const colors = [
  "Blue",
  "Red",
  "Purple",
  "Green",
  "Orange",
  "Yellow",
  "White",
  "Black",
];

const shapes = ["Square", "Circle", "Rounded"];

const styles = ["Claymorphic", "3D Rendered", "Pixelated", "Illustrated"];

const GeneratePage: NextPage = () => {
  const [form, setForm] = useState({
    prompt: "",
    color: "",
    shape: "",
    style: "",
    numberOfIcons: "1",
  });
  const [error, setError] = useState("");
  const [imagesUrl, setImagesUrl] = useState<{ imageUrl: string }[]>([]);

  const generateIcon = api.generate.generateIcon.useMutation({
    onSuccess(data) {
      setImagesUrl(data);
    },
    onError(error) {
      setError(error.message);
    },
  });

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    generateIcon.mutate({
      ...form,
      numberOfIcons: parseInt(form.numberOfIcons) ?? 1,
    });
  }

  function updateForm(key: string) {
    return function (e: React.ChangeEvent<HTMLInputElement>) {
      setForm((prev) => ({
        ...prev,
        [key]: e.target.value,
      }));
    };
  }

  return (
    <>
      <Head>
        <title>Generate Icons</title>
        <meta name="Generate" content="Generate Icons With AI" />
        <link rel="icon" href="/icon-logo.png" />
      </Head>
      <main className="container mx-auto mt-24 flex min-h-screen flex-col gap-4 px-8 sm:grid-cols-1">
        <h1 className="text-6xl">Generate your icons</h1>
        <p className="mb-12 text-2xl">
          Fill out the form below to start generating your icons.
        </p>
        <form className="flex flex-col gap-4" onSubmit={handleFormSubmit}>
          <h2 className="text-xl">
            1. Describe what you would like your icons to look like.
          </h2>
          <FormGroup className="mb-12">
            <label>Prompt</label>
            <Input
              required
              value={form.prompt}
              onChange={updateForm("prompt")}
            ></Input>
          </FormGroup>

          <h2 className="text-xl">2. Pick your icon color.</h2>
          <FormGroup className="mb-12 grid min-[300px]:grid-cols-1 md:grid-cols-4 ">
            {colors.map((color) => (
              <label key={color} className="flex gap-2 text-2xl">
                <input
                  required
                  type="radio"
                  name="color"
                  checked={color === form.color}
                  onChange={() => setForm((prev) => ({ ...prev, color }))}
                ></input>
                {color}
              </label>
            ))}
          </FormGroup>

          <h2 className="text-xl">3. Pick your icon shape.</h2>
          <FormGroup className="mb-12 grid grid-cols-4 min-[300px]:grid-cols-1 md:grid-cols-4">
            {shapes.map((shape) => (
              <label key={shape} className="flex gap-2 text-2xl">
                <input
                  required
                  type="radio"
                  name="shape"
                  checked={shape === form.shape}
                  onChange={() => setForm((prev) => ({ ...prev, shape }))}
                ></input>
                {shape}
              </label>
            ))}
          </FormGroup>

          <h2 className="text-xl">4. Pick your icon style.</h2>
          <FormGroup className="mb-12 grid grid-cols-4 min-[300px]:grid-cols-1 md:grid-cols-4">
            {styles.map((style) => (
              <label key={style} className="flex items-center gap-2 text-2xl">
                <input
                  required
                  type="radio"
                  name="style"
                  checked={style === form.style}
                  onChange={() => setForm((prev) => ({ ...prev, style }))}
                ></input>
                {style}
              </label>
            ))}
          </FormGroup>

          <h2 className="text-xl">5. How many would you like? (Max 10)</h2>
          <FormGroup className="mb-12">
            <label>Number of icons</label>
            <Input
              inputMode="numeric"
              pattern="[1-9]|10"
              value={form.numberOfIcons}
              required
              onChange={updateForm("numberOfIcons")}
            ></Input>
          </FormGroup>

          {error && (
            <div className="rounded bg-red-500 p-8 text-xl text-white">
              {error}
            </div>
          )}
          {!generateIcon.isLoading && (
            <button className=" mx-auto mb-8 mt-0 w-[250px] flex-col items-center justify-center gap-2 rounded bg-blue-400 px-4 py-2  hover:bg-blue-500 disabled:bg-gray-600">
              Submit
            </button>
          )}

          {generateIcon.isLoading && (
            <div className=" mx-auto mb-8 mt-0  flex-col items-center justify-center ">
              <Spinner />
            </div>
          )}
        </form>

        {imagesUrl.length > 0 && (
          <>
            <h2 className="text-xl">Your Icons</h2>
            <section className="mb-12 grid grid-cols-4  gap-4">
              {imagesUrl.map(({ imageUrl }) => (
                <Image
                  key={imageUrl}
                  src={imageUrl}
                  alt="an image of your generated prompt"
                  width="512"
                  height="512"
                  className="w-full"
                />
              ))}
            </section>
          </>
        )}
      </main>
    </>
  );
};

export default GeneratePage;
