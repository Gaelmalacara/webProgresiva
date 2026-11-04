const c = require("ansi-colors");

const requiredEnvs = [
  {
    key: "NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY",
    description:
      "Learn how to create a publishable key: https://docs.medusajs.com/v2/resources/storefront-development/publishable-api-keys",
  },
  {
    key: "NEXT_PUBLIC_MEDUSA_BACKEND_URL",
    description: "Use the public HTTPS URL of the deployed Medusa backend.",
  },
  {
    key: "NEXT_PUBLIC_BASE_URL",
    description: "Use the public URL of this storefront.",
  },
]

function checkEnvVariables() {
  const missingEnvs = requiredEnvs.filter(function (env) {
    return !process.env[env.key];
  })

  if (missingEnvs.length > 0) {
    console.error(
      c.red.bold("\n🚫 Error: Missing required environment variables\n")
    );

    missingEnvs.forEach(function (env) {
      console.error(c.yellow(`  ${c.bold(env.key)}`));
      if (env.description) {
        console.error(c.dim(`    ${env.description}\n`));
      }
    });

    console.error(
      c.yellow(
        "\nPlease set these variables in your .env file or environment before starting the application.\n"
      )
    );

    throw new Error("Missing required storefront environment variables.")
  }

  for (const key of [
    "NEXT_PUBLIC_MEDUSA_BACKEND_URL",
    "NEXT_PUBLIC_BASE_URL",
  ]) {
    let url

    try {
      url = new URL(process.env[key])
    } catch {
      throw new Error(`${key} must be a valid URL.`)
    }

    if (!["http:", "https:"].includes(url.protocol)) {
      throw new Error(`${key} must use HTTP or HTTPS.`)
    }

  }
}

module.exports = checkEnvVariables;
