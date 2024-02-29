import { ModalImage } from "@/components";
import { fireEvent, render, screen } from "@testing-library/react";

describe("ModalImage tests", () => {
    test("should show a modal", async () => {
        const onClose = jest.fn();
        const showModal = true;
        const urlImage = "image.jpg";
        const prompt = "Test Prompt";
        const url = "https://example.com";

        render(
            <ModalImage
                onClose={onClose}
                showModal={showModal}
                urlImage={urlImage}
                prompt={prompt}
                url={url}
            />
        );

        const image = screen.getByAltText(prompt) as HTMLImageElement;

        expect(image.tagName).toBe("IMG");

        expect(image.alt).toBe(prompt);

        expect(image.src).toContain(urlImage);

        expect(await screen.findByText(prompt)).toBeVisible();

        const closeButton = screen.getByRole("button", { name: /Close/i });

        expect(closeButton).toBeInTheDocument();

        fireEvent.click(closeButton);

        expect(onClose).toHaveBeenCalledTimes(1);
    });
});
