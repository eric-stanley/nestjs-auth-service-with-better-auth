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
        it('should return false if user is null or missing roles', () => {
            expect(service.hasRole(null, Role.USER)).toBe(false);
            expect(service.hasRole({}, Role.USER)).toBe(false);
        });

        it('should return true if user has the role', () => {
            const user = { roles: [Role.USER, Role.ADMIN] };
            expect(service.hasRole(user, Role.USER)).toBe(true);
            expect(service.hasRole(user, Role.ADMIN)).toBe(true);
        });

        it('should return false if user does not have the role', () => {
            const user = { roles: [Role.USER] };
            expect(service.hasRole(user, Role.ADMIN)).toBe(false);
        });
    });

    describe('hasPermission', () => {
        it('should return false if user is null or missing roles', () => {
            expect(service.hasPermission(null, Permission.USER_READ)).toBe(false);
            expect(service.hasPermission({}, Permission.USER_READ)).toBe(false);
        });

        it('should return true if user has a role with the permission', () => {
            const user = { roles: [Role.USER] };
            expect(service.hasPermission(user, Permission.USER_READ)).toBe(true);
            expect(service.hasPermission(user, Permission.ADMIN_PANEL)).toBe(false);

            const admin = { roles: [Role.ADMIN] };
            expect(service.hasPermission(admin, Permission.ADMIN_PANEL)).toBe(true);
        });
    });

    describe('getPermissionsForRoles', () => {
        it('should return unique permissions for given roles', () => {
            const perms = service.getPermissionsForRoles([Role.USER]);
            expect(perms).toContain(Permission.USER_READ);
            expect(perms).not.toContain(Permission.ADMIN_PANEL);

            const adminPerms = service.getPermissionsForRoles([Role.ADMIN]);
            expect(adminPerms).toContain(Permission.ADMIN_PANEL);
        });
    });
});
