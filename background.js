chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "COURSE_GRADE") {
        console.log("Relaying course grade data to popup.js:", request.grades);
        
        // Store the data so popup.js can retrieve it when it opens
        chrome.storage.local.set({ courseGrades: request.grades });
    }
});
