# MedusaJS Authentication System

This document explains how MedusaJS v2 handles user authentication, including user creation, password management, and the database table relationships.

## Database Schema

MedusaJS uses three tables for authentication:

```
┌─────────────────────┐      ┌──────────────────────┐      ┌─────────────────────────┐
│        user         │      │    auth_identity     │      │   provider_identity     │
├─────────────────────┤      ├──────────────────────┤      ├─────────────────────────┤
│ id (PK)             │◄─────│ app_metadata.user_id │      │ id (PK)                 │
│ email               │      │ id (PK)              │◄─────│ auth_identity_id (FK)   │
│ first_name          │      │ created_at           │      │ entity_id (email)       │
│ last_name           │      │ updated_at           │      │ provider ("emailpass")  │
│ avatar_url          │      │ deleted_at           │      │ provider_metadata       │
│ metadata            │      └──────────────────────┘      │   └─ password (hash)    │
│ created_at          │                                    │ user_metadata           │
│ updated_at          │                                    │ created_at              │
│ deleted_at          │                                    │ updated_at              │
└─────────────────────┘                                    │ deleted_at              │
                                                           └─────────────────────────┘
```

### Table Relationships

1. **user** → **auth_identity**: Linked via `auth_identity.app_metadata.user_id`
2. **auth_identity** → **provider_identity**: Linked via `provider_identity.auth_identity_id` (foreign key)
3. **provider_identity**: Stores the actual credentials (email in `entity_id`, password hash in `provider_metadata`)

### Table Details

#### `user`

Stores user profile information (no password here).

| Column     | Type      | Description           |
| ---------- | --------- | --------------------- |
| id         | uuid      | Primary key           |
| email      | string    | User's email address  |
| first_name | string?   | First name            |
| last_name  | string?   | Last name             |
| avatar_url | string?   | Profile picture URL   |
| metadata   | json?     | Custom metadata       |
| created_at | timestamp | Creation timestamp    |
| updated_at | timestamp | Last update timestamp |
| deleted_at | timestamp | Soft delete timestamp |

#### `auth_identity`

Acts as a bridge between user and authentication providers.

| Column       | Type      | Description                         |
| ------------ | --------- | ----------------------------------- |
| id           | uuid      | Primary key                         |
| app_metadata | json?     | Contains `{ user_id: "<user.id>" }` |
| created_at   | timestamp | Creation timestamp                  |
| updated_at   | timestamp | Last update timestamp               |
| deleted_at   | timestamp | Soft delete timestamp               |

#### `provider_identity`

Stores authentication credentials for each provider (e.g., emailpass, google, etc.).

| Column            | Type      | Description                                       |
| ----------------- | --------- | ------------------------------------------------- |
| id                | uuid      | Primary key                                       |
| entity_id         | string    | Identifier for the provider (email for emailpass) |
| provider          | string    | Provider name (e.g., "emailpass")                 |
| auth_identity_id  | uuid      | Foreign key to auth_identity                      |
| provider_metadata | json?     | Provider-specific data (password hash)            |
| user_metadata     | json?     | User-specific provider data                       |
| created_at        | timestamp | Creation timestamp                                |
| updated_at        | timestamp | Last update timestamp                             |
| deleted_at        | timestamp | Soft delete timestamp                             |

**Unique Constraint**: `(entity_id, provider)` - ensures one identity per email per provider.

## Password Hashing

MedusaJS uses **Scrypt-KDF** for password hashing (not bcrypt).

### Configuration

```typescript
const HASH_CONFIG = { logN: 15, r: 8, p: 1 };
```

### Hashing Process

```typescript
import Scrypt from 'scrypt-kdf';

// Hash a password
async function hashPassword(password: string): Promise<string> {
  const hash = await Scrypt.kdf(password, { logN: 15, r: 8, p: 1 });
  return hash.toString('base64');
}

// Verify a password
async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const hashBuffer = Buffer.from(storedHash, 'base64');
  return Scrypt.verify(hashBuffer, password);
}
```

### Storage

The password hash is stored in `provider_identity.provider_metadata.password` as a base64-encoded string.

Example `provider_metadata`:

```json
{
  "password": "c2NyeXB0AA8AAAAIAAAAAQp..."
}
```

## User Creation Flow

When creating a new user via `npx medusa user --email admin@example.com --password secret`:

### Step-by-Step Process

```
1. Generate UUIDs
   ├── user_id = uuid()
   ├── auth_identity_id = uuid()
   └── provider_identity_id = uuid()

2. Hash password
   └── password_hash = Scrypt.kdf(password, config).toString("base64")

3. Create user record
   └── INSERT INTO user (id, email) VALUES (user_id, email)

4. Create auth_identity record
   └── INSERT INTO auth_identity (id, app_metadata)
       VALUES (auth_identity_id, { "user_id": user_id })

5. Create provider_identity record
   └── INSERT INTO provider_identity (
         id,
         entity_id,
         provider,
         auth_identity_id,
         provider_metadata
       ) VALUES (
         provider_identity_id,
         email,                          -- entity_id is the email
         "emailpass",                    -- provider type
         auth_identity_id,               -- link to auth_identity
         { "password": password_hash }   -- hashed password
       )
```

### Sequence Diagram

```
┌─────────┐     ┌──────────────┐     ┌───────────────┐     ┌───────────────────┐
│ Command │     │ UserService  │     │  AuthService  │     │     Database      │
└────┬────┘     └──────┬───────┘     └───────┬───────┘     └─────────┬─────────┘
     │                 │                     │                       │
     │ createUser(email)                     │                       │
     │────────────────>│                     │                       │
     │                 │                     │                       │
     │                 │ INSERT user         │                       │
     │                 │─────────────────────────────────────────────>
     │                 │                     │                       │
     │                 │ return user         │                       │
     │                 │<─────────────────────────────────────────────
     │                 │                     │                       │
     │ register(email, password)             │                       │
     │───────────────────────────────────────>                       │
     │                 │                     │                       │
     │                 │                     │ hash password         │
     │                 │                     │──────┐                │
     │                 │                     │      │                │
     │                 │                     │<─────┘                │
     │                 │                     │                       │
     │                 │                     │ INSERT auth_identity  │
     │                 │                     │───────────────────────>
     │                 │                     │                       │
     │                 │                     │ INSERT provider_identity
     │                 │                     │───────────────────────>
     │                 │                     │                       │
     │                 │                     │ return authIdentity   │
     │                 │                     │<───────────────────────
     │                 │                     │                       │
     │ updateAuthIdentity(app_metadata: { user_id })                 │
     │───────────────────────────────────────>                       │
     │                 │                     │                       │
     │                 │                     │ UPDATE auth_identity  │
     │                 │                     │───────────────────────>
     │                 │                     │                       │
     │ Success         │                     │                       │
     │<────────────────────────────────────────────────────────────────
```

## Authentication Flow

When a user logs in via `POST /auth/user/emailpass`:

### Step-by-Step Process

```
1. Receive credentials
   └── { email, password }

2. Find provider_identity
   └── SELECT * FROM provider_identity
       WHERE entity_id = email AND provider = 'emailpass'

3. Verify password
   ├── Get stored hash from provider_metadata.password
   ├── Decode base64 to buffer
   └── Scrypt.verify(hashBuffer, providedPassword)

4. If valid, get auth_identity
   └── SELECT * FROM auth_identity
       WHERE id = provider_identity.auth_identity_id

5. Get user from app_metadata
   └── SELECT * FROM user
       WHERE id = auth_identity.app_metadata.user_id

6. Generate JWT token
   └── jwt.sign({ user_id, email }, JWT_SECRET)

7. Return token to client
```

### Sequence Diagram

```
┌────────┐     ┌────────────────┐     ┌───────────────┐     ┌──────────┐
│ Client │     │ AuthController │     │  AuthService  │     │ Database │
└───┬────┘     └───────┬────────┘     └───────┬───────┘     └────┬─────┘
    │                  │                      │                   │
    │ POST /auth/user/emailpass               │                   │
    │ { email, password }                     │                   │
    │─────────────────>│                      │                   │
    │                  │                      │                   │
    │                  │ authenticate(email, password)            │
    │                  │─────────────────────>│                   │
    │                  │                      │                   │
    │                  │                      │ SELECT provider_identity
    │                  │                      │ WHERE entity_id = email
    │                  │                      │──────────────────>│
    │                  │                      │                   │
    │                  │                      │ provider_identity │
    │                  │                      │<──────────────────│
    │                  │                      │                   │
    │                  │                      │ Scrypt.verify()   │
    │                  │                      │────┐              │
    │                  │                      │    │              │
    │                  │                      │<───┘              │
    │                  │                      │                   │
    │                  │                      │ SELECT auth_identity
    │                  │                      │──────────────────>│
    │                  │                      │                   │
    │                  │                      │ SELECT user       │
    │                  │                      │──────────────────>│
    │                  │                      │                   │
    │                  │                      │ Generate JWT      │
    │                  │                      │────┐              │
    │                  │                      │    │              │
    │                  │                      │<───┘              │
    │                  │                      │                   │
    │                  │ { token, user }      │                   │
    │                  │<─────────────────────│                   │
    │                  │                      │                   │
    │ { token, user }  │                      │                   │
    │<─────────────────│                      │                   │
```

## CLI Command Reference

### Create a new admin user

```bash
npx medusa user --email admin@example.com --password secretpassword
```

### Create an invite (email-based registration)

```bash
npx medusa user --email admin@example.com --invite
```

## JWT Token Structure

The JWT token contains:

```json
{
  "actor_id": "<user.id>",
  "actor_type": "user",
  "auth_identity_id": "<auth_identity.id>",
  "app_metadata": {
    "user_id": "<user.id>"
  },
  "iat": 1234567890,
  "exp": 1234567890
}
```

## Environment Variables

| Variable      | Description                       | Default       |
| ------------- | --------------------------------- | ------------- |
| JWT_SECRET    | Secret key for signing JWT tokens | "supersecret" |
| COOKIE_SECRET | Secret for cookie encryption      | "supersecret" |

## Source References

- User creation command: [packages/medusa/src/commands/user.ts](https://github.com/medusajs/medusa/blob/develop/packages/medusa/src/commands/user.ts)
- EmailPass provider: [packages/modules/providers/auth-emailpass/src/services/emailpass.ts](https://github.com/medusajs/medusa/blob/develop/packages/modules/providers/auth-emailpass/src/services/emailpass.ts)
