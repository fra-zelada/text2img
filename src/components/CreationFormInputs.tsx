import { ChangeEvent, Fragment, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { getRandomPrompt } from "@/actions";

export const CreationFormInputs = () => {
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const maxLength = 120;
        let inputValue = event.target.value;

        if (inputValue.length > maxLength) {
            inputValue = inputValue.slice(0, maxLength);
        }
        setPromptInputValue(inputValue);
    };

    const handlingGetRandomPrompt = async () => {
        const { prompt } = await getRandomPrompt();
        if (prompt) setPromptInputValue(prompt);
    };

    const { pending } = useFormStatus();
    const [promptInputValue, setPromptInputValue] = useState<string>("");

    useEffect(() => {
        if (!pending) {
            setPromptInputValue("");
        }
    }, [pending]);

    return (
        <Fragment>
            <input
                type="text"
                name="prompt"
                className="text-black text-xl font-semibold p-2 px-4 w-full rounded-full mt-2 active:bg-white relative z-50 mx-auto"
                readOnly={pending}
                value={promptInputValue}
                id=""
                onChange={handleInputChange}
                onReset={() => setPromptInputValue("")}
            />
            <div className="flex flex-row justify-between gap-5 my-1 mt-2 md:mt-3 md:mb-3 mx-2 md:mx-0">
                <button
                    className={` bg-gradient-to-b from-yellow-500 to-yellow-700 text-black font-semibold w-full text-lg md:text-2xl  px-2  py-1 md:py-3 rounded-full ${
                        !pending && "hover:from-yellow-500 hover:to-yellow-300"
                    }  transition-colors disabled:cursor-not-allowed`}
                    type="button"
                    disabled={pending}
                    onClick={handlingGetRandomPrompt}
                >
                    Random Prompt
                </button>

                <button
                    className={`  bg-gradient-to-b from-blue-700 to-blue-900 text-white font-semibold w-full text-lg md:text-2xl px-2 py-1 md:py-3 rounded-full ${
                        !pending && "hover:from-blue-500 hover:to-blue-700"
                    }  transition-colors disabled:cursor-not-allowed `}
                    type="submit"
                    disabled={pending || promptInputValue.trim().length === 0}
                >
                    Generate
                </button>
            </div>
        </Fragment>
    );
};
