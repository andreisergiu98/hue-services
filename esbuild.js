const fs = require("fs");
const yargs = require("yargs");
const esbuild = require("esbuild");
const { pnpPlugin } = require("@yarnpkg/esbuild-plugin-pnp");
const { esbuildCommands } = require("esbuild-plugin-commands");

const packageConfig = JSON.parse(
  fs.readFileSync(process.cwd() + "/package.json", "utf-8")
);

const options = yargs(process.argv.slice(2))
  .option("dev", {
    alias: "d",
    type: "boolean",
    description: "Run in development mode",
  })
  .parse();

const { dev } = options;

function getExternals() {
  const map = packageConfig.dependencies ?? {};
  return Object.keys(map);
}

const mainPlugins = [pnpPlugin()];
const devPlugins = [esbuildCommands({ onSuccess: "yarn start:inspect" })];

const plugins = dev ? mainPlugins.concat(devPlugins) : mainPlugins;

esbuild
  .build({
    entryPoints: ["src/index.ts"],
    outdir: "dist",
    bundle: true,
    color: true,
    sourcemap: true,
    platform: "node",
    watch: dev,
    target: "node18",
    plugins,
    minify: true,
    treeShaking: true,
    external: dev ? getExternals() : undefined,
  })
  .catch(() => process.exit(1));
