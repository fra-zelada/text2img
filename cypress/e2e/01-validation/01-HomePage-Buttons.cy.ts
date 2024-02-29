// import * as originalGenerateImageModule from "../../../src/actions/generate-image-2";

describe("Homepage tests", () => {
    beforeEach(() => {
        cy.visit("http://localhost:3000/");
    });

    it("the form should have two buttons", () => {
        cy.get("[data-test=creation-form]").within(() => {
            cy.get("button").should("have.length", 2);
        });
    });
    it("the generate button should be disabled if the text input is empty", () => {
        cy.get("[data-test=creation-form]").within(() => {
            cy.get("input").type("hello world");
            cy.get("input").clear();
            cy.contains("Generate").should("be.disabled");
        });
    });

    it("if the button Random Prompt has been clicked, the input should have a text", () => {
        cy.get("[data-test=creation-form]").within(() => {
            cy.contains("Random Prompt").click();
            cy.get("input").should(($input) => {
                const inputValue = $input.val();
                expect(inputValue).to.not.be.empty;
            });
        });
    });
    it("the generate button should not be disabled if the input has text", () => {
        cy.get("[data-test=creation-form]").within(() => {
            cy.get("input").type("hello world");
            cy.wait(100);
            cy.get("button[type=submit]").should("not.be.disabled");
        });
    });
    it("when submit should disable the submit button", () => {
        cy.get("[data-test=creation-form]").within(() => {
            cy.intercept("POST", "http://localhost:3000/", {
                statusCode: 200,
                json: () => Promise.resolve({ id: "123abc" }),
            });
            cy.get("input").type("hello world");
            cy.wait(100);
            cy.get("button[type=submit]").should("not.be.disabled");
            cy.get("button[type=submit]").should("not.be.disabled").click();
            cy.get("button[type=submit]").should("be.disabled");
        });
    });
    // it("should call the handleSubmit function after submit", () => {
    //     cy.get("[data-test=creation-form]").within(() => {
    //         // cy.intercept("POST", "http://localhost:3000/", {
    //         //     statusCode: 200,
    //         //     json: () => Promise.resolve({ id: "123abc" }),
    //         //     id: "123abc",
    //         //     body: {
    //         //         id: "123abc",
    //         //     },
    //         // });

    //         // cy.stub(
    //         //     originalGenerateImageModule,
    //         //     "generateImageRequestToAIService"
    //         // ).resolves({ id: "mocked-id" });

    //         // cy.stub(
    //         //     originalGenerateImageModule,
    //         //     "getImageGeneratedAtAIModelById"
    //         // ).resolves({ url_image: "mocked-url", result: true });

    //         // cy.stub(originalGenerateImageModule, "uploadToCloudinary").resolves(
    //         //     "https://res.cloudinary.com/dwvkka6mz/image/upload/v1706736255/replicate-text2img/rz5olfdqmg0s1irxi5pp.png"
    //         // );

    //         // cy.stub(originalGenerateImageModule, "saveImageAndPrompt").resolves(
    //         //     "mocked-id"
    //         // );

    //         // cy.stub(originalGenerateImageModule, "getCreationUrl").resolves(
    //         //     "https://res.cloudinary.com/dwvkka6mz/image/upload/v1706736255/replicate-text2img/rz5olfdqmg0s1irxi5pp.png"
    //         // );

    //         cy.get("input").type("hello world");
    //         cy.wait(100);
    //         cy.get("button[type=submit]").should("not.be.disabled");
    //         cy.get("button[type=submit]").click();
    //         cy.get("button[type=submit]").should("be.disabled");
    //     });

    //     cy.wait(30000);
    //     cy.get("[data-test=new-creation-display]").within(() => {
    //         cy.get("input[type=text][readonly]")
    //             .should("exist") // Verificar que existe el input
    //             .invoke("val") // Obtener el valor del input
    //             .should("have.string", "http");
    //         cy.contains("hello world");
    //         cy.get("img").should("exist");
    //         cy.get("img").should("have.attr", "src").and("include", "http");
    //     });
    //     cy.wait(30000);
    // });

    it("should call the handleSubmit function after submit", () => {
        cy.get("[data-test=creation-form]").within(() => {
            // cy.intercept("POST", "http://localhost:3000/", {
            //     statusCode: 200,
            //     json: () => Promise.resolve({ id: "123abc" }),
            //     id: "123abc",
            //     body: {
            //         id: "123abc",
            //     },
            // });

            cy.get("input").type("hello world");
            cy.wait(100);
            cy.get("button[type=submit]").should("not.be.disabled");
            cy.get("button[type=submit]").click();
            cy.get("button[type=submit]").should("be.disabled");
        });

        cy.get("[data-test=new-creation-wait]", { timeout: 20000 }).should(
            "exist"
        );

        cy.get("[data-test=new-creation-display]", { timeout: 20000 }).within(
            () => {
                cy.get("input[type=text][readonly]")
                    .should("exist") // Verificar que existe el input
                    .invoke("val") // Obtener el valor del input
                    .should("have.string", "http");
                cy.contains("hello world");
                cy.get("img").should("exist");
                cy.get("img").should("have.attr", "src").and("include", "http");
            }
        );
    });
});
