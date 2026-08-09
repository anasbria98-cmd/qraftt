import {
  cpSync,
  existsSync,
  mkdirSync,
  renameSync,
  rmSync,
} from "node:fs";

const workerPath = ".sites-worker/worker.js";

if (!existsSync(workerPath)) {
  throw new Error("The bundled Sites worker was not created.");
}

rmSync("dist", { force: true, recursive: true });
mkdirSync("dist/server", { recursive: true });
cpSync(".sites-worker", "dist/server", { recursive: true });
renameSync("dist/server/worker.js", "dist/server/index.js");
cpSync(".open-next/assets", "dist/assets", { recursive: true });
rmSync(".sites-worker", { force: true, recursive: true });
