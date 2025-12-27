import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UsersModule } from '../users/users.module';
import { jwtConstants } from '../common/constants/auth.constants';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RbacService } from './rbac/rbac.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { FacebookStrategy } from './strategies/facebook.strategy';
import { GithubStrategy } from './strategies/github.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn as any },
    }),
  ],
  providers: [
    AuthService,
    AuthResolver,
    JwtStrategy,
    RbacService,
    GoogleStrategy,
    FacebookStrategy,
    GithubStrategy,
  ],
  exports: [AuthService, RbacService, JwtModule, PassportModule],
})
export class AuthModule { }
