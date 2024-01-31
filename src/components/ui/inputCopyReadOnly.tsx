"use client";
import { Link2Icon } from "@radix-ui/react-icons";
import { Tooltip } from "./tooltip";

export const InputCopyReadOnly = ({ text }: { text: string }) => {
    return (
        <Tooltip content="Copied">
            <div className=" flex items-center max-w-md mx-auto bg-white border border-1 border-r-0 border-cyan-500 rounded-lg  ">
                <input
                    type="text"
                    className="w-full px-4 py-1 text-gray-800 rounded-full focus:outline-none"
                    readOnly
                    value={text}
                    onClick={() => navigator.clipboard.writeText(`${text}`)}
                />
                <div className="">
                    <button
                        type="button"
                        className="flex items-center bg-blue-500 justify-center w-12 h-12 text-white rounded-r-lg "
                        onClick={() => navigator.clipboard.writeText(`${text}`)}
                    >
                        <Link2Icon className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </Tooltip>
    );
};
