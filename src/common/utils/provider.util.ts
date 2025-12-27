import { Profile } from 'passport';

export class ProviderUtil {
    static normalizeProfile(profile: Profile): any {
        const { id, username, displayName, emails, photos, provider } = profile;
        return {
            provider,
            providerId: id,
            email: emails && emails[0] ? emails[0].value : null,
            name: displayName || username,
            picture: photos && photos[0] ? photos[0].value : null,
        };
    }
}
