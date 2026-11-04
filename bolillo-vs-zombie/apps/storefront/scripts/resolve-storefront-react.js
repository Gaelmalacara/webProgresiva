const Module = require("node:module")
const path = require("node:path")

const storefrontManifest = path.resolve(__dirname, "..", "package.json")
const storefrontModule = new Module(storefrontManifest)
storefrontModule.filename = storefrontManifest
storefrontModule.paths = Module._nodeModulePaths(path.dirname(storefrontManifest))

const resolveFilename = Module._resolveFilename

Module._resolveFilename = function (request, parent, isMain, options) {
  if (typeof request === "string" && /^(react|react-dom)(\/|$)/.test(request)) {
    return resolveFilename.call(this, request, storefrontModule, isMain, options)
  }

  return resolveFilename.call(this, request, parent, isMain, options)
}
