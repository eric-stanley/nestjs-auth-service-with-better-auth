import { Request, Response } from 'express';

export interface AuthContext {
    req: Request & { user?: any; session?: any };
    res: Response;
}
