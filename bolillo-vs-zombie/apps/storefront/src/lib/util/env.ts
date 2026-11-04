export const getBaseURL = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_BASE_URL must be configured.")
  }

  return baseUrl
}
