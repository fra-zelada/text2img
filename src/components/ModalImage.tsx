"use client";
import { Dialog, DialogContent } from "./ui/dialog";
import { InputCopyReadOnly } from "./ui/inputCopyReadOnly";

interface Props {
    onClose: () => Promise<unknown>;
    showModal: boolean;
    urlImage: string;
    prompt: string;
    url: string;
}

export function ModalImage({
    onClose,
    showModal = false,
    urlImage,
    prompt,
    url,
}: Props) {
    return (
        <div className="z-50">
            <Dialog
                modal
                open={showModal}
                onOpenChange={() => onClose()}
                defaultOpen={showModal}
            >
                <DialogContent className="">
                    <div className="flex flex-col justify-center items-center">
                        <picture>
                            <img src={urlImage} alt={prompt} />
                        </picture>
                        <p className="text-black font-semibold text-lg uppercase text-right leading-10 tracking-tighter">
                            {prompt}
                        </p>
                        <InputCopyReadOnly text={url} />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
