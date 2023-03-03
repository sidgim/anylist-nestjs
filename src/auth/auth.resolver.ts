import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { User } from "src/users/entities/user.entity";
import { AuthService } from "./auth.service";
import { CurrentUser } from "./decorators/current-user.decorator";
import { SignInInput, SignupInput } from "./dto/input";
import { AuthResponse } from "./dto/types/auth-response.type";
import { ValidRoles } from "./enums/valid-roles.enum";
import { JwtAuthGuard } from "./guards/jwt-auth.guards";

@Resolver(() => AuthResponse)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {
  }

  @Mutation(() => AuthResponse, { name: "signup" })
  async signup(@Args("signupInput") signupInput: SignupInput): Promise<AuthResponse> {
    return this.authService.signup(signupInput);
  }

  @Mutation(() => AuthResponse, { name: "signin" })
  async signIn(
    @Args("SignInInput") signInInput: SignInInput
  ): Promise<AuthResponse> {
    return this.authService.signIn(signInInput);
  }

  @Query(() => AuthResponse, { name: "revalidate" })
  @UseGuards(JwtAuthGuard)
  revalidateToken(@CurrentUser([ValidRoles.admin]) user: User): AuthResponse {
    return this.authService.revalidateToken(user);
  }
}
