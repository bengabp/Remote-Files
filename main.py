from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from enum import Enum

import os
from pathlib import Path
from datetime import datetime
from uuid import uuid4

BASE_DIR = Path(os.path.abspath(__file__))

app = FastAPI()
app.mount("/static",StaticFiles(directory='static'),name="static")

templates = Jinja2Templates(directory="templates")

FILES_UPLOAD_FOLDER = "server_files"

class ErrorCodes(Enum):
    UPLOADED_SUCCESSFULLY = 1
    FAILED_UPLOADING = -1

@app.get("/",response_class=HTMLResponse)
async def index(request:Request):
    return templates.TemplateResponse("index.html",{'request':request})


@app.get("/get-all-files")
async def get_all_files(request:Request):
    all_files = os.listdir(f"{FILES_UPLOAD_FOLDER}/")
    files = []

    for file in all_files:
        file_object = Path(os.path.join(FILES_UPLOAD_FOLDER,file))

        filename,extension = file_object.name,file_object.suffix
        file_stats = file_object.stat()
        
        filesize = file_stats.st_size
        
        if filesize < 1000:
            filesize = f"{round(filesize,1)}B"
        elif filesize < 1000000:
            filesize = f"{round(filesize/1000,1)}KB"
        elif filesize < 1000000000:
            filesize = f"{round(filesize/1000000,1)}MB"
        else:
            filesize = f"{round(filesize/1000000000,1)}GB"
        
        creation_date = file_stats.st_ctime
        creation_date = datetime.utcfromtimestamp(creation_date).strftime("%b %d, %I:%M %p %Y")

        temp = {
            "filename":filename,
            "extension":extension,
            "created_at":creation_date,
            "url":"https://python.org",
            "server_path":os.path.join(FILES_UPLOAD_FOLDER,file),
            "filesize":filesize,
            "unique_hash":uuid4().hex
        }
        files.append(temp)

    return {
            'message':'Got all files',
            'messageCode':1,
            'files':files
        }


@app.post("/")
async def upload_files(request:Request):
    file =  await request.form()
    file = file.get("file")

    try:
        print("Saving file on server..")
        filename = file.filename
        with open(f"{FILES_UPLOAD_FOLDER}/{filename}","wb") as uploading:
            uploading.write(file.file.read())
            print("Saved file..")
            
        return {
            'message':f'{filename} was uploaded',
            'messageCode':1
        }
    except AttributeError:
        return {
                'message':f'{filename} is not a file',
                'messageCode':-1,
            }

@app.delete("/{filename}")
async def delete_file(request:Request,filename:str):
    message = None
    messageCode = -1

    try:
        os.remove(f"{FILES_UPLOAD_FOLDER}/{filename}")
        message = "File deleted"
        messageCode = 1

    except FileNotFoundError:
        message = "File not found"
        messageCode = -1

    return {
        "message":message,
        "messageCode":messageCode
    }