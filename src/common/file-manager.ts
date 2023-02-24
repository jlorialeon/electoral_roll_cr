import fs from "fs"

export default class FileManager{

    private readonly BUFFER_SIZE:number = 4096;
    private filename:string;
    private fileHandler:number;
    private encoding:BufferEncoding;
    private linesBuffer:string[] = [];
    private IsOnEOF:boolean = false;

    constructor(){
        this.filename = "";
        this.fileHandler = 0;
        this.encoding = "latin1";
        this.linesBuffer = [];
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
        this.linesBuffer = [];
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

        const isLastLineIncomplete = this.isLastLineIncomplete();
        let lastLine:string|undefined = "";
        if(this.linesBuffer.length > 0){
            lastLine = this.linesBuffer.pop();
        }

        let rawContent = content.content.toString(this.encoding).trimEnd();
        this.linesBuffer = rawContent.split("\n");
        if(isLastLineIncomplete && this.linesBuffer.length > 0){
            this.linesBuffer[0] = lastLine + this.linesBuffer[0];
        }
    }

    private async getFromBuffer():Promise<string|undefined>{

        if(this.allLinesWereRead()){
            return undefined;
        }

        if(this.bufferWasRead() || this.isLastLineIncomplete()){
            await this.fillBufferAsync();
        }

        if(this.linesBuffer.length == 0){
            return undefined;
        }    

        return this.linesBuffer.shift();
    }

    private bufferWasRead():boolean{
        return this.linesBuffer.length == 0 && !this.IsOnEOF;
    }

    private isLastLineIncomplete():boolean{
        return this.linesBuffer.length > 0 && this.linesBuffer.length == 1 && this.linesBuffer[0].indexOf("\r") == -1 && !this.IsOnEOF;
    }

    private allLinesWereRead():boolean{
        return this.IsOnEOF && this.linesBuffer.length == 0;
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