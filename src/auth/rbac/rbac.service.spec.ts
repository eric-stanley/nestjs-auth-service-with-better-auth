import { Test, TestingModule } from '@nestjs/testing';
import { RbacService } from './rbac.service';
import { Role } from './roles.enum';
import { Permission } from './permissions.enum';

describe('RbacService', () => {
    let service: RbacService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [RbacService],
        }).compile();

        service = module.get<RbacService>(RbacService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('hasRole', () => {
        it('should return true if user has role', () => {
            const user = { roles: [Role.USER] };
            expect(service.hasRole(user, Role.USER)).toBe(true);
        });

        it('should return false if user does not have role', () => {
            const user = { roles: [Role.USER] };
            expect(service.hasRole(user, Role.ADMIN)).toBe(false);
        });
    });

    describe('hasPermission', () => {
        it('should return true if user has permission via role', () => {
            const user = { roles: [Role.ADMIN] };
            expect(service.hasPermission(user, Permission.USER_READ)).toBe(true);
        });

        it('should return false if user does not have permission', () => {
            const user = { roles: [Role.USER] };
            expect(service.hasPermission(user, Permission.ADMIN_PANEL)).toBe(false);
        });
    });
});
