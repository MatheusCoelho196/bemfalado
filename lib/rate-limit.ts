// Simple in-memory rate limiter
// Para produção, considere usar Redis ou Upstash

interface RateLimitStore {
  [key: string]: {
    count: number
    resetAt: number
  }
}

const store: RateLimitStore = {}

// Limpar registros expirados a cada 5 minutos
setInterval(() => {
  const now = Date.now()
  Object.keys(store).forEach((key) => {
    if (store[key].resetAt < now) {
      delete store[key]
    }
  })
}, 5 * 60 * 1000)

export interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: number
}

export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = {
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '10'),
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'),
  }
): RateLimitResult {
  const now = Date.now()
  const key = identifier

  // Se não existe ou expirou, criar novo
  if (!store[key] || store[key].resetAt < now) {
    store[key] = {
      count: 1,
      resetAt: now + config.windowMs,
    }
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetAt: store[key].resetAt,
    }
  }

  // Incrementar contador
  store[key].count++

  const allowed = store[key].count <= config.maxRequests
  const remaining = Math.max(0, config.maxRequests - store[key].count)

  return {
    allowed,
    remaining,
    resetAt: store[key].resetAt,
  }
}
