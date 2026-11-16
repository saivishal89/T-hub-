/**
 * Shared API Endpoint Resolver for Vercel Multi-Service Architecture
 *
 * - On Vercel (Production): Client browser calls relative public paths (e.g. '/api/auth/login')
 *   which top-level rewrites in vercel.json seamlessly proxy to the backend service.
 * - In Serverless Functions: Bound internal service URL (process.env.BACKEND_URL) is used.
 * - Local Development: Falls back to NEXT_PUBLIC_API_URL or 'http://localhost:8000'.
 */

export function resolveApiUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  // When running in browser
  if (typeof window !== 'undefined') {
    // If explicit override is provided via env var (e.g. docker-compose)
    if (process.env.NEXT_PUBLIC_API_URL) {
      return `${process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '')}${cleanPath}`;
    }
    // Relative path is preferred for Vercel multi-service public rewrites
    return cleanPath;
  }

  // When running server-side inside a Node.js route handler / function
  const serverBase = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  return `${serverBase.replace(/\/$/, '')}${cleanPath}`;
}
