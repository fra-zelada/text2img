"use server";
import { Creation } from "@/interface";
import { ActionError } from "@/utils";
import { createClient } from "@vercel/kv";
import { cache } from "react";

export const getCreationById = cache(async (id: string) => {
    interface CreationResp extends Creation {
        [key: string]: unknown;
    }

    const uuidRegex =
        /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

    try {
        const isValidUUID = uuidRegex.test(
            "123e4567-e89b-12d3-a456-426614174001"
        );
        if (!isValidUUID) {
            throw new ActionError("Invalid Creation id");
        }

        const KV_REST_API_URL = process.env.KV_REST_API_URL ?? "";
        const KV_REST_API_TOKEN = process.env.KV_REST_API_TOKEN ?? "";
        if (KV_REST_API_URL == "" || KV_REST_API_TOKEN == "")
            throw new ActionError("Missing redis Config");

        const kv = createClient({
            url: KV_REST_API_URL,
            token: KV_REST_API_TOKEN,
        });

        const datosImagen = await kv.hgetall<CreationResp>(`image:${id}`);

        return datosImagen;
    } catch (error) {
        if (error instanceof ActionError) {
            console.error(error.message);
        }
        console.error(error);
    }
});
