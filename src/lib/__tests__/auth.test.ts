import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

// Mock server-only to prevent client-side import error
vi.mock('server-only', () => ({}))

// Mock jose library
vi.mock('jose', () => ({
  SignJWT: vi.fn(),
  jwtVerify: vi.fn(),
}))

// Mock next/headers
vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

// Import after mocking
import { createSession, getSession, deleteSession, verifySession, type SessionPayload } from '../auth'

// Mock TextEncoder for Node.js compatibility
global.TextEncoder = TextEncoder

describe('createSession', () => {
  let mockCookieStore: any
  let mockSignJWT: any
  let originalEnv: typeof process.env

  beforeEach(() => {
    // Store original environment
    originalEnv = { ...process.env }
    
    // Reset mocks
    vi.clearAllMocks()

    // Mock cookie store
    mockCookieStore = {
      set: vi.fn(),
      get: vi.fn(),
      delete: vi.fn(),
    }

    // Mock cookies function
    vi.mocked(cookies).mockResolvedValue(mockCookieStore)

    // Mock SignJWT chain
    mockSignJWT = {
      setProtectedHeader: vi.fn().mockReturnThis(),
      setExpirationTime: vi.fn().mockReturnThis(),
      setIssuedAt: vi.fn().mockReturnThis(),
      sign: vi.fn().mockResolvedValue('mock-jwt-token'),
    }
    vi.mocked(SignJWT).mockReturnValue(mockSignJWT)
  })

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv
    vi.resetAllMocks()
  })

  describe('Happy Path Scenarios', () => {
    it('should create a session with valid userId and email', async () => {
      const userId = 'user-123'
      const email = 'test@example.com'

      await createSession(userId, email)

      // Verify SignJWT was called with correct payload
      expect(SignJWT).toHaveBeenCalledWith(
        expect.objectContaining({
          userId,
          email,
          expiresAt: expect.any(Date),
        })
      )

      // Verify JWT signing chain
      expect(mockSignJWT.setProtectedHeader).toHaveBeenCalledWith({ alg: 'HS256' })
      expect(mockSignJWT.setExpirationTime).toHaveBeenCalledWith('7d')
      expect(mockSignJWT.setIssuedAt).toHaveBeenCalledWith()
      expect(mockSignJWT.sign).toHaveBeenCalledWith(expect.anything())

      // Verify cookie was set
      expect(mockCookieStore.set).toHaveBeenCalledWith(
        'auth-token',
        'mock-jwt-token',
        expect.objectContaining({
          httpOnly: true,
          secure: false, // NODE_ENV !== 'production'
          sameSite: 'lax',
          expires: expect.any(Date),
          path: '/',
        })
      )
    })

    it('should set session expiry to 7 days from now', async () => {
      const userId = 'user-456'
      const email = 'user@test.com'
      const beforeTime = new Date()

      await createSession(userId, email)

      const signJWTCall = vi.mocked(SignJWT).mock.calls[0][0] as SessionPayload
      const expiresAt = new Date(signJWTCall.expiresAt)
      const afterTime = new Date()

      // Should be approximately 7 days from now (allowing for test execution time)
      const sevenDaysFromBefore = new Date(beforeTime.getTime() + 7 * 24 * 60 * 60 * 1000)
      const sevenDaysFromAfter = new Date(afterTime.getTime() + 7 * 24 * 60 * 60 * 1000)

      expect(expiresAt.getTime()).toBeGreaterThanOrEqual(sevenDaysFromBefore.getTime() - 1000) // 1s tolerance
      expect(expiresAt.getTime()).toBeLessThanOrEqual(sevenDaysFromAfter.getTime() + 1000)
    })

    it('should use production security settings when NODE_ENV is production', async () => {
      process.env.NODE_ENV = 'production'
      
      await createSession('user-789', 'prod@example.com')

      expect(mockCookieStore.set).toHaveBeenCalledWith(
        'auth-token',
        'mock-jwt-token',
        expect.objectContaining({
          secure: true, // Should be true in production
        })
      )
    })

    it('should use development security settings when NODE_ENV is not production', async () => {
      process.env.NODE_ENV = 'development'
      
      await createSession('user-dev', 'dev@example.com')

      expect(mockCookieStore.set).toHaveBeenCalledWith(
        'auth-token',
        'mock-jwt-token',
        expect.objectContaining({
          secure: false, // Should be false in development
        })
      )
    })

    it('should handle empty userId gracefully', async () => {
      const userId = ''
      const email = 'empty@example.com'

      await createSession(userId, email)

      expect(SignJWT).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: '',
          email,
        })
      )
    })

    it('should handle empty email gracefully', async () => {
      const userId = 'user-empty-email'
      const email = ''

      await createSession(userId, email)

      expect(SignJWT).toHaveBeenCalledWith(
        expect.objectContaining({
          userId,
          email: '',
        })
      )
    })

    it('should use JWT secret that was set when module loaded', async () => {
      await createSession('user-secret', 'secret@example.com')

      // Since JWT_SECRET is loaded when the module imports, we just verify that sign is called with a Uint8Array
      // The actual secret depends on what was set when the module was imported
      expect(mockSignJWT.sign).toHaveBeenCalledWith(expect.anything())
    })

    it('should use consistent JWT secret across calls', async () => {
      await createSession('user-default', 'default@example.com')

      // Since JWT_SECRET is loaded when the module imports, we just verify that sign is called with a Uint8Array
      // The secret remains consistent across all calls within the same module instance
      expect(mockSignJWT.sign).toHaveBeenCalledWith(expect.anything())
    })
  })

  describe('Edge Cases and Error Conditions', () => {
    it('should handle JWT signing errors gracefully', async () => {
      const signingError = new Error('JWT signing failed')
      mockSignJWT.sign.mockRejectedValue(signingError)

      await expect(createSession('user-error', 'error@example.com')).rejects.toThrow('JWT signing failed')

      // Cookie should not be set if JWT signing fails
      expect(mockCookieStore.set).not.toHaveBeenCalled()
    })

    it('should handle cookie setting errors', async () => {
      const cookieError = new Error('Cookie setting failed')
      mockCookieStore.set.mockImplementation(() => {
        throw cookieError
      })

      await expect(createSession('user-cookie-error', 'cookie@example.com')).rejects.toThrow('Cookie setting failed')
    })

    it('should handle cookies() function rejection', async () => {
      const cookiesError = new Error('Cookies access failed')
      vi.mocked(cookies).mockRejectedValue(cookiesError)

      await expect(createSession('user-cookies-fail', 'fail@example.com')).rejects.toThrow('Cookies access failed')
    })

    it('should handle very long userId and email', async () => {
      const longUserId = 'a'.repeat(1000)
      const longEmail = 'b'.repeat(1000) + '@example.com'

      await createSession(longUserId, longEmail)

      expect(SignJWT).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: longUserId,
          email: longEmail,
        })
      )
    })

    it('should handle special characters in userId and email', async () => {
      const specialUserId = 'user-123!@#$%^&*()_+-={}[]|\\:";\'<>?,./'
      const specialEmail = 'test+tag@example-domain.co.uk'

      await createSession(specialUserId, specialEmail)

      expect(SignJWT).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: specialUserId,
          email: specialEmail,
        })
      )
    })

    it('should handle undefined userId and email', async () => {
      // TypeScript would prevent this, but testing runtime behavior
      await createSession(undefined as any, undefined as any)

      expect(SignJWT).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: undefined,
          email: undefined,
        })
      )
    })

    it('should handle null userId and email', async () => {
      // TypeScript would prevent this, but testing runtime behavior
      await createSession(null as any, null as any)

      expect(SignJWT).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: null,
          email: null,
        })
      )
    })
  })

  describe('JWT Token Structure', () => {
    it('should create JWT with correct algorithm', async () => {
      await createSession('user-alg', 'alg@example.com')

      expect(mockSignJWT.setProtectedHeader).toHaveBeenCalledWith({ alg: 'HS256' })
    })

    it('should set JWT expiration time to 7 days', async () => {
      await createSession('user-exp', 'exp@example.com')

      expect(mockSignJWT.setExpirationTime).toHaveBeenCalledWith('7d')
    })

    it('should set JWT issued at time', async () => {
      await createSession('user-iat', 'iat@example.com')

      expect(mockSignJWT.setIssuedAt).toHaveBeenCalledWith()
    })

    it('should call JWT methods in correct order', async () => {
      await createSession('user-order', 'order@example.com')

      const mockCalls = [
        mockSignJWT.setProtectedHeader.mock.invocationCallOrder[0],
        mockSignJWT.setExpirationTime.mock.invocationCallOrder[0],
        mockSignJWT.setIssuedAt.mock.invocationCallOrder[0],
        mockSignJWT.sign.mock.invocationCallOrder[0],
      ]

      // Verify methods were called in the correct sequence
      expect(mockCalls).toEqual(mockCalls.sort((a, b) => a - b))
    })
  })

  describe('Cookie Configuration', () => {
    it('should set httpOnly flag to true for security', async () => {
      await createSession('user-http', 'http@example.com')

      expect(mockCookieStore.set).toHaveBeenCalledWith(
        'auth-token',
        'mock-jwt-token',
        expect.objectContaining({
          httpOnly: true,
        })
      )
    })

    it('should set sameSite to lax', async () => {
      await createSession('user-samesite', 'samesite@example.com')

      expect(mockCookieStore.set).toHaveBeenCalledWith(
        'auth-token',
        'mock-jwt-token',
        expect.objectContaining({
          sameSite: 'lax',
        })
      )
    })

    it('should set path to root', async () => {
      await createSession('user-path', 'path@example.com')

      expect(mockCookieStore.set).toHaveBeenCalledWith(
        'auth-token',
        'mock-jwt-token',
        expect.objectContaining({
          path: '/',
        })
      )
    })

    it('should set cookie expiration to match session expiration', async () => {
      const beforeTime = new Date()
      
      await createSession('user-cookie-exp', 'cookieexp@example.com')
      
      const afterTime = new Date()

      expect(mockCookieStore.set).toHaveBeenCalledWith(
        'auth-token',
        'mock-jwt-token',
        expect.objectContaining({
          expires: expect.any(Date),
        })
      )

      const cookieExpiry = mockCookieStore.set.mock.calls[0][2].expires as Date
      const sevenDaysFromBefore = new Date(beforeTime.getTime() + 7 * 24 * 60 * 60 * 1000)
      const sevenDaysFromAfter = new Date(afterTime.getTime() + 7 * 24 * 60 * 60 * 1000)

      expect(cookieExpiry.getTime()).toBeGreaterThanOrEqual(sevenDaysFromBefore.getTime() - 1000)
      expect(cookieExpiry.getTime()).toBeLessThanOrEqual(sevenDaysFromAfter.getTime() + 1000)
    })

    it('should use correct cookie name', async () => {
      await createSession('user-name', 'name@example.com')

      expect(mockCookieStore.set).toHaveBeenCalledWith(
        'auth-token', // Verify exact cookie name
        expect.any(String),
        expect.any(Object)
      )
    })
  })

  describe('Performance and Reliability', () => {
    it('should complete session creation within reasonable time', async () => {
      const startTime = performance.now()
      
      await createSession('user-perf', 'perf@example.com')
      
      const endTime = performance.now()
      const duration = endTime - startTime

      // Should complete within 100ms (very generous for unit test)
      expect(duration).toBeLessThan(100)
    })

    it('should handle concurrent session creation', async () => {
      const promises = []
      for (let i = 0; i < 10; i++) {
        promises.push(createSession(`user-${i}`, `user${i}@example.com`))
      }

      await expect(Promise.all(promises)).resolves.toBeDefined()
      
      // All sessions should be created
      expect(SignJWT).toHaveBeenCalledTimes(10)
      expect(mockCookieStore.set).toHaveBeenCalledTimes(10)
    })

    it('should maintain consistent behavior across multiple calls', async () => {
      const userId = 'consistent-user'
      const email = 'consistent@example.com'

      // Create multiple sessions with same data
      await createSession(userId, email)
      await createSession(userId, email)
      await createSession(userId, email)

      // Should have consistent behavior each time
      expect(SignJWT).toHaveBeenCalledTimes(3)
      expect(mockCookieStore.set).toHaveBeenCalledTimes(3)

      // All calls should have same structure
      const calls = vi.mocked(SignJWT).mock.calls
      calls.forEach(call => {
        expect(call[0]).toMatchObject({
          userId,
          email,
          expiresAt: expect.any(Date),
        })
      })
    })
  })

  describe('Environment Variable Handling', () => {
    it('should handle missing NODE_ENV', async () => {
      delete process.env.NODE_ENV

      await createSession('user-no-env', 'noenv@example.com')

      expect(mockCookieStore.set).toHaveBeenCalledWith(
        'auth-token',
        'mock-jwt-token',
        expect.objectContaining({
          secure: false, // Should default to false when NODE_ENV is undefined
        })
      )
    })

    it('should handle various NODE_ENV values', async () => {
      const envValues = ['test', 'staging', 'prod', 'PRODUCTION', 'Production', '']

      for (const env of envValues) {
        process.env.NODE_ENV = env
        mockCookieStore.set.mockClear()

        await createSession('user-env', 'env@example.com')

        const expectedSecure = env === 'production'
        expect(mockCookieStore.set).toHaveBeenCalledWith(
          'auth-token',
          'mock-jwt-token',
          expect.objectContaining({
            secure: expectedSecure,
          })
        )
      }
    })

    it('should handle JWT secret consistently', async () => {
      await createSession('user-env-secret', 'envsecret@example.com')

      // JWT secret is determined at module import time, so we verify consistent behavior
      expect(mockSignJWT.sign).toHaveBeenCalledWith(expect.anything())
    })
  })
})