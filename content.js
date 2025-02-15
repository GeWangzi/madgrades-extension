//Usefull
console.log("Hi from console!")

// content.js
const observer = new MutationObserver(() => {
    console.log(document.documentElement.outerHTML);

    const element = document.querySelector("h2");
    if (element) {
        console.log("Text Content:", element.textContent);
    }
    else {
        console.log("Element not found.");
    }

  });
  
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
  