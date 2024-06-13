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
        if (prompt) {
            setPromptInputValue(prompt);
        }
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
                className=" text-violet-950 form_animation text-xl font-semibold p-2 px-4 w-full bg-white/50 outline-none rounded-full mt-2 focus:bg-white/70  relative z-50 mx-auto"
                readOnly={pending}
                value={promptInputValue}
                id=""
                onChange={handleInputChange}
                onReset={() => setPromptInputValue("")}
            />
            <div className="form_animation flex flex-row justify-between gap-5 my-1 mt-2 md:mt-3 md:mb-3 mx-2 md:mx-0">
                <button
                    className={`  bg-gradient-to-b font-bold tracking-wider from-blue-700 to-blue-900 text-white  w-full text-lg md:text-2xl px-2 py-1 md:py-3 transition-colors rounded-full ${
                        !pending && "hover:from-blue-500 hover:to-blue-700"
                    }   disabled:cursor-not-allowed `}
                    type="submit"
                    disabled={pending || promptInputValue.trim().length === 0}
                >
                    Generate
                </button>
                <button
                    className={`form_animation bg-gradient-to-b font-bold tracking-wider from-yellow-500/30 to-yellow-700/30 text-yellow-100   w-full text-lg md:text-2xl  px-2  py-1 md:py-3 rounded-full ${
                        !pending &&
                        "hover:from-yellow-500/50 hover:to-yellow-300/50 hover:text-yellow-50"
                    }  transition-colors disabled:cursor-not-allowed`}
                    type="button"
                    disabled={pending}
                    onClick={handlingGetRandomPrompt}
                >
                    Random Prompt
                </button>
            </div>
        </Fragment>
    );
};
