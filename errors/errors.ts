export class InvalidURLError extends Error {
    constructor(message: string) {
      super(message);
      Object.setPrototypeOf(this, InvalidURLError.prototype);
    }
  }

export class HeaderError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, HeaderError.prototype);
  }
}