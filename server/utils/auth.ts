// Authentication and authorization utilities

import { User } from '../../drizzle/schema';
import { ForbiddenError, UnauthorizedError } from './errors';

export function requireAuth(user: User | null): User {
  if (!user) {
    throw new UnauthorizedError('Authentication required');
  }
  return user;
}

export function requireAdmin(user: User | null): User {
  const authenticatedUser = requireAuth(user);
  if (authenticatedUser.role !== 'admin') {
    throw new ForbiddenError('Admin access required');
  }
  return authenticatedUser;
}

export function requireRole(user: User | null, role: 'admin' | 'user'): User {
  const authenticatedUser = requireAuth(user);
  if (authenticatedUser.role !== role) {
    throw new ForbiddenError(`${role} access required`);
  }
  return authenticatedUser;
}

export function checkOwnership(userId: number, resourceUserId: number): void {
  if (userId !== resourceUserId) {
    throw new ForbiddenError('You do not have permission to access this resource');
  }
}

export function canAccessProject(user: User | null, projectUserId: number): boolean {
  if (!user) return false;
  return user.id === projectUserId || user.role === 'admin';
}

export function canAccessDataset(user: User | null, datasetUserId: number): boolean {
  if (!user) return false;
  return user.id === datasetUserId || user.role === 'admin';
}

export function canAccessAnnotation(user: User | null, annotationUserId: number): boolean {
  if (!user) return false;
  return user.id === annotationUserId || user.role === 'admin';
}

export function generateSessionToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function hashPassword(password: string): string {
  // In production, use bcrypt or similar
  return Buffer.from(password).toString('base64');
}

export function verifyPassword(password: string, hash: string): boolean {
  // In production, use bcrypt or similar
  return Buffer.from(password).toString('base64') === hash;
}

export interface AuthContext {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export function createAuthContext(user: User | null): AuthContext {
  return {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };
}
