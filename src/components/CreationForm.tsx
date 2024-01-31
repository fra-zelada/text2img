"use client";
import {
    ChangeEvent,
    ChangeEventHandler,
    Fragment,
    useCallback,
    useEffect,
    useRef,
} from "react";
import GeneratedImageCard from "./GeneratedImageCard";
import { useFormState } from "react-dom";
import { generateImage } from "@/actions";
import { useCreationStore, useStore } from "@/store";
import { useToast } from "./ui/use-toast";
import { ToastAction } from "./ui/toast";
import { WaitAlert } from "./WaitAlert";
import { CreationFormInputs } from "./CreationFormInputs";

export const CreationForm = () => {
    const creationsState = useStore(useCreationStore, (state) => state);

    const ref = useRef<HTMLFormElement>(null);
    const { toast } = useToast();

    const showToastError = useCallback(() => {
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "There was a problem your creation.",
            action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
    }, [toast]);

    const [state, formAction] = useFormState(generateImage, null);
    useEffect(() => {
        if (state?.generated === true) {
            ref.current?.reset();
            creationsState?.addCreation({
                prompt: state.prompt,
                urlImage: state.urlImage,
                id: state.id,
                url: state.url,
            });
        } else if (
            state?.generated === false &&
            creationsState?.currentCreation
        ) {
            creationsState.cleanCurrent();
        }
    }, [creationsState, state]);

    useEffect(() => {
        if (state?.generated == false) {
            showToastError();
        }
    }, [showToastError, state?.generated]);

    return (
        <Fragment>
            <form ref={ref} action={formAction} className="w-full ">
                <CreationFormInputs />
                <div className="w-full transition-all flex flex-col px-2 md:px-0">
                    <WaitAlert />
                    <GeneratedImageCard
                        generated={state?.generated}
                        urlImage={state?.urlImage}
                        prompt={state?.prompt}
                        id={state?.id}
                        url={state?.url}
                    />
                </div>
            </form>
        </Fragment>
    );
};
