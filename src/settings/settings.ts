
import fs from "fs"
import path from "path"
import FileHeaders from "./column-mapping-settings";
import DatabaseSettings from "./database-settings";

interface Settings{
    filename:string;
    fileHeaders:FileHeaders,
    databaseSettings:DatabaseSettings
}

async function GetSettingsAsync():Promise<Settings> {
    const fileContent = await fs.readFileSync(path.resolve(__dirname,"settings.json")).toString();
    return JSON.parse(fileContent) as Settings;
}

const appSettings:Settings = await GetSettingsAsync();

export default appSettings;