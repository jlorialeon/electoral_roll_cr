import fs from "fs"
import path from "path"
import CesusService from "./census/census-service";
import appSettings from "./settings/settings"

const censusService = new CesusService();
await censusService.UpdateCensusAsync();
