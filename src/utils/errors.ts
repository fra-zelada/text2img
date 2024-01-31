export class ActionError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ActionError";
    }
}

export class CreationFormError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "CreationFormError";
    }
}
