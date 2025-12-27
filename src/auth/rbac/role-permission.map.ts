import { Role } from './roles.enum';
import { Permission } from './permissions.enum';

export const RolePermissions: Record<Role, Permission[]> = {
    [Role.USER]: [Permission.USER_READ, Permission.USER_WRITE],
    [Role.ADMIN]: [
        Permission.USER_READ,
        Permission.USER_WRITE,
        Permission.ADMIN_PANEL,
    ],
    [Role.SUPER_ADMIN]: Object.values(Permission),
};
