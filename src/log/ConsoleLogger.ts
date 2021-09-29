import { ILogger } from './logger.interface';

/* istanbul ignore file */

export class ConsoleLogger implements ILogger {
  public info(message: string, metadata: any): void {
    if (!metadata) {
      console.log(message);
    } else {
      console.info(message, JSON.stringify(metadata, undefined, 2));
    }
  }
}
