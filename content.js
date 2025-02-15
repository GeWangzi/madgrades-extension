//Usefull
// console.log("Hi from console!")

// content.js
const observer = new MutationObserver(async () => {
  console.log(document.documentElement.outerHTML);

  const element = document.querySelector("h2");
  if (element) {
    console.log("Text Content:", element.textContent);
    const grades = await pullGrade(element.textContent);

    //send grade to backgroujnd.js
    chrome.runtime.sendMessage({ type: "COURSE_GRADE", grades: grades });
  }
  else {
    console.log("Element not found.");
  }

});

observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
});

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

