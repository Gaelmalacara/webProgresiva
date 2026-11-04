const requiredVariables = [
  "DATABASE_URL",
  "REDIS_URL",
  "JWT_SECRET",
  "COOKIE_SECRET",
  "STORE_CORS",
  "ADMIN_CORS",
  "AUTH_CORS",
]

const missingVariables = requiredVariables.filter(
  (name) => !process.env[name]?.trim()
)

if (process.env.NODE_ENV !== "production") {
  console.error("Set NODE_ENV=production before starting the Railway backend.")
  process.exit(1)
}

if (missingVariables.length > 0) {
  console.error(
    `Missing required production environment variables: ${missingVariables.join(", ")}`
  )
  process.exit(1)
}

function validateUrl(name, protocols) {
  let url

  try {
    url = new URL(process.env[name])
  } catch {
    console.error(`${name} must be a valid URL.`)
    process.exit(1)
  }

  if (!protocols.includes(url.protocol)) {
    console.error(`${name} must use ${protocols.join(" or ")}.`)
    process.exit(1)
  }
}

validateUrl("DATABASE_URL", ["postgres:", "postgresql:"])
validateUrl("REDIS_URL", ["redis:", "rediss:"])

for (const name of ["JWT_SECRET", "COOKIE_SECRET"]) {
  if (process.env[name].length < 32) {
    console.error(`${name} must contain at least 32 characters.`)
    process.exit(1)
  }
}

for (const name of ["STORE_CORS", "ADMIN_CORS", "AUTH_CORS"]) {
  const origins = process.env[name].split(",").map((origin) => origin.trim())

  if (
    origins.some(
      (origin) =>
        !origin ||
        origin === "*" ||
        !origin.startsWith("https://") ||
        origin.includes("localhost")
    )
  ) {
    console.error(
      `${name} must contain comma-separated HTTPS origins without wildcards or localhost.`
    )
    process.exit(1)
  }

  for (const origin of origins) {
    try {
      const url = new URL(origin)
      if (url.origin !== origin) {
        console.error(`${name} contains an invalid origin.`)
        process.exit(1)
      }
    } catch {
      console.error(`${name} contains an invalid origin.`)
      process.exit(1)
    }
  }
}
