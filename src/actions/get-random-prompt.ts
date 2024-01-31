"use client";

import DATA from "@/data/prompts.json";

const randomValue = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRandomPrompt = (): Promise<{
    prompt: string;
}> => {
    const randomIndex = randomValue(0, DATA.length - 1);
    const selectedPrompt = DATA[randomIndex];

    if (selectedPrompt) {
        return Promise.resolve(selectedPrompt);
    } else {
        return Promise.reject(new Error("Error al obtener el prompt."));
    }
};
