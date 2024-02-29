"use server";

import { ActionError } from "../utils";
import { createClient } from "@vercel/kv";
import { v4 as uuidv4 } from "uuid";

export const generateImageRequestToAIService = async (
    formData: FormData
): Promise<{ id: string }> => {
    const prompt = formData.get("prompt")?.toString() ?? "";

    try {
        if (prompt.trim().length === 0)
            throw new ActionError("Missing prompt...");
        if (prompt.trim().length > 120)
            throw new ActionError("The prompt max length is 120 chars...");
        const API_URL = process.env.REPLICATE_API ?? "";
        const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN ?? "";
        if (API_URL == "" || REPLICATE_API_TOKEN == "")
            throw new ActionError("Missing API Config");

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                Authorization: `Token ${REPLICATE_API_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                version:
                    "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",

                input: {
                    prompt,
                    width: 768,
                    height: 768,
                    refine: "expert_ensemble_refiner",
                    scheduler: "K_EULER",
                    lora_scale: 0.6,
                    num_outputs: 1,
                    guidance_scale: 7.5,
                    apply_watermark: false,
                    high_noise_frac: 0.8,
                    negative_prompt: "",
                    prompt_strength: 0.8,
                    num_inference_steps: 25,
                },
            }),
        });
        if (response.status !== 201) {
            console.log(await response.json());
            throw new ActionError("Response status error");
        }
        const { id } = await response.json();
        if (!id || id == "")
            throw new ActionError("The service does not retrieve a valid ID");
        return { id };
    } catch (error) {
        if (error instanceof ActionError) {
            console.error(error.message);
        }
        return { id: "" };
    }
};

export const getImageGeneratedAtAIModelById = async (
    id: string
): Promise<
    { url_image: string; result: true } | { result: false; errMsg?: string }
> => {
    const STATUS = {
        succeeded: "succeeded",
        failed: "failed",
        canceled: "canceled",
        processing: "processing",
        starting: "starting",
    };

    try {
        const API_URL = process.env.REPLICATE_API ?? "";
        const TOKEN = process.env.REPLICATE_API_TOKEN ?? "";
        if (API_URL == "" || TOKEN == "")
            throw new ActionError("Missing API Config");

        const response = await fetch(`${API_URL}/${id}`, {
            headers: {
                Authorization: `Token ${TOKEN}`,
                "Content-Type": "application/json",
            },
            cache: "no-cache",
        });
        if (response.status !== 200) {
            return { result: false, errMsg: "Api Error" };
        }

        const prediction = await response.json();
        if (prediction.status == STATUS.succeeded) {
            if (prediction.output[0])
                return { result: true, url_image: prediction.output[0] };
            else throw new ActionError("Unable to get Img at the request");
        } else if (
            prediction.status == STATUS.processing ||
            prediction.status == STATUS.starting
        ) {
            return { result: false };
        } else if (
            prediction.status == STATUS.failed ||
            prediction.status == STATUS.canceled
        ) {
            throw new ActionError("Creation status failed or canceled");
        } else {
            throw new ActionError("Unhandled Error");
        }
    } catch (error) {
        if (error instanceof ActionError) {
            console.error(error.message);
            return { result: false, errMsg: error.message ?? "Error" };
        }
        return { result: false, errMsg: "Unknow error" };
    }
};

export const uploadToCloudinary = async (file_url: string) => {
    const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME ?? "";
    const UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET ?? "";

    const data = {
        file: file_url,
        upload_preset: UPLOAD_PRESET,
    };

    try {
        const resp = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload?folder=${UPLOAD_PRESET}`,
            {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "POST",
                cache: "no-cache",
                body: JSON.stringify(data),
            }
        ).then((res) => res.json() as Promise<{ secure_url: string }>);

        return resp.secure_url ?? "";
    } catch (error) {
        console.error(error);
        return "";
    }
};

export const saveImageAndPrompt = async (urlImage: string, prompt: string) => {
    try {
        const KV_REST_API_URL = process.env.KV_REST_API_URL ?? "";
        const KV_REST_API_TOKEN = process.env.KV_REST_API_TOKEN ?? "";
        if (KV_REST_API_URL == "" || KV_REST_API_TOKEN == "")
            throw new ActionError("Missing redis Config");
        const kv = createClient({
            url: KV_REST_API_URL,
            token: KV_REST_API_TOKEN,
        });

        const id = uuidv4();

        return await kv
            .hset(`image:${id}`, { id, urlImage, prompt })
            .then((value) => {
                if (value > 0) return id;
                else throw new Error("Redis issue");
            });
    } catch (error) {
        if (error instanceof ActionError) {
            console.error(error.message);
        }
        console.error(error);
    }
};

export const getCreationUrl = (id: string) => {
    try {
        const DOMAIN_URL = process.env.DOMAIN_URL ?? "";
        if (!DOMAIN_URL || DOMAIN_URL == "")
            throw new ActionError("Missing path config.");

        const PATH = `${DOMAIN_URL}/creation`;

        return new Promise<string>((resolve) => {
            resolve(`${PATH}/${id}`);
        });
    } catch (error) {
        if (error instanceof ActionError) {
            console.error(error.message);
        }
        console.error(error);
    }
};
