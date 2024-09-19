import { Injectable ,UnauthorizedException} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          // Extract JWT from cookies if present
          const tokenFromCookie = request?.cookies?.access_token;
          if (tokenFromCookie) {
            // console.log('cookie:',request?.cookies?.access_token)
            return tokenFromCookie;
          }
          // Fall back to extracting JWT from Authorization header as Bearer token
          return ExtractJwt.fromAuthHeaderAsBearerToken()(request);
        },
      ]),
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'), // Use the secret from environment variables
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {

    if (!payload) {
      throw new UnauthorizedException('Token is invalid');
    }
    // This payload will be the decrypted token payload you provided when signing the token
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}