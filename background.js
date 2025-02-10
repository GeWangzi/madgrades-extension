
async function gradePuller(courseName) {

        courseName = courseName.replace(/ /g, ""); // Removes all spaces

        let url = "https://api.madgrades.com/v1/courses?query=" + courseName;
        const token = "";
        //GET call for UUID
        const courseData = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Token token=${token}`,
                "Content-Type": "application/json"
            }
        });
        
        if (!courseData.ok) {
            throw new Error(`HTTP error! status: ${courseData.status}`);
        }
        
        const data = await courseData.json();

        //Grabs UUID
        console.log(data)
        const uuid = data.results[0].uuid;
        console.log(uuid);

        let uuidURL = "https://api.madgrades.com/v1/courses/" + uuid + "/grades"

        //GET call for UUID
        const courseGrades = await fetch(uuidURL, {
            method: "GET",
            headers: {
                "Authorization": `Token token=${token}`,
                "Content-Type": "application/json"
            }
        });
        
        if (!courseGrades.ok) {
            throw new Error(`HTTP error! status: ${courseGrades.status}`);
        }

        const grades = await courseGrades.json();
        
        console.log(grades)
    };

gradePuller("cs200");