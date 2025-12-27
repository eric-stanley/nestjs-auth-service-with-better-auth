import { Injectable } from '@nestjs/common';
import { Role } from './roles.enum';
import { Permission } from './permissions.enum';
import { RolePermissions } from './role-permission.map';

@Injectable()
export class RbacService {
    /**
     * Check if a user has a specific role.
     * @param user The user object (must have a roles array)
     * @param role The role to check
     */
    hasRole(user: any, role: Role): boolean {
        if (!user || !user.roles) {
            return false;
        }
        return user.roles.includes(role);
    }

    /**
     * Check if a user has a specific permission.
     * @param user The user object
     * @param permission The permission to check
     */
    hasPermission(user: any, permission: Permission): boolean {
        if (!user || !user.roles) {
            return false;
        }
        const userPermissions = this.getPermissionsForRoles(user.roles);
        return userPermissions.includes(permission);
    }

    /**
     * Get all unique permissions for a list of roles.
     * @param roles List of roles
     */
    getPermissionsForRoles(roles: Role[]): Permission[] {
        const permissions = new Set<Permission>();
        for (const role of roles) {
            const rolePerms = RolePermissions[role] || [];
            for (const perm of rolePerms) {
                permissions.add(perm);
            }
        }
        return Array.from(permissions);
    }
}
