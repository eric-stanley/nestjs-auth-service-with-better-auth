import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-facebook';
import { Injectable } from '@nestjs/common';
import { ProviderUtil } from '../../common/utils/provider.util';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
    constructor() {
        super({
            clientID: process.env.FACEBOOK_APP_ID || 'app-id',
            clientSecret: process.env.FACEBOOK_APP_SECRET || 'app-secret',
            callbackURL: 'http://localhost:3000/auth/facebook/redirect',
            scope: 'email',
            profileFields: ['emails', 'name'],
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async validate(accessToken: string, refreshToken: string, profile: Profile): Promise<any> {
        const user = ProviderUtil.normalizeProfile(profile);
        return user;
    }
}
