export class AuthenticationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'AuthenticationError';
    }
}


export class PostNotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'PostNotFoundError';
    }
}