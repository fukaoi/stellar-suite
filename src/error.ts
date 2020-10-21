export class StellarSuiteError extends Error {
  constructor(...params: string[]) {
    super(...params);

    Error.captureStackTrace &&
      Error.captureStackTrace(this, StellarSuiteError);
  }
}
