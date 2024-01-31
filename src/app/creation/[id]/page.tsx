import { getCreationById } from "@/actions/get-creations-from-db";
import { Metadata, ResolvingMetadata } from "next";

import NextLink from "next/link";
import { redirect } from "next/navigation";

interface Props {
    params: {
        id: string;
    };
}

export async function generateMetadata(
    { params }: Props,
    _parent: ResolvingMetadata
): Promise<Metadata> {
    // read route params
    const id = params.id;
    // fetch data
    const resp = await getCreationById(id);

    return {
        title: resp?.prompt
            ? `Text2Img | ${resp.prompt}`
            : "Text2Img | Not found",
        description: resp?.prompt ?? "",
        openGraph: {
            title: resp?.prompt
                ? `Text2Img | ${resp.prompt}`
                : "Text2Img | Not found",
            description: resp?.prompt ?? "",
            images: resp?.urlImage ? [resp.urlImage] : [],
        },
    };
}

export default async function CreationPage({ params }: Props) {
    const resp = await getCreationById(params.id);

    if (!resp) redirect("/");

    return (
        <main className="mx-auto w-full text-white">
            <div className="  bg-gradient-to-b from-orange-400 to-orange-600     to-b shadow-2xl rounded-lg mx-auto text-center py-12 mt-0">
                <h1 className=" title-make-creation font-raleway text-5xl  leading-9 font-black  tracking-tight text-white md:text-6xl md:leading-10 md:tracking-tighter  ">
                    Make your own creation
                </h1>
                <div className="mt-8 flex justify-center">
                    <div className="inline-flex rounded-md bg-white shadow hover:bg-slate-100 transition-colors">
                        <NextLink
                            href="/"
                            className="text-gray-700 font-bold py-2 px-6 "
                        >
                            Start
                        </NextLink>
                    </div>
                </div>
            </div>
            <article
                className="mx-auto max-w-[580px] flex flex-col mt-0  bg-white p-5
w-full   "
            >
                <div className=" aspect-square  bg-gray-300 w-full shadow-slate-600 shadow-lg ">
                    <picture>
                        <img src={resp?.urlImage} alt="" className="w-full" />
                    </picture>
                </div>
                <div className="grid items-center py-4 px-6">
                    <p className=" self-center font-bold text-lg uppercase text-center text-black mt-1">
                        {resp?.prompt}
                    </p>
                </div>
            </article>
        </main>
    );
}
