import { ConsoleLogger } from './ConsoleLogger';
import { ILogger } from './logger.interface';
import { NoopLogger } from './NoopLogger';

export default function createLogger(isNoop = false): ILogger {
  if(isNoop) {
    return new NoopLogger();
  } else {
    return new ConsoleLogger();
  }
}
