from pathlib import Path
import os
from uuid import uuid4
from datetime import datetime


def get_dir_files(path,is_file=False):
    if not is_file:
        all_files = os.listdir(f"{path}/")
        files = []
        for file in all_files:
                file_object = Path(os.path.join(path,file))

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
                    "server_path":os.path.join(path,file),
                    "filesize":filesize,
                    "unique_hash":uuid4().hex
                }
                files.append(temp)
    else:
        try:
            file_object = Path(path)
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

            return {
                "filename":filename,
                "extension":extension,
                "created_at":creation_date,
                "server_path":os.path.join(path),
                "filesize":filesize,
                "unique_hash":uuid4().hex
            }
        except FileNotFoundError:
            return None

    return files