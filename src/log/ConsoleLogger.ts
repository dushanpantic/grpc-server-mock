import { ILogger } from './logger.interface';

/* istanbul ignore file */

export class ConsoleLogger implements ILogger {
  public info(message: string, metadata: any): void {
    console.info(message, metadata);
  }
}
