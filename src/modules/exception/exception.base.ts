/**
 * Exception base class.
 */
export abstract class BaseException extends Error {
  public abstract code: string;

  constructor(
    public readonly description: string,
    public readonly cause?: unknown,
    public readonly metadata?: unknown,
  ) {
    super(description);
    Error.captureStackTrace(this);
  }
}

/**
 * Exception that indicates that the request can be retried.
 */
export abstract class RetryableError extends BaseException {}
