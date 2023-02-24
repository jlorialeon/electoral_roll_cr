import mysql from 'mysql';

export default class DAOBase {

    protected connectionString: string;

    constructor(connectionString: string) {
        this.connectionString = connectionString;
    }

    private open():mysql.Connection {
        let connection = mysql.createConnection(this.connectionString);
        connection.connect((err)=>console.log(err.message));
        return connection;
    }

    private close(connection:mysql.Connection):void {

        if(!connection || connection.state === 'disconnected'){
            return;
        }

        connection.end((err)=>{
            console.log(err?.message);
        });
    }

    protected async executeNonQuery(sql:string, params?:any[]):Promise<any> {
        let connection = this.open();
        try{
            connection.query(sql, params, (err, result)=>{
                if(err){
                    throw err;
                }
                return result;
            });
        }
        catch(err:any){
            throw err;
        }
        finally{
            this.close(connection);
        }
    }

}