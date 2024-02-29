import "@testing-library/jest-dom";

const originalConsoleError = console.error;

// Sobrescribir console.error con una función que no hace nada
console.error = jest.fn();

// Restaurar console.error después de todas las pruebas
afterAll(() => {
    console.error = originalConsoleError;
});
