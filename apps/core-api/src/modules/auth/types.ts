export interface AccessTokenPayload {
  sub: string;
  // Note: email may be stale if user updates it after token issuance
  email: string;
  type: 'access';
}

export interface RefreshTokenPayload {
  sub: string;
  jti: string;
  type: 'refresh';
}

export interface LoginResponseBody {
  accessToken: string;
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  };
}

export interface RefreshResponseBody {
  accessToken: string;
}

export interface LogoutResponseBody {
  message: string;
}

export interface LogoutAllResponseBody {
  message: string;
  revokedCount: number;
}
