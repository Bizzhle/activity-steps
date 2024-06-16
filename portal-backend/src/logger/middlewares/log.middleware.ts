import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AppLoggerService } from '../services/app-logger.service';
import { RequestWithContext } from '../../app/types/RequestWithContext';

@Injectable()
export class LogsMiddleware implements NestMiddleware {
  // private readonly logger = new Logger('HTTP');
  constructor(private readonly logger: AppLoggerService) {}

  use(request: RequestWithContext, response: Response, next: NextFunction) {
    const { method, originalUrl } = request;

    response.on('error', () => this.logRequestBody(request, method));

    response.on('finish', () => {
      const { statusCode, statusMessage } = response;

      const message = `${method} ${originalUrl} ${statusCode} ${statusMessage}`;

      if (statusCode >= 500) {
        return this.logger.error(message);
      }

      if (statusCode >= 400) {
        return this.logger.warn(message);
      }

      return this.logger.log('RESPONSE', message);
    });

    next();
  }

  private logRequestBody(request: Request, method: string): void {
    if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
      this.logger.verbose('REQUEST BODY', `method=${method} body=${JSON.stringify(request.body)}`);
    }
  }
}