export class InvalidURLError extends Error {
    constructor() {
      super('Not a valid URL.');
      Object.setPrototypeOf(this, InvalidURLError.prototype);
    }
  }

export class HeaderError extends Error {
  constructor() {
    super('Invalid username or password.');
    Object.setPrototypeOf(this, HeaderError.prototype);
  }
}