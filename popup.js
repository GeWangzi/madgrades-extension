chrome.storage.local.get("currentUrl", (data) => {
    if (data.currentUrl) {
        document.getElementById("urlDisplay").textContent = "Current URL: " + data.currentUrl;
    } else {
        document.getElementById("urlDisplay").textContent = "No URL found.";
    }
});

/////////////////////////////

document.getElementById('myButton').addEventListener('click', function() {
    console.log('Button clicked!');

    if (getCourseName) {
        document.getElementById("nameDisplay").textContent = "Current name: " + getCourseName();
    } else {
        document.getElementById("nameDisplay").textContent = "No name found.";
    }
    
  });
  
//////////////////////////////////////////////
//ATTEMPS TO EXRACT COURSE NAME (NEEDS TO BE IN content.js TO WORK)
function getCourseName() {
    // Check if an <h2> element exists before trying to access its text
    const name = document.querySelector('h2');
    if (name) {
      console.log(name);
      // Send extracted text to background script
      return { text: name.innerText };
    } else {
      console.log("No name found.");
    }
  }

////////////////////////////////////////////////
///(WORKS)
async function pullGrade(courseName) {

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
