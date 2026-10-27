import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ANALYTICS_MODULE } from "../../../../modules/analytics"
import type AnalyticsModuleService from "../../../../modules/analytics/service"
import { analyticsEventSchema } from "../../../../modules/analytics/types"

const RATE_LIMIT = 60
const RATE_WINDOW_MS = 60_000
const MAX_RATE_LIMIT_SESSIONS = 10_000
const sessionRateLimits = new Map<string, { startedAt: number; count: number }>()

function isRateLimited(sessionId: string) {
  const now = Date.now()

  for (const [id, window] of sessionRateLimits) {
    if (now - window.startedAt >= RATE_WINDOW_MS) {
      sessionRateLimits.delete(id)
    }
  }

  const window = sessionRateLimits.get(sessionId)

  if (!window) {
    if (sessionRateLimits.size >= MAX_RATE_LIMIT_SESSIONS) {
      return true
    }

    sessionRateLimits.set(sessionId, { startedAt: now, count: 1 })
    return false
  }

  if (window.count >= RATE_LIMIT) {
    return true
  }

  window.count += 1
  return false
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const parsed = analyticsEventSchema.safeParse(req.body)

  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid analytics event",
      errors: parsed.error.issues.map(({ path, message }) => ({
        path: path.join("."),
        message,
      })),
    })
  }

  if (isRateLimited(parsed.data.session_id)) {
    return res.status(429).json({ message: "Analytics event rate limit exceeded" })
  }

  const analyticsService: AnalyticsModuleService = req.scope.resolve(
    ANALYTICS_MODULE
  )
  const result = await analyticsService.recordEvent(parsed.data)

  return res.status(result.created ? 201 : 200).json({
    event_id: result.event.event_id,
    created: result.created,
  })
}
