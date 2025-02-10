(()=>{
    chrome.runtime.onMessage.addListener((obj,sender,response)=>{
        const {courseName}=obj;
    });

    if (courseName==="NEW"){
        
    }
})