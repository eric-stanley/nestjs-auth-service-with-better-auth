import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-github2';
import { Injectable } from '@nestjs/common';
import { ProviderUtil } from '../../common/utils/provider.util';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
    constructor() {
        super({
            clientID: process.env.GITHUB_CLIENT_ID || 'client-id',
            clientSecret: process.env.GITHUB_CLIENT_SECRET || 'client-secret',
            callbackURL: 'http://localhost:3000/auth/github/redirect',
            scope: ['user:email'],
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async validate(accessToken: string, refreshToken: string, profile: Profile): Promise<any> {
        const user = ProviderUtil.normalizeProfile(profile);
        return user;
    }
}
