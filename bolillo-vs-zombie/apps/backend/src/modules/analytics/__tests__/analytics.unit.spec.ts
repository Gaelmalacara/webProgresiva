import { analyticsEventSchema } from "../types"

const validEvent = {
  event_id: "84bbfe7d-8be8-4ed1-bcc4-fde906fd3786",
  event_name: "page_view",
  path: "/us/store",
  visitor_id: "4ee95ff5-1ba7-4a2d-bc99-d9f328c5580c",
  session_id: "a1ff39cb-c180-4bbc-b8b5-3379aa1000bb",
}

describe("analytics event validation", () => {
  it("accepts a supported event with anonymous UUID identifiers", () => {
    expect(analyticsEventSchema.safeParse(validEvent).success).toBe(true)
  })

  it("rejects unknown event names and invalid paths", () => {
    expect(
      analyticsEventSchema.safeParse({
        ...validEvent,
        event_name: "customer_email",
      }).success
    ).toBe(false)

    expect(
      analyticsEventSchema.safeParse({
        ...validEvent,
        path: "//example.com/store?email=visitor",
      }).success
    ).toBe(false)
  })

  it("rejects additional fields that could contain unnecessary personal data", () => {
    expect(
      analyticsEventSchema.safeParse({
        ...validEvent,
        email: "visitor@example.com",
      }).success
    ).toBe(false)
  })
})
