export const jwtConstants = {
    secret: process.env.JWT_SECRET || 'secretKey', // In production, use env var
    expiresIn: '15m',
    refreshExpiresIn: '7d',
};

export const GQL_CONTEXT_USER = 'user';
export const IS_PUBLIC_KEY = 'isPublic';
