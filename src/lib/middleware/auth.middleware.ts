
import { Injectable } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { accessTokenKey } from '../constants/access-token-key.constant';
import { identityTokenKey } from '../constants/identity-token-key.constant';

@Injectable()
export class AuthMiddleware {
  constructor(private authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (req.url.includes('/api/') && req.url !== '/api/health') {
      const token = req.headers?.authorization?.replace('Bearer ', '');

      if (token) {
        try {
          const accessToken: any =
            (await this.authService.validateToken({ token })) as any;

          if (accessToken?.sub) {
            (req as any)[accessTokenKey] = accessToken;

            const idTokenHeader = req.headers['x-identity-token'];
            const idTokenRaw = Array.isArray(idTokenHeader)
              ? idTokenHeader[0]
              : idTokenHeader;

            if (idTokenRaw) {
              (req as any)[identityTokenKey] = idTokenRaw;
            } else {
              (req as any)[identityTokenKey] = null;
            }
          } else {
            (req as any)[accessTokenKey] = null;
            (req as any)[identityTokenKey] = null;
          }
        } catch (error) {
          (req as any)[accessTokenKey] = null;
          (req as any)[identityTokenKey] = null;
          console.error({ error });
        }
      } else {
        console.warn(`token missing for ${req.url}`);
      }
    }

    next();
  }
}
