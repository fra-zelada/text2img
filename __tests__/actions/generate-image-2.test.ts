import {
    generateImageRequestToAIService,
    getCreationUrl,
    getImageGeneratedAtAIModelById,
    saveImageAndPrompt,
    uploadToCloudinary,
} from "@/actions/generate-image-2";
import * as kvModule from "@vercel/kv";

describe("generate-image-2.ts tests", () => {
    describe("generateImageRequestToAIService tests", () => {
        const originalEnv = process.env;
        afterEach(() => {
            // Reset process.env after each test case
            process.env = originalEnv;
        });

        it("should call the API with the correct parameters and API token", async () => {
            const token = "myToken";
            const replicate_api = "https://api.replicate.com/v1/predictions";
            const prompt = "a new prompt";
            process.env = {
                REPLICATE_API_TOKEN: token,
                REPLICATE_API: replicate_api,
            };

            global.fetch = jest.fn().mockImplementation(() =>
                Promise.resolve({
                    ok: true,
                    status: 201,
                    json: () => Promise.resolve({ id: "123abc" }),
                })
            );

            // Arrange
            const formData = new FormData();
            formData.append("prompt", prompt);
            // Act
            const result = await generateImageRequestToAIService(formData);
            expect(result).toEqual({ id: "123abc" });

            const fetchConfig = {
                method: "POST",
                headers: {
                    Authorization: `Token ${token}`,
                    "Content-Type": "application/json",
                },
                body: expect.stringContaining(`"prompt":"${prompt}"`),
            };
            expect(global.fetch).toHaveBeenCalledWith(
                `${replicate_api}`,
                fetchConfig
            );
            delete global.fetch;
        });

        it("should return an object with a valid ID when a valid prompt is provided", async () => {
            // Arrange
            const formData = new FormData();
            formData.append("prompt", "valid prompt");

            // Act
            const result = await generateImageRequestToAIService(formData);

            // Assert
            expect(result).toHaveProperty("id");
            expect(typeof result.id).toBe("string");
        });
        it("should return an object with a empty ID when a prompt is dont provided", async () => {
            // Arrange
            const formData = new FormData();
            formData.append("prompt", "");

            // Act
            const result = await generateImageRequestToAIService(formData);

            // Assert
            expect(result).toHaveProperty("id");
            expect(result.id).toBe("");
        });
    });

    describe("getImageGeneratedAtAIModelById tests", () => {
        const originalEnv = process.env;

        afterEach(() => {
            process.env = originalEnv;
        });

        it("should return a valid url if status is succeeded", async () => {
            const token = "myToken";
            const replicate_api = "https://api.replicate.com/v1/predictions";
            process.env = {
                REPLICATE_API_TOKEN: token,
                REPLICATE_API: replicate_api,
            };

            global.fetch = jest.fn().mockImplementation(() =>
                Promise.resolve({
                    status: 200,
                    json: () =>
                        Promise.resolve({
                            status: "succeeded",
                            output: ["https://example.com/image.jpg"],
                        }),
                })
            );
            const id = "123abc";
            const result = await getImageGeneratedAtAIModelById(id);
            expect(result).toEqual({
                url_image: "https://example.com/image.jpg",
                result: true,
            });
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: `Token ${token}`,
                    cache: "no-cache",
                }),
            });
            delete global.fetch;
        });

        it("should return an error message if fetch response status is different to 200", async () => {
            global.fetch = jest
                .fn()
                .mockImplementation(() => Promise.resolve({ status: 400 }));
            const result = await getImageGeneratedAtAIModelById("123");
            expect(result).toEqual({
                errMsg: "Api Error",
                result: false,
            });
            delete global.fetch;
        });

        it("should return an error message if fetch prediction status is failed", async () => {
            global.fetch = jest.fn().mockImplementation(() =>
                Promise.resolve({
                    status: 200,
                    json: () => Promise.resolve({ status: "failed" }),
                })
            );
            const result = await getImageGeneratedAtAIModelById("123");
            expect(result).toEqual({
                errMsg: "Creation status failed or canceled",
                result: false,
            });
            delete global.fetch;
        });
    });

    describe("getCreationUrl tests", () => {
        it("should return a Promise with the URL appended with the provided ID", () => {
            const id = "123";
            const expectedUrl = "http://localhost:3000/creation/123";

            const result = getCreationUrl(id);

            return expect(result).resolves.toBe(expectedUrl);
        });

        it("should throw an ActionError if DOMAIN_URL is not defined", () => {
            process.env.DOMAIN_URL = "";

            const result = getCreationUrl("123");

            expect(result).toBe(undefined);
        });
    });

    describe("uploadToCloudinary tests", () => {
        it("should successfully upload image to Cloudinary and return secure URL", async () => {
            // Mock process.env
            const originalEnv = process.env;
            process.env = {
                ...originalEnv,
                CLOUDINARY_CLOUD_NAME: "cloud_name",
                CLOUDINARY_UPLOAD_PRESET: "upload_preset",
            };

            // Mock fetch
            const mockFetch = jest.fn().mockResolvedValue({
                json: jest.fn().mockResolvedValue({ secure_url: "secure_url" }),
            });
            global.fetch = mockFetch;

            // Call the function
            const result = await uploadToCloudinary("file_url");

            // Assertions
            expect(mockFetch).toHaveBeenCalledWith(
                "https://api.cloudinary.com/v1_1/cloud_name/image/upload?folder=upload_preset",
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "POST",
                    cache: "no-cache",
                    body: JSON.stringify({
                        file: "file_url",
                        upload_preset: "upload_preset",
                    }),
                }
            );
            expect(result).toBe("secure_url");

            // Restore mocks
            process.env = originalEnv;
            delete global.fetch;
        });

        it("should handle invalid file_url parameter gracefully", async () => {
            // Mock process.env
            const originalEnv = process.env;
            process.env = {
                ...originalEnv,
                CLOUDINARY_CLOUD_NAME: "cloud_name",
                CLOUDINARY_UPLOAD_PRESET: "upload_preset",
            };

            // Mock fetch
            const mockFetch = jest.fn().mockRejectedValue("error");
            global.fetch = mockFetch;

            // Call the function
            const result = await uploadToCloudinary("");

            // Assertions
            expect(result).toBe("");

            // Restore mocks
            process.env = originalEnv;
            delete global.fetch;
        });
    });

    describe("saveImageAndPrompt tests:", () => {
        it("should save image and prompt to Redis when successful", async () => {
            // Mock dependencies
            const kvMock = {
                hset: jest.fn().mockResolvedValue(1),
            };

            const createClientMock = jest
                .spyOn(kvModule, "createClient")
                .mockReturnValue(kvMock);

            // Mock environment variables
            process.env.KV_REST_API_URL = "http://example.com";
            process.env.KV_REST_API_TOKEN = "tokenxd";

            // Call the function
            const result = await saveImageAndPrompt(
                "http://example.com/image.jpg",
                "Prompt"
            );

            // Assertions
            expect(createClientMock).toHaveBeenCalledWith({
                url: "http://example.com",
                token: "tokenxd",
            });

            expect(kvMock.hset).toHaveBeenCalledWith(expect.any(String), {
                id: expect.any(String),
                urlImage: "http://example.com/image.jpg",
                prompt: "Prompt",
            });

            expect(result).toEqual(expect.any(String));

            // Restaurar los mocks después de que el test haya finalizado
            createClientMock.mockRestore();
        });
    });
});
