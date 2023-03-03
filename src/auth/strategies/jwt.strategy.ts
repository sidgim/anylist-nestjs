import { ExtractJwt, Strategy } from "passport-jwt";

import { AuthService } from "../auth.service";
import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";
import { JwtPayload } from "../interfaces/jwt-payload.interfaces";
import { PassportStrategy } from "@nestjs/passport";
import { User } from "src/users/entities/user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService,
                private readonly authService: AuthService) {
        super({
            secretOrKey: configService.get("JWT_SECRET"),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        });
    }

    async validate(payload: JwtPayload): Promise<User> {
        const { id } = payload;

        return await this.authService.validateUser(id);

    }
}
