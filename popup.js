document.addEventListener("DOMContentLoaded", () => {
  // Retrieve course data
  chrome.storage.local.get("courseData", (data) => {
    if (!data.courseData) {
      return;
    }
    console.log("Retrieved course data", data);
    const { grades, name, abbrev } = data.courseData;
    console.log("Grades:", grades);
    console.log("Name:", name);
    console.log("Abbrev:", abbrev);

    // Display course name
    if (name) {
      const title = document.getElementById("title");
      if (abbrev) {
        title.textContent = `${abbrev} - ${name}`;
      } else {
        title.textContent = name;
      }
    }

    // Populate term and instructor filters
    populateFilters(grades);

    // Display initial grade distribution (cumulative)
    if (grades && grades.cumulative) {
      displayChart(grades.cumulative);
    }

    // Add event listeners for filters
    document.getElementById("termFilter").addEventListener("change", () => {
      updateInstructorFilter(grades);
      applyFilters(grades);
    });

    document.getElementById("instructorFilter").addEventListener("change", () => {
      updateTermFilter(grades);
      applyFilters(grades);
    });
  });
});

function populateFilters(grades) {
  const termFilter = document.getElementById("termFilter");
  const instructorFilter = document.getElementById("instructorFilter");

  // Populate term filter
  const terms = [...new Set(grades.courseOfferings.map(offering => offering.termCode))];
  terms.forEach(term => {
    const option = document.createElement("option");
    option.value = term;
    option.textContent = term;
    termFilter.appendChild(option);
  });

  // Populate instructor filter
  const instructors = [...new Set(grades.courseOfferings.flatMap(offering => offering.sections.flatMap(section => section.instructors.map(instructor => instructor.name))))];
  instructors.forEach(instructor => {
    const option = document.createElement("option");
    option.value = instructor;
    option.textContent = instructor;
    instructorFilter.appendChild(option);
  });
}

function updateInstructorFilter(grades) {
  const selectedTerm = document.getElementById("termFilter").value;
  const instructorFilter = document.getElementById("instructorFilter");

  // Clear existing options
  instructorFilter.innerHTML = '<option value="all">All Instructors</option>';

  if (selectedTerm === "all") {
    // If "All Terms" is selected, show all instructors
    const instructors = [...new Set(grades.courseOfferings.flatMap(offering => offering.sections.flatMap(section => section.instructors.map(instructor => instructor.name))))];
    instructors.forEach(instructor => {
      const option = document.createElement("option");
      option.value = instructor;
      option.textContent = instructor;
      instructorFilter.appendChild(option);
    });
  } else {
    // Filter instructors by selected term
    const instructors = [...new Set(grades.courseOfferings
      .filter(offering => offering.termCode === selectedTerm)
      .flatMap(offering => offering.sections.flatMap(section => section.instructors.map(instructor => instructor.name))))];
    instructors.forEach(instructor => {
      const option = document.createElement("option");
      option.value = instructor;
      option.textContent = instructor;
      instructorFilter.appendChild(option);
    });
  }
}

function updateTermFilter(grades) {
  const selectedInstructor = document.getElementById("instructorFilter").value;
  const termFilter = document.getElementById("termFilter");

  // Clear existing options
  termFilter.innerHTML = '<option value="all">All Terms</option>';

  if (selectedInstructor === "all") {
    // If "All Instructors" is selected, show all terms
    const terms = [...new Set(grades.courseOfferings.map(offering => offering.termCode))];
    terms.forEach(term => {
      const option = document.createElement("option");
      option.value = term;
      option.textContent = term;
      termFilter.appendChild(option);
    });
  } else {
    // Filter terms by selected instructor
    const terms = [...new Set(grades.courseOfferings
      .filter(offering => offering.sections.some(section => section.instructors.some(instructor => instructor.name === selectedInstructor)))
      .map(offering => offering.termCode))];
    terms.forEach(term => {
      const option = document.createElement("option");
      option.value = term;
      option.textContent = term;
      termFilter.appendChild(option);
    });
  }
}

function applyFilters(grades) {
  const selectedTerm = document.getElementById("termFilter").value;
  const selectedInstructor = document.getElementById("instructorFilter").value;

  let filteredGrades = { cumulative: { aCount: 0, abCount: 0, bCount: 0, bcCount: 0, cCount: 0, dCount: 0, fCount: 0 } };

  grades.courseOfferings.forEach(offering => {
    console.log("selectedTerm", selectedTerm);
    // console.log("selectedInstructor", selectedInstructor);
    console.log("offering", offering.termCode);
    if (selectedTerm === "all" || String(offering.termCode) === selectedTerm) {
      offering.sections.forEach(section => {
        if (selectedInstructor === "all" || section.instructors.some(instructor => instructor.name === selectedInstructor)) {
          filteredGrades.cumulative.aCount += section.aCount || 0;
          filteredGrades.cumulative.abCount += section.abCount || 0;
          filteredGrades.cumulative.bCount += section.bCount || 0;
          filteredGrades.cumulative.bcCount += section.bcCount || 0;
          filteredGrades.cumulative.cCount += section.cCount || 0;
          filteredGrades.cumulative.dCount += section.dCount || 0;
          filteredGrades.cumulative.fCount += section.fCount || 0;
        }
      });
    }
  });

  displayChart(filteredGrades.cumulative);
}

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
      borderWidth: 1,
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

  // Destroy existing chart if it exists
  if (window.gradeChart && typeof window.gradeChart.destroy === 'function') {
    window.gradeChart.destroy();
  }

  // Create new chart and store it in window.gradeChart
  window.gradeChart = new Chart(ctx, config);
}