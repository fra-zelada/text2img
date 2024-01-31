import { CreationForm, PreviousCreations } from "@/components";
import { Metadata } from "next";

interface Props {
    params: {
        saludo: string;
    };
    searchParams?: { [key: string]: string | string[] | undefined };
}
export const metadata: Metadata = {
    title: "Text2Img | Create your images with AI",
    description:
        "Another AI web application to create images, but it is completely free!",
    keywords: ["ai image generator", "images ai"],
};
export default async function HomePage({}: Props) {
    return (
        <main className="flex flex-grow flex-col items-center  pb-6  text-white">
            <h1 className=" title-custom with-after text-6xl md:text-9xl   mt-2">
                Text 2 Img
            </h1>
            <h2 className="text-xl md:text-3xl font-semibold mt-1 leading-10 tracking-tighter z-10">
                Let your imagination flow
            </h2>

            <div className="flex mt-1 w-full justify-center">
                <section className="md:max-w-[500px] w-full">
                    <article>
                        <CreationForm />
                    </article>
                    <article className="flex flex-col gap-2 mt-2 px-2 md:px-0">
                        <PreviousCreations />
                    </article>
                </section>
            </div>
        </main>
    );
}
