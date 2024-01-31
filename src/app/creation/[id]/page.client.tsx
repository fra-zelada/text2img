"use client";
import { Tooltip } from "@/components/ui/tooltip";

interface Props {
    url: string;
}

export const PageCreationClient = ({ url }: Props) => {
    return (
        <Tooltip content="Copied">
            <input
                type="text"
                readOnly
                value={`${url}`}
                onClick={() => navigator.clipboard.writeText(`${url}`)}
                autoFocus={false}
                className="rounded-lg p-2 text-black  outline outline-black"
            />
        </Tooltip>
    );
};
