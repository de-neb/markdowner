export type Session = {
  accessToken: string | null;
  refreshToken: string | null;
  expiration: string | null;
};

export type SessionState = {
  session: Session | null;
};
