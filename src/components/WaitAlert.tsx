import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LapTimerIcon } from "@radix-ui/react-icons";
import { useFormStatus } from "react-dom";
export const WaitAlert = () => {
    const status = useFormStatus();

    return (
        <div
            id="alert-wait-container"
            className={`  ${
                status.pending ? "show-custom" : "hide-custom max-h-[0px]"
            } `}
        >
            <Alert
                className={`animate-rotate-x animate-thrice  animate-duration-[1000ms] animate-delay-[2000ms] ${
                    status.pending ? "opacity-100" : "opacity-0"
                }  transition-opacity transition-delay`}
            >
                <LapTimerIcon className="h-4 w-4 animate-ping" />
                <AlertTitle>Heads up!</AlertTitle>
                <AlertDescription>
                    It can take a few seconds...
                </AlertDescription>
            </Alert>
        </div>
    );
};
