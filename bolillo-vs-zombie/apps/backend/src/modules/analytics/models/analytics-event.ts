import { model } from "@medusajs/framework/utils"

const AnalyticsEvent = model.define("analytics_event", {
  id: model.id().primaryKey(),
  event_id: model.text().unique(),
  event_name: model.text(),
  path: model.text(),
  visitor_id: model.text(),
  session_id: model.text(),
})

export default AnalyticsEvent
