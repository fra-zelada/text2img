"use client";
import { useCreationStore, useStore } from "@/store";
import React, { useEffect, useState } from "react";
import { GalleryItem } from "./GalleryItem";

export const PreviousCreations = () => {
    const creationsState = useStore(useCreationStore, (state) => state);
    const [firstRender, setFirstRender] = useState(false);
    const [creations, setCreations] = useState<
        {
            urlImage: string;
            prompt: string;
            url: string;
        }[]
    >([]);

    useEffect(() => {
        if (firstRender) {
            creationsState?.cleanCurrent();
            setFirstRender(false);
        }
        const lastCreations = creationsState?.getLastsCreations();
        if (lastCreations) setCreations(lastCreations);
    }, [creationsState, firstRender]);

    useEffect(() => {
        setFirstRender(true);
    }, []);

    return (
        <React.Fragment>
            {creations.map((prevImage) => {
                return (
                    <GalleryItem
                        key={prevImage.urlImage}
                        item={{
                            prompt: prevImage.prompt,
                            urlImage: prevImage.urlImage,
                            url: prevImage.url,
                        }}
                    />
                );
            })}
        </React.Fragment>
    );
};
