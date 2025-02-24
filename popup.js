// popup.js
document.addEventListener("DOMContentLoaded", () => {
  //updates graph
  chrome.storage.local.get("courseData", (data) => {
    if (!data.courseData) {
      return;
    }
    console.log("Retrieved course data", data);
    const { grades, name, abbrev } = data.courseData;
    console.log("Grades:", grades);
    console.log("Name:", name);
    console.log("Abbrev:", abbrev);

    //display course name
    if (name) {
      const title = document.getElementById("title")
      if (abbrev) {
        title.textContent = `${abbrev} - ${name}`;
      } else {
        title.textContent = name;
      }
    }

    //display grade distribution
    if (grades && grades.cumulative) {
      displayChart(grades.cumulative);
    }
  });
});

function displayChart(grades) {
  const ctx = document.getElementById("gradesChart").getContext("2d");
  console.log("Grades:", grades);
  const labels = ["A", "AB", "B", "BC", "C", "D", "F"];
  const values = [
    grades.aCount || 0,
    grades.abCount || 0,
    grades.bCount || 0,
    grades.bcCount || 0,
    grades.cCount || 0,
    grades.dCount || 0,
    grades.fCount || 0
  ];
  console.log("Values", values);

  const data = {
    labels: labels,
    datasets: [{
      label: "Grade Distribution",
      data: values,
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(255, 205, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(201, 203, 207, 0.2)'
      ],
      borderColor: [
        'rgb(255, 99, 132)',
        'rgb(255, 159, 64)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)',
        'rgb(54, 162, 235)',
        'rgb(153, 102, 255)',
        'rgb(201, 203, 207)'
      ],
      boarderWidth: 1,
    }]
  };

  const config = {
    type: 'bar',
    data: data,
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    },
  };

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Grade Distribution",
        data: values,
        backgroundColor: ["#4CAF50", "#8BC34A", "#FFEB3B", "#FF9800", "#FF5722", "#F44336", "#795548"]
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}


function jsonToGPA(json) {
  if (!json || !json.cumulative) {
    throw new Error("Invalid JSON structure");
  }

  const { total, aCount, abCount, bCount, bcCount, cCount, dCount, fCount } = json.cumulative;

  if (total === 0) {
    return [0, 0, 0, 0, 0, 0, 0];
  }

  const gradeCounts = [aCount, abCount, bCount, bcCount, cCount, dCount, fCount];

  return gradeCounts.map(count => count / total);
}
