// load-env.ts
import { config } from "dotenv";
import { expand } from "dotenv-expand";
import { resolve } from "path";

expand(config({ path: resolve(process.cwd(), ".env.local") }));
expand(config({ path: resolve(process.cwd(), ".env") }));
