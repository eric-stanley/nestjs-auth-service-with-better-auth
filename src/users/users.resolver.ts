import { Resolver, Query } from '@nestjs/graphql';
import { UserType } from '../auth/dto/auth.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../common/guards/gql-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthService } from '../auth/auth.service';

@Resolver(() => UserType)
export class UsersResolver {
    constructor(private readonly authService: AuthService) { }

    @Query(() => UserType)
    @UseGuards(GqlAuthGuard)
    async me(@CurrentUser() user: any) {
        return Promise.resolve(user);
    }

    // TODO: Add userById with RBAC
}
