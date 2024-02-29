"use client";
import { Fragment, useCallback, useEffect, useRef } from "react";
import GeneratedImageCard from "./GeneratedImageCard";
import { useFormState } from "react-dom";
import { useCreationStore, useStore } from "@/store";
import { useToast } from "./ui/use-toast";
import { ToastAction } from "./ui/toast";
import { WaitAlert } from "./WaitAlert";
import { CreationFormInputs } from "./CreationFormInputs";
import { Creation } from "@/interface";
import {
    generateImageRequestToAIService,
    getCreationUrl,
    getImageGeneratedAtAIModelById,
    saveImageAndPrompt,
    uploadToCloudinary,
} from "@/actions/generate-image-2";
import { CreationFormError, sleep } from "@/utils";

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

    interface generateImageResponse extends Creation {
        generated: boolean;
    }
    const handleSubmit = async (
        prevState: any,
        formData: FormData
    ): Promise<generateImageResponse> => {
        try {
            const { id } = await generateImageRequestToAIService(formData);
            await sleep(5000);
            let retry = true;
            let tempUrlImage = "";
            let aiResponse:
                | {
                      url_image: string;
                      result: true;
                  }
                | {
                      result: false;
                      errMsg?: string | undefined;
                  };
            while (retry) {
                aiResponse = await getImageGeneratedAtAIModelById(id);
                if (aiResponse.result === false) {
                    if (aiResponse.errMsg) {
                        retry = false;
                        throw new CreationFormError("Missing path config.");
                    } else {
                        await sleep(1000);
                    }
                } else {
                    tempUrlImage = aiResponse.url_image;
                    retry = false;
                }
            }

            if (!tempUrlImage) {
                throw new CreationFormError("Missing path config.");
            }

            const uploadedImage = await uploadToCloudinary(tempUrlImage);
            const prompt = formData.get("prompt")?.toString() ?? "";
            const creationId = await saveImageAndPrompt(uploadedImage, prompt);
            if (!creationId) {
                throw new CreationFormError("Missing path config.");
            }
            const url = await getCreationUrl(creationId);
            if (!url) {
                throw new CreationFormError("Missing path config.");
            }
            return new Promise<generateImageResponse>((resolve) => {
                resolve({
                    generated: true,
                    urlImage: uploadedImage,
                    prompt,
                    id: creationId,
                    url: url,
                });
            });
        } catch (error) {
            if (error instanceof CreationFormError) {
                console.error(error.message);
            }
            console.log(error);
            return new Promise<generateImageResponse>((resolve) => {
                resolve({
                    generated: false,
                    urlImage: "",
                    prompt: "",
                    id: "",
                    url: "",
                });
            });
        }
    };

    const [state, formAction] = useFormState(handleSubmit, null);
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
            <form
                ref={ref}
                data-test={"creation-form"}
                action={formAction}
                className="w-full "
            >
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
