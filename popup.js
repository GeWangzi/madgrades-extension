////////////////////////////////////////////////
///(WORKS)
async function pullGrade(courseName) {

    courseName = courseName.replace(/ /g, ""); // Removes all spaces

    let url = "https://api.madgrades.com/v1/courses?query=" + courseName;
    const token = "bfc4b27f0b284ffbb1c6c3da7845f1ad ";
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
    // console.log(data)
    const uuid = data.results[0].uuid;
    // console.log(uuid);

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
    console.log(grades);

    return grades;
};

function jsonToGPA(json) {
    console.log("course", json)
    console.log("cumu",json.cumulative)
    const total = json.cumulative.total;
    const a = json.cumulative.aCount;
    const ab = json.cumulative.abCount;
    const b = json.cumulative.bCount;
    const bc = json.cumulative.bcCount;
    const c = json.cumulative.cCount;
    const d = json.cumulative.dCount;
    const f = json.cumulative.fCount;
    
    const gpaList = [];
    gpaList.push(a/total);
    gpaList.push(ab/total);
    gpaList.push(b/total);
    gpaList.push(bc/total);
    gpaList.push(c/total);
    gpaList.push(d/total);
    gpaList.push(f/total);

    return gpaList;
}

async function main() {
    try {
        const grades = await pullGrade("cs200"); // Wait for pullGrade to resolve
        // console.log("Grades:", grades);

        console.log(jsonToGPA(grades)); // Pass resolved data to jsonToGPA
    } catch (error) {
        console.error("Error fetching grades:", error);
    }
}

main();
