import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class GqlAuthGuard implements CanActivate {
    constructor(private authService: AuthService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = GqlExecutionContext.create(context);
        const { req } = ctx.getContext();

        // Better Auth getSession requires headers. 
        // We pass the headers from the incoming request.
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        const session = await this.authService.getAuth().api.getSession({
            headers: req.headers,
        });

        if (!session) {
            throw new UnauthorizedException();
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        req.user = session.user;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        req.session = session.session;
        return true;
    }
}
