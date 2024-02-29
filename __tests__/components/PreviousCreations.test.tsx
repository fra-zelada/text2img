import { PreviousCreations } from "@/components";

import { render, screen } from "@testing-library/react";

import React from "react";

jest.mock("../../src/components/GalleryItem", () => ({
    GalleryItem: jest.fn((item) => <div>{JSON.stringify(item)}</div>),
}));

jest.mock("../../src/store/useStore", () => ({
    useStore: jest.fn().mockReturnValue({
        getLastsCreations: jest.fn().mockReturnValue([
            {
                urlImage: "image1.jpg",
                prompt: "Prompt 1",
                url: "url1",
            },
            {
                urlImage: "image2.jpg",
                prompt: "Prompt 2",
                url: "url2",
            },
        ]),
        cleanCurrent: jest.fn(),
    }),
}));

describe("PreviousCreations", () => {
    it("should render a list of previous creations with their respective information", () => {
        // Arrange

        // Act
        render(<PreviousCreations />);

        //asserts
        const elementWithImage1 = screen.getByText(/image1\.jpg/i);
        expect(elementWithImage1).toBeInTheDocument();

        const elementWithImage2 = screen.getByText(/image2\.jpg/i);
        expect(elementWithImage2).toBeInTheDocument();
    });
});
