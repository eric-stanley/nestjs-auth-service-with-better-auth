import { JwtService } from '@nestjs/jwt';

export class TokenUtil {
    constructor(private readonly jwtService: JwtService) { }

    sign(payload: any, options?: any): string {
        return this.jwtService.sign(payload, options);
    }

    verify(token: string, options?: any): any {
        return this.jwtService.verify(token, options);
    }
}
