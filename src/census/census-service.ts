import { CensusSQLRepository } from "./census-sql-repository";
import appSettings from "../settings/settings"
import fs from 'fs';
import FileManager from "../common/file-manager";
import Census  from "./census";
import FileHeaders from "../settings/column-mapping-settings";

export default class CesusService {

    fileManager: FileManager;
    filename:string;
    fileHeaders:FileHeaders;

    constructor() {
        this.filename = appSettings.filename;
        this.fileHeaders = appSettings.fileHeaders;
        this.fileManager = new FileManager();
    }

    async UpdateCensusAsync(): Promise<void> {

        this.fileManager.openFile(this.filename);
        for(let i = 0; i < 6; i++){
            let row = await this.fileManager.readLine();
            console.log(await this.parseCensusAsync(row));
        }
    }

    private async parseCensusAsync(row:string|undefined): Promise<Census> {
        return new Promise<Census>((resolve, reject) => {

            if (row === undefined) {
                return undefined;
            }

            let column = row?.replace("\r","")?.split(",");

            if(column.length < 7){
                reject(`Invalid row ${row}`);
            }

            let census: Census = {
                id: column[this.fileHeaders.id].trimEnd(),
                name: column[this.fileHeaders.name].trimEnd(),
                lastName: column[this.fileHeaders.lastName].trimEnd(),
                secondLastName: column[this.fileHeaders.secondLastName].trimEnd()
            }
            resolve(census);
        });
    }

}