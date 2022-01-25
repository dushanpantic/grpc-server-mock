import { ILogger } from './logger.interface';

/* istanbul ignore file */

export class NoopLogger implements ILogger {
  // eslint-disable-next-line
  public info(): void { /* noop */ }
  // eslint-disable-next-line
  public warn(): void { /* noop */ }
  // eslint-disable-next-line
  public error(): void { /* noop */ }
}
