import React, { useState } from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import "./tooltip.css"; // Importa tu archivo de estilos

export function Tooltip({
    children,
    content,
    ...props
}: {
    children?: React.ReactNode;
    content: string;
}) {
    const [tooltipOpen, setTooltipOpen] = useState(false);

    const handleButtonClick = () => {
        setTooltipOpen((prevOpen) => !prevOpen);
        setTimeout(() => {
            setTooltipOpen((prevOpen) => !prevOpen);
        }, 2000);
    };

    return (
        <TooltipPrimitive.Provider>
            <TooltipPrimitive.Root open={tooltipOpen} delayDuration={0}>
                <TooltipPrimitive.Trigger asChild>
                    <span onClick={handleButtonClick}>{children}</span>
                </TooltipPrimitive.Trigger>
                <TooltipPrimitive.Content
                    side="top"
                    align="center"
                    className={`TooltipContent ${
                        tooltipOpen ? "fadeIn" : "fadeOut"
                    }`}
                >
                    {content}
                    <TooltipPrimitive.Arrow width={11} height={5} />
                </TooltipPrimitive.Content>
            </TooltipPrimitive.Root>
        </TooltipPrimitive.Provider>
    );
}
