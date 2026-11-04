const { spawn } = require("node:child_process")

const medusaCli = require.resolve("@medusajs/cli/cli.js")
const port = process.env.PORT || "9000"
const medusa = spawn(
  process.execPath,
  [medusaCli, "start", "--host", "0.0.0.0", "--port", port],
  { stdio: "inherit" }
)

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => medusa.kill(signal))
}

medusa.on("error", (error) => {
  console.error("Failed to start Medusa:", error)
  process.exitCode = 1
})

medusa.on("exit", (code, signal) => {
  process.exitCode =
    signal === "SIGINT" || signal === "SIGTERM" ? 0 : (code ?? 1)
})
