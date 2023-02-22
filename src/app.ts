import fs from "fs"
import path from "path"
import {Settings} from "./settings/settings"

const settingsFileName = path.resolve(__dirname,"settings.json");
var fileContent = await fs.readFileSync(settingsFileName).toString();
var settings:Settings = JSON.parse(fileContent);

console.log(settings);