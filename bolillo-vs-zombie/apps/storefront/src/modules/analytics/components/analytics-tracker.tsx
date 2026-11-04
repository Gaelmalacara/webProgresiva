"use client"

import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"

type AnalyticsEventName =
  | "page_view"
  | "hero_enter_shelter_click"
  | "side_menu_store_click"
  | "nav_home_click"
  | "product_add_to_cart_success"

const EVENT_NAMES = new Set<AnalyticsEventName>([
  "page_view",
  "hero_enter_shelter_click",
  "side_menu_store_click",
  "nav_home_click",
  "product_add_to_cart_success",
])

let fallbackVisitorId: string | undefined
let fallbackSessionId: string | undefined

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function getOrCreateId(key: "analytics_visitor_id" | "analytics_session_id") {
  try {
    const storage =
      key === "analytics_visitor_id" ? window.localStorage : window.sessionStorage
    const existing = storage.getItem(key)
    if (existing && UUID_PATTERN.test(existing)) {
      return existing
    }

    const id = crypto.randomUUID()
    storage.setItem(key, id)
    return id
  } catch (error) {
    console.warn("Analytics storage is unavailable; using an in-memory ID.", error)
    if (key === "analytics_visitor_id") {
      fallbackVisitorId ??= crypto.randomUUID()
      return fallbackVisitorId
    }

    fallbackSessionId ??= crypto.randomUUID()
    return fallbackSessionId
  }
}

function getAnalyticsIds() {
  return {
    visitor_id: getOrCreateId("analytics_visitor_id"),
    session_id: getOrCreateId("analytics_session_id"),
  }
}

export function trackAnalyticsEvent(
  eventName: AnalyticsEventName,
  path = window.location.pathname
) {
  const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

  if (!backendUrl) {
    console.error(
      "Analytics events cannot be sent without a Medusa backend URL."
    )
    return
  }

  if (!publishableKey) {
    console.error("Analytics events cannot be sent without a publishable API key.")
    return
  }

  try {
    const { visitor_id, session_id } = getAnalyticsIds()

    void fetch(`${backendUrl}/store/analytics/events`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-publishable-api-key": publishableKey,
      },
      body: JSON.stringify({
        event_id: crypto.randomUUID(),
        event_name: eventName,
        path,
        visitor_id,
        session_id,
      }),
      keepalive: true,
    }).then((response) => {
      if (!response.ok) {
        console.warn(`Analytics event was rejected with status ${response.status}.`)
      }
    }).catch((error: unknown) => {
      console.warn("Analytics event could not be sent.", error)
    })
  } catch (error) {
    console.warn("Analytics event could not be prepared.", error)
  }
}

export default function AnalyticsTracker() {
  const pathname = usePathname()
  const lastTrackedPath = useRef<string | null>(null)

  useEffect(() => {
    if (!pathname || pathname === lastTrackedPath.current) {
      return
    }

    lastTrackedPath.current = pathname
    trackAnalyticsEvent("page_view", pathname)
  }, [pathname])

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) {
        return
      }

      const target = event.target.closest<HTMLElement>(
        "[data-analytics-event]"
      )
      const eventName = target?.dataset.analyticsEvent

      if (eventName && EVENT_NAMES.has(eventName as AnalyticsEventName)) {
        trackAnalyticsEvent(eventName as AnalyticsEventName)
      }
    }

    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [])

  return null
}
