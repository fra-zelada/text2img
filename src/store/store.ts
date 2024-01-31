import { Creation } from "@/interface";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Store = {
    currentCreation: Creation | null;
    prevCreations: Creation[];
    addCreation: (creation: Creation) => void;
    getLastsCreations: () => Creation[];
    cleanCurrent: () => void;
};

export const useCreationStore = create<Store>()(
    persist(
        (set, get) => ({
            prevCreations: [],
            currentCreation: null,
            addCreation: ({ prompt, urlImage, id, url }) =>
                set((state) => {
                    const exists = state.prevCreations.some(
                        (prev) => prev.urlImage === urlImage
                    );
                    if (!exists)
                        return {
                            currentCreation: { prompt, urlImage, id, url },
                            prevCreations: [
                                { prompt, urlImage, id, url },
                                ...state.prevCreations,
                            ],
                        };
                    return state;
                }),
            cleanCurrent: () =>
                set((state) => {
                    return { currentCreation: null };
                }),
            getLastsCreations: () => {
                if (!!get().currentCreation) {
                    const [_, ...rest] = get().prevCreations;
                    return rest;
                }
                return [...get().prevCreations];
            },
        }),
        {
            name: "creations-storage",
        }
    )
);
