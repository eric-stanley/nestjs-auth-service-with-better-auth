import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ProviderUtil } from '../../common/utils/provider.util';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor() {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID || 'client-id',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'client-secret',
            callbackURL: 'http://localhost:3000/auth/google/redirect',
            scope: ['email', 'profile'],
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async validate(accessToken: string, refreshToken: string, profile: Profile): Promise<any> {
        const user = ProviderUtil.normalizeProfile(profile);
        // Here you would typically validate/create user in DB
        return user;
    }
}
