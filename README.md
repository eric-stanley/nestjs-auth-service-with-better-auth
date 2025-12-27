# Auth Microservice

A standalone NestJS-based Authentication Microservice using `better-auth`, Federated GraphQL, and MongoDB.

## Features

- **Authentication**: Email/Password, Google, Facebook, GitHub via `better-auth`.
- **GraphQL Federation**: Fully compatible with Apollo Gateway.
- **RBAC**: Role-Based Access Control (`USER`, `ADMIN`, `SUPER_ADMIN`).
- **Storage**: Mongoose (MongoDB) for data, Redis for caching/sessions.
- **Security**: Stateless HTTP, Session/JWT support, Secure Headers.

## Architecture

- **AuthService**: Wraps `better-auth` core.
- **AuthResolver**: Exposes `login`, `signup`, `logout` via GraphQL.
- **UsersResolver**: Exposes user data (`me`).
- **Guards**: `GqlAuthGuard` (Session validation), `RolesGuard` (RBAC).

## Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Copy `.env.example` to `.env` and fill in secrets.
   ```bash
   cp .env.example .env
   ```

3. **Start Redis & MongoDB**:
   Ensure Redis (port 6379) and MongoDB (port 27017 or URI) are running.

4. **Run Application**:
   ```bash
   # Development
   npm run start:dev
   
   # Production
   npm run build
   npm run start:prod
   ```

## GraphQL API

### Mutations
- `login(input: LoginInput): AuthResponse`
- `signup(input: SignUpInput): AuthResponse`
- `logout: Boolean`

### Queries
- `me: UserType` (Protected)

## RBAC

Use `@Roles('ADMIN')` decorator on resolvers to protect them.

```typescript
@UseGuards(GqlAuthGuard, RolesGuard)
@Roles('ADMIN')
@Query(() => UserType)
async adminOnlyQuery() { ... }
```
