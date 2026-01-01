import { Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { GqlExceptionFilter, GqlArgumentsHost } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

@Catch()
export class GraphQLExceptionFilter implements GqlExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const gqlHost = GqlArgumentsHost.create(host);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const ctx = gqlHost.getContext();

        if (exception instanceof HttpException) {
            const status = exception.getStatus();
            const response = exception.getResponse();
            const message =
                typeof response === 'object' && response !== null && 'message' in response
                    ? (response as { message: string }).message
                    : JSON.stringify(response);

            return new GraphQLError(message, {
                extensions: {
                    code: HttpStatus[status] || 'INTERNAL_SERVER_ERROR',
                    status,
                },
            });
        }

        if (exception instanceof GraphQLError) {
            return exception;
        }

        console.error(exception);

        return new GraphQLError('Internal server error', {
            extensions: {
                code: 'INTERNAL_SERVER_ERROR',
                status: 500,
            },
        });
    }
}
