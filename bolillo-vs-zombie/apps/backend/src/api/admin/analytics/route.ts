import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ANALYTICS_MODULE } from "../../../modules/analytics"
import type AnalyticsModuleService from "../../../modules/analytics/service"

const MAX_RANGE_MS = 90 * 24 * 60 * 60 * 1000
const DEFAULT_RANGE_MS = 30 * 24 * 60 * 60 * 1000

function parseDate(value: unknown): Date | null {
  if (typeof value !== "string") {
    return null
  }

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.query as Record<string, unknown>
  const to = query.to === undefined ? new Date() : parseDate(query.to)
  const from =
    query.from === undefined
      ? new Date((to ?? new Date()).getTime() - DEFAULT_RANGE_MS)
      : parseDate(query.from)

  if (!from || !to || from > to || to.getTime() - from.getTime() > MAX_RANGE_MS) {
    return res.status(400).json({
      message: "Provide a valid date range no longer than 90 days",
    })
  }

  const analyticsService: AnalyticsModuleService = req.scope.resolve(
    ANALYTICS_MODULE
  )
  const summary = await analyticsService.getSummary(from, to)

  return res.json({
    from: from.toISOString(),
    to: to.toISOString(),
    ...summary,
  })
}
