"use client";
import { useState } from "react";
import { ModalImage } from "./ModalImage";

type item = { item: { urlImage: string; prompt: string; url: string } };

export const GalleryItem = ({ item }: item) => {
    const [open, setOpen] = useState<boolean>(false);

    const closeModal = async () => {
        setTimeout(() => {
            setOpen(false);
        }, 1);
    };

    return (
        <div
            key={item.urlImage}
            className="flex flex-row justify-between p-2 bg-white rounded shadow-md shadow-slate-900
        hover:-translate-y-1 transition-transform hover:shadow-xl hover:shadow-slate-950 hover:cursor-pointer animate-fade-down "
            onClick={() => setOpen(true)}
        >
            <div className="bg-slate-400 h-28 md:h-44 w-28 md:w-44 shadow-lg shadow-slate-600 rounded-xl aspect-square">
                <picture>
                    <img
                        src={item.urlImage}
                        alt=""
                        className="h-28 md:h-44 rounded-xl "
                    />
                </picture>
            </div>
            <p className="text-black font-semibold text-lg uppercase text-right leading-10 tracking-tighter ml-1 md:ml-2">
                {item.prompt}
            </p>
            {open && (
                <ModalImage
                    key={item.urlImage}
                    onClose={closeModal}
                    showModal={open}
                    urlImage={item.urlImage}
                    prompt={item.prompt}
                    url={item.url}
                />
            )}
        </div>
    );
};
