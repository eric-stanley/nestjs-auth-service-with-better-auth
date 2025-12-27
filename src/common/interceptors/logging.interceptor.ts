import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger(LoggingInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        if (context.getType() === 'http') {
            return next.handle(); // Skip for HTTP, let middleware handle or implement similar
        }

        const ctx = GqlExecutionContext.create(context);
        const info = ctx.getInfo();
        const parentType = info.parentType.name;
        const fieldName = info.fieldName;
        const now = Date.now();

        return next.handle().pipe(
            tap(() => {
                const time = Date.now() - now;
                this.logger.log(`${parentType}.${fieldName} completed in ${time}ms`);
            }),
        );
    }
}
