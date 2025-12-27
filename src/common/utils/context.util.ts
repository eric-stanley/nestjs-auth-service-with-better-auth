import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export class ContextUtil {
    static getGqlContext(context: ExecutionContext) {
        const gqlContext = GqlExecutionContext.create(context);
        return gqlContext.getContext();
    }

    static getRequest(context: ExecutionContext) {
        if (context.getType() === 'http') {
            return context.switchToHttp().getRequest();
        }
        const ctx = GqlExecutionContext.create(context);
        return ctx.getContext().req;
    }
}
