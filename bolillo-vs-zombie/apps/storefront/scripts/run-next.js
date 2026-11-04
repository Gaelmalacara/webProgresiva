const { spawnSync } = require("node:child_process")
const path = require("node:path")

const nextCli = require.resolve("next/dist/bin/next")
const reactResolver = path
  .resolve(__dirname, "resolve-storefront-react.js")
  .replace(/\\/g, "/")

const result = spawnSync(process.execPath, [nextCli, ...process.argv.slice(2)], {
  env: {
    ...process.env,
    NODE_OPTIONS: [
      process.env.NODE_OPTIONS,
      `--require="${reactResolver}"`,
    ]
      .filter(Boolean)
      .join(" "),
  },
  stdio: "inherit",
})

if (result.error) {
  throw result.error
}

process.exit(result.status ?? 1)
