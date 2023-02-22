interface Settings{
    filename:string;
    fileHeaders:FileHeaders
}

interface FileHeaders {
    "id":0,
    "name":4,
    "lastName":5,
    "secondLastName":6
}

export {Settings, FileHeaders}