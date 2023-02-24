import Census from "./census";
import CensusDAO from "./census-dao";

export class CensusSQLRepository{

    censusDAO:CensusDAO;

    constructor(censusDAO:CensusDAO){
        this.censusDAO = censusDAO;
    }
        
    async AddOrUpdate(census: Census): Promise<void> {
        
    }

}