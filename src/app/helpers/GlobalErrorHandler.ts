import { ErrorHandler, Injectable } from '@angular/core';
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    const chunkFailedMessage = /Loading chunk [\d]+ failed/;
    if (chunkFailedMessage.test(error.message)) {
      /*
      if (confirm('New version of Zen-Calendar available. Load new version?')) {
        window.location.reload();
      }
      */
      console.error('Chunk error failure: ', error);
    }
  }
}
