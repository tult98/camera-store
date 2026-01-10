export interface AccessTokenPayload {
  sub: string;
  // Note: email may be stale if user updates it after token issuance
  email: string;
  type: 'access';
}
