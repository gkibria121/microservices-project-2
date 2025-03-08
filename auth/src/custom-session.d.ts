import 'cookie-session';

declare module 'cookie-session' {
  interface SessionData {
    jwt?: string | null;
  }
}
