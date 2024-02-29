import { WaitAlert } from "@/components/WaitAlert";
import { render, screen } from "@testing-library/react";
// Mockea el módulo react-dom
jest.mock("react-dom", () => {
    return {
        ...jest.requireActual("react-dom"),
        useFormStatus: jest.fn(),
    };
});

describe("WaitAlert", () => {
    test("should correctly render", () => {
        // Configura el valor de retorno que deseas para el mock de useFormStatus
        const mockStatus = { pending: true };
        // Asigna el mockStatus al mock de useFormStatus
        require("react-dom").useFormStatus.mockReturnValue(mockStatus);

        // Renderiza el componente y realiza tus pruebas
        const { container } = render(<WaitAlert />);
        // ... realiza las aserciones necesarias en el contenedor

        expect(container).toMatchSnapshot();
        // Limpia el mock después de las pruebas si es necesario
        jest.clearAllMocks();
    });
    test("should have the className hide-custom when pending is false", async () => {
        // Arrange
        const mockStatus = { pending: false };
        // Asigna el mockStatus al mock de useFormStatus
        require("react-dom").useFormStatus.mockReturnValue(mockStatus);
        const { container } = render(<WaitAlert />);

        // Act

        // Assert
        expect(container.getElementsByClassName("hide-custom").length).toBe(1);

        jest.clearAllMocks();
    });
    test("should have the className show-custom when pending is true", async () => {
        // Arrange
        const mockStatus = { pending: true };
        // Asigna el mockStatus al mock de useFormStatus
        require("react-dom").useFormStatus.mockReturnValue(mockStatus);
        const { container } = render(<WaitAlert />);

        // Act

        // Assert
        expect(container.getElementsByClassName("show-custom").length).toBe(1);

        jest.clearAllMocks();
    });
});
