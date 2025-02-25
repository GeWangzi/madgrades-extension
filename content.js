const observer = new MutationObserver(async () => {
  let courseName = null;

  const h2 = document.querySelector("h2");
  if (h2) {
    courseName = h2.textContent;
    console.log("Course name:", courseName);
  }
  
  const elements = document.querySelectorAll("mat-toolbar span");

  if (elements.length > 0) {
    const filteredElements = Array.from(elements).filter(e => /\d$/.test(e.textContent));
    if (filteredElements.length !== 0) {
      console.log("Detected elements:", Array.from(filteredElements).map(e=>{
        return e.textContent;
      }));
      courseName = filteredElements[0].textContent;
    }
  }

  if (courseName) {
    console.log("Course name:", courseName);
    const grades = await pullGrade(courseName);
    grades.abbrev = courseName;
    chrome.runtime.sendMessage({ type: "COURSE_GRADE", grades });
  }
  else {
    console.log("No course name detected");
  }
});

observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
});

async function pullGrade(courseName) {

  let url = "https://api.madgrades.com/v1/courses?query=" + courseName;
  const token = "257a7f2a18f84e76a28c25fbb72495a5 ";
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

  const name = data.results[0].name;
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
  // console.log(grades);

  return {grades: grades, name: name};
};

