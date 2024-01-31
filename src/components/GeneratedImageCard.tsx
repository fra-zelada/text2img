"use client";
import { useFormStatus } from "react-dom";

import { InputCopyReadOnly } from "./ui/inputCopyReadOnly";

type Props = {
    generated?: boolean;
    urlImage?: string;
    prompt?: string;
    id?: string;
    url?: string;
};

const GeneratedImageCard = ({
    generated,
    urlImage,
    prompt,
    id,
    url,
}: Props) => {
    const { pending } = useFormStatus();

    return pending ? (
        <article
            className="mx-auto flex flex-col mt-0  bg-white p-5
            w-full
         animate-fade-down transition-transform "
        >
            <div className=" rounded overflow-hidden shadow-lg animate-pulse ">
                <div className=" aspect-square bg-gray-300 shadow-slate-600 shadow-lg"></div>
                <div className="px-6 py-4">
                    <div className="h-8 bg-gray-300 mt-1"></div>
                </div>
                <div className="px-20 py-1">
                    <div className="h-10 bg-gray-300 mt-1 rounded-lg"></div>
                </div>
            </div>
        </article>
    ) : (
        generated && (
            <article
                className="mx-auto flex flex-col mt-0  bg-white p-5
            w-full   "
            >
                <div className=" aspect-square  bg-gray-300 w-full shadow-slate-600 shadow-lg ">
                    <picture>
                        <img src={urlImage} alt="" className="w-full" />
                    </picture>
                </div>
                <div className="grid items-center py-4 px-6">
                    <p className=" self-center font-bold text-lg uppercase text-center text-black mt-1">
                        {prompt}
                    </p>
                </div>
                <div className="grid items-center py-1 px-6">
                    <div className="flex justify-center items-center">
                        <InputCopyReadOnly text={url!} />
                    </div>
                </div>
            </article>
        )
    );
};

export default GeneratedImageCard;
