import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from '../../common/constants/auth.constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret,
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async validate(payload: any) {
        if (!payload.sub || !payload.email) {
            throw new UnauthorizedException();
        }
        return { userId: payload.sub, email: payload.email, roles: payload.roles };
    }
}
