import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { UnauthorizedException } from '@nestjs/common';

describe('JwtStrategy', () => {
    let strategy: JwtStrategy;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [JwtStrategy],
        }).compile();

        strategy = module.get<JwtStrategy>(JwtStrategy);
    });

    it('should be defined', () => {
        expect(strategy).toBeDefined();
    });

    it('should validate and return user payload', async () => {
        const payload = { sub: '123', email: 'test@example.com', roles: ['USER'] };
        const result = await strategy.validate(payload);
        expect(result).toEqual({ userId: '123', email: 'test@example.com', roles: ['USER'] });
    });

    it('should throw UnauthorizedException if validation fails', async () => {
        const payload = { sub: null }; // Invalid payload
        await expect(strategy.validate(payload)).rejects.toThrow(UnauthorizedException);
    });
});
