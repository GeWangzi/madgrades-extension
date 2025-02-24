chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "COURSE_GRADE") {
        console.log("Relaying course grade data to popup.js:", request.grades);
        //Seperates Name and Grades
        const {grades, name, abbrev} = request.grades
        // Store the data so popup.js can retrieve it when it opens
        let courseData = {
            abbrev: abbrev,
            name: name,
            grades: grades
        }
        chrome.storage.local.set({ courseData });
    }
});
