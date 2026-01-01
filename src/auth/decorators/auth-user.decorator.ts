import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from '../auth.service';

export const AuthUser = createParamDecorator(
    (data: unknown, context: ExecutionContext): User | null => {
        const ctx = GqlExecutionContext.create(context);
        const user = ctx.getContext().req.user;
        return user ? (user as User) : null;
    },
);
