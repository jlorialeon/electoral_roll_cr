import fs from "fs"
import FileLineBuffer from "./file-buffer";

export default class FileManager{

    private readonly BUFFER_SIZE:number = 4096;
    private filename:string;
    private fileHandler:number;
    private encoding:BufferEncoding;
    private IsOnEOF:boolean = false;
    private fileLineBuffer:FileLineBuffer;

    constructor(){
        this.filename = "";
        this.fileHandler = 0;
        this.encoding = "latin1";
        this.fileLineBuffer = new FileLineBuffer();
    }

    openFile(filename:string, encoding:BufferEncoding = "latin1"){
        this.filename = filename;
        this.closeFile();
        this.fileHandler = fs.openSync(this.filename, 'r');
        this.IsOnEOF = false;
    }

    closeFile(){
        this.clear();
        if(this.fileHandler){
            this.fileHandler = fs.openSync(this.filename, 'r');
        }
        this.fileHandler = 0;
    }

    private clear(){
        this.fileLineBuffer.empty();
    }

    async readLine():Promise<string|undefined>{

        if(this.allLinesWereRead()){
            return undefined;
        }
              
        return this.getFromBuffer();
    }

    private  async fillBufferAsync():Promise<void>{

        if(this.IsOnEOF){
            return;
        }

        let content = await this.readBytesAsync();
        if(content.EOF){
            this.IsOnEOF = true;
            this.closeFile();
            return;
        }

        let rawContent = content.content.toString(this.encoding).trimEnd();
        this.fileLineBuffer.fillBuffer(rawContent);
        if(!this.IsOnEOF && this.fileLineBuffer.isEmpty()){
            await this.fillBufferAsync();
        }
    }

    private async getFromBuffer():Promise<string|undefined>{

        if(this.allLinesWereRead()){
            return undefined;
        }

        if(this.fileLineBuffer.isEmpty() && !this.IsOnEOF){
            await this.fillBufferAsync();
        } 

        return this.fileLineBuffer.getLine();
    }


    private allLinesWereRead():boolean{
        return this.fileLineBuffer.isEmpty() && this.IsOnEOF
    }

    private async readBytesAsync() :Promise<ReadBytesResult> {
        
        return new Promise<ReadBytesResult>((resolve, reject) => {
            fs.read(this.fileHandler,Buffer.alloc(this.BUFFER_SIZE),0,this.BUFFER_SIZE,null,(errRead, bytesRead, buffer)=>{
                
                if(errRead){
                    reject(errRead);
                    return;
                }

                let result = new ReadBytesResult(buffer,bytesRead);
                resolve(result);
            });
        });
    }
}

class ReadBytesResult{

    content:Buffer;
    bytesRead:number;
    get EOF():boolean{
        return this.bytesRead == 0;
    }

    constructor(content:Buffer,bytesRead:number){
        this.content = content;
        this.bytesRead = bytesRead;
    }
}