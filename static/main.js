
$(document).ready(()=>{
    let logo_icon =  document.getElementById("logo-icon");
    let floating_footer = document.getElementById("page-footer");
    let panel_up = true;

    logo_icon.addEventListener('click',()=>{
        rect = floating_footer.getBoundingClientRect();
        panel_up = ! panel_up;

        if (panel_up){
            floating_footer.style.bottom = "0px";

        }else {
            floating_footer.style.bottom = "-100px";
        }
    });


    let file_upload_btn = document.getElementById("file-upload");
    file_upload_btn.addEventListener("input",(data)=>{
        let upload_file = data.target.files;
        if (upload_file){
            let formdata = new FormData();
            formdata.append("file",upload_file[0]);

            $.ajax({
                url:"/upload-files",
                type:"POST",
                async:false,
                cache:false,
                processData:false,
                contentType:false,
                data:formdata,
                enctype:"multipart/form-data",
                success:(response)=>{
                    if (response.messageCode==1){
                        do_refresh();
                    }
                }
            });
        }
    });

    function do_refresh(){
        $.ajax({
            url:"/get-all-files",
            type:"GET",
            success:(data)=>{
                
                let items_container = document.getElementById("page-main-side-content");
                let current_items = items_container.getElementsByClassName("item");

                $("#page-main-side-content").empty();

                items_container.innerHTML += `
                
                <div id="page-main-side-content-header">
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-check-all" viewBox="0 0 16 16">
                        <path d="M8.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L2.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093L8.95 4.992a.252.252 0 0 1 .02-.022zm-.92 5.14.92.92a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 1 0-1.091-1.028L9.477 9.417l-.485-.486-.943 1.179z"/>
                    </svg>
                    <h1 style="width:max-content;">All Files</h1>
                    <input type="text" placeholder="Search Files...">
                </div>

                `
                
                data.files.forEach(new_item =>{
                    let new_element = 
                    `<div class="item" id="item-${new_item.unique_hash}">
                        <div class="item-header">
                            <span>${new_item.filename}</span>
                            <span>${new_item.filesize}</span>
                        </div>
                        <div class="item-body">
                            <label>${new_item.extension}</label>
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-clock-fill" viewBox="0 0 16 16">
                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
                                </svg>
                                <span>${new_item.created_at}</span>
                            </div>
                        </div>
                        <div class="item-footer">
                            <!-- Download Icon -->
                            <div class="menu-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-cloud-arrow-down-fill" viewBox="0 0 16 16">
                                    <path d="M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2zm2.354 6.854-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 9.293V5.5a.5.5 0 0 1 1 0v3.793l1.146-1.147a.5.5 0 0 1 .708.708z"/>
                                </svg>
                                <span>Download</span>
                            </div>
                            <div class="menu-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-share-fill" viewBox="0 0 16 16">
                                    <path d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5z"/>
                                </svg>
                                <span>Share</span>
                            </div>
                            
                            <div class="menu-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                                    <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                                </svg>
                                <span>Delete</span>
                            </div>
                        </div>
                    </div>` 
                    items_container.innerHTML += new_element
                    
                    let new_element_object = $("item-"+new_item.unique_hash);
                    new_element_object.on("click",(evt)=>{console.log("clicked");alert("this is it")})
                });
                
            },
            error:(error)=>{
                console.log("An Error occurred "+error);
            }
        });
    }
    // Get all files on server
    do_refresh();

    
});
