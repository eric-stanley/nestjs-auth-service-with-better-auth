import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class LoginInput {
  @Field()
  email: string;

  @Field()
  password: string;
}

@InputType()
export class SignUpInput {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  name: string;
}

@ObjectType()
export class UserType {
  @Field()
  id: string;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field()
  image: string; // Optional if not always present, but sticking to non-nullable based on schema unless specified
}

@ObjectType()
export class AuthResponse {
  @Field()
  token: string; // JWT access token

  @Field({ nullable: true })
  refreshToken?: string;

  @Field(() => UserType)
  user: UserType;
}
