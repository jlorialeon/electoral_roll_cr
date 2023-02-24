import mysql from 'mysql';
import DAOBase from '../dao/dao-base';
import Census from './census';

export default class CensusDAO extends DAOBase{

    constructor(connectionString: string) {
        super(connectionString);
    }

    async AddOrUpdate(census: Census): Promise<void> {
        let parameters = [census.id, census.name, census.lastName, census.secondLastName];
        super.executeNonQuery('INSERT INTO national_electoral_census (id, name, last_name, second_last_name) VALUES (?, ?, ?, ?)', parameters);
    }

}