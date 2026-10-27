import { z } from "@medusajs/framework/zod"

export const ANALYTICS_EVENT_NAMES = [
  "page_view",
  "hero_enter_shelter_click",
  "side_menu_store_click",
  "nav_home_click",
  "product_add_to_cart_success",
] as const

export const analyticsEventSchema = z
  .object({
    event_id: z.string().uuid(),
    event_name: z.enum(ANALYTICS_EVENT_NAMES),
    path: z
      .string()
      .min(1)
      .max(2048)
      .startsWith("/")
      .refine(
        (path) =>
          !path.startsWith("//") && !path.includes("?") && !path.includes("#"),
        "Path must be a local pathname without query or fragment"
      ),
    visitor_id: z.string().uuid(),
    session_id: z.string().uuid(),
  })
  .strict()

export type AnalyticsEventInput = z.infer<typeof analyticsEventSchema>
