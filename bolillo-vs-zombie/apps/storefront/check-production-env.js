const requiredVariables = [
  "NEXT_PUBLIC_MEDUSA_BACKEND_URL",
  "NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY",
  "NEXT_PUBLIC_BASE_URL",
]

if (process.env.NODE_ENV !== "production") {
  console.error("Set NODE_ENV=production before starting the Railway storefront.")
  process.exit(1)
}

const missingVariables = requiredVariables.filter(
  (name) => !process.env[name]?.trim()
)

if (missingVariables.length > 0) {
  console.error(
    `Missing required production environment variables: ${missingVariables.join(", ")}`
  )
  process.exit(1)
}

for (const name of [
  "NEXT_PUBLIC_MEDUSA_BACKEND_URL",
  "NEXT_PUBLIC_BASE_URL",
]) {
  let url

  try {
    url = new URL(process.env[name])
  } catch {
    throw new Error(`${name} must be a valid public HTTPS URL.`)
  }

  if (
    url.protocol !== "https:" ||
    url.hostname === "localhost" ||
    url.hostname === "127.0.0.1"
  ) {
    throw new Error(`${name} must be a public HTTPS URL in production.`)
  }
}
