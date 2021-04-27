import { ILogger } from './logger.interface';

/* istanbul ignore file */

export class NoopLogger implements ILogger {
  // eslint-disable-next-line
  public info(): void { /* noop */ }
}
