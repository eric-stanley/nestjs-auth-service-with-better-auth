import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthService, Session } from './auth.service';
import { LoginInput, SignUpInput, AuthResponse } from './dto/auth.dto';
import { AuthContext } from '../common/types';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) { }

  @Mutation(() => AuthResponse)
  async login(
    @Args('input') input: LoginInput,
    @Context() context: AuthContext,
  ): Promise<AuthResponse> {
    const api = this.authService.getAuth().api;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const data = await api.signInEmail({
      body: {
        email: input.email,
        password: input.password,
      },
      asResponse: false
    });

    if (!data) {
      throw new Error('Login failed');
    }

    return {
      token: data.token,
      refreshToken: undefined,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        image: data.user.image || '',
      }
    };
  }

  @Mutation(() => AuthResponse)
  async signup(
    @Args('input') input: SignUpInput,
    @Context() context: AuthContext
  ): Promise<AuthResponse> {
    const api = this.authService.getAuth().api;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const data = await api.signUpEmail({
      body: {
        email: input.email,
        password: input.password,
        name: input.name
      },
      asResponse: false
    });

    if (!data) {
      throw new Error('Signup failed');
    }

    return {
      token: data.token || '',
      refreshToken: undefined,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        image: data.user.image || '',
      }
    };
  }

  @Mutation(() => Boolean)
  async logout(@Context() context: AuthContext) {
    const api = this.authService.getAuth().api;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    await api.signOut({
      headers: context.req.headers as any
    });
    return true;
  }
}
