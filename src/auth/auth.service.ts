import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';

@Injectable()
export class AuthService implements OnModuleInit {
  private auth: ReturnType<typeof betterAuth>;


  public get staticAuth() {
    return this.auth;
  }

  constructor(
    private configService: ConfigService,
    @InjectConnection() private connection: Connection,
  ) { }

  onModuleInit() {
    this.auth = betterAuth({
      database: mongodbAdapter(this.connection.db as any), // Cast to any to avoid complex type match for now
      customSession: {
        // If we need to modify session return
      },
      user: {
        additionalFields: {
          roles: {
            type: 'string[]',
            required: false,
            defaultValue: ['USER'],
          },
          permissions: {
            type: 'string[]',
            required: false,
            defaultValue: [],
          },
        },
      },
      socialProviders: {
        google: {
          clientId: this.configService.getOrThrow<string>(
            'oauth.google.clientId',
          ),
          clientSecret: this.configService.getOrThrow<string>(
            'oauth.google.clientSecret',
          ),
        },
        facebook: {
          clientId: this.configService.getOrThrow<string>(
            'oauth.facebook.clientId',
          ),
          clientSecret: this.configService.getOrThrow<string>(
            'oauth.facebook.clientSecret',
          ),
        },
        github: {
          clientId: this.configService.getOrThrow<string>(
            'oauth.github.clientId',
          ),
          clientSecret: this.configService.getOrThrow<string>(
            'oauth.github.clientSecret',
          ),
        },
      },
      secret: this.configService.getOrThrow<string>('betterAuth.secret'),
      baseUrl: this.configService.getOrThrow<string>('betterAuth.url'),
    });
  }

  getAuth() {
    return this.auth;
  }
}

export type Auth = ReturnType<typeof betterAuth>;
export type Session = Auth['$Infer']['Session'];
export type User = Auth['$Infer']['Session']['user'];
