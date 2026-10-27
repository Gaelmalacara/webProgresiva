import { MedusaService } from "@medusajs/framework/utils"
import AnalyticsEvent from "./models/analytics-event"
import {
  ANALYTICS_EVENT_NAMES,
  type AnalyticsEventInput,
} from "./types"

class AnalyticsModuleService extends MedusaService({
  AnalyticsEvent,
}) {
  async recordEvent(input: AnalyticsEventInput) {
    const existing = await this.listAnalyticsEvents({
      event_id: input.event_id,
    })

    if (existing.length > 0) {
      return { event: existing[0], created: false }
    }

    try {
      const event = await this.createAnalyticsEvents(input)
      return { event, created: true }
    } catch (error) {
      const duplicate = await this.listAnalyticsEvents({
        event_id: input.event_id,
      })

      if (duplicate.length > 0) {
        return { event: duplicate[0], created: false }
      }

      throw error
    }
  }

  async getSummary(from: Date, to: Date) {
    const eventCounts = new Map<string, number>(
      ANALYTICS_EVENT_NAMES.map((eventName) => [eventName, 0])
    )
    const pageViewsByPath = new Map<string, number>()
    let totalEvents = 0
    let skip = 0
    const take = 1000

    while (true) {
      const [events, count] = await this.listAndCountAnalyticsEvents(
        {
          created_at: {
            $gte: from,
            $lte: to,
          },
        },
        { take, skip }
      )

      for (const event of events) {
        eventCounts.set(
          event.event_name,
          (eventCounts.get(event.event_name) ?? 0) + 1
        )

        if (event.event_name === "page_view") {
          pageViewsByPath.set(
            event.path,
            (pageViewsByPath.get(event.path) ?? 0) + 1
          )
        }
      }

      totalEvents += events.length
      skip += events.length

      if (skip >= count || events.length === 0) {
        break
      }
    }

    return {
      total_events: totalEvents,
      events_by_name: Object.fromEntries(eventCounts),
      page_views_by_path: Object.fromEntries(pageViewsByPath),
    }
  }
}

export default AnalyticsModuleService
