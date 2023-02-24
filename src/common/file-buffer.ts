export default class FileLineBuffer{
    
    private lineBuffer: string[] = [];
    private lastLineIsIncomplete: boolean = false;
    private lastLine:string|undefined;

    constructor(){
        this.lineBuffer = [];
        this.lastLineIsIncomplete = false;
        this.lastLine = undefined;
    }

    fillBuffer(rawFile:string){
        this.lineBuffer = [];
        if(!rawFile){
            return;
        }

        this.lineBuffer = rawFile.split("\n");
        if(this.isLastLineIncomplete()){
            this.lineBuffer[0] = this.lastLine + this.lineBuffer[0];
        }

        this.lastLine = this.lineBuffer[this.lineBuffer.length - 1];
        this.lastLineIsIncomplete = this.lastLine.indexOf("\r") == -1;
    }

    empty(){
        this.lineBuffer = [];
        this.lastLineIsIncomplete = false;
        this.lastLine = undefined;
    }
    
    isLastLineIncomplete():boolean{
        return this.lastLineIsIncomplete;
    }

    getLine(): string|undefined{

        if(this.isEmpty()){
            return undefined;
        }

        return this.lineBuffer.shift();
    }

    isEmpty():boolean{
        return this.lineBuffer.length == 0 || (this.lineBuffer.length == 1 && this.isLastLineIncomplete());
    }
}