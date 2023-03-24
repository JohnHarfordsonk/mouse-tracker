// Set up variables

let data = {}; // Object to store mouse stop data

let cubes = []; // Array to store cube data

const NUM_CUBES = 64; // Number of cubes

let cubeSize; // Size of each cube

let pageWidth; // Width of the page

let pageHeight; // Height of the page

let timer; // Timer to track how long user stops at a position

// Get page size

pageWidth = window.innerWidth;

pageHeight = window.innerHeight;

// Divide page into cubes

cubeSize = Math.sqrt((pageWidth * pageHeight) / NUM_CUBES);

// Initialize cubes array

for (let i = 0; i < NUM_CUBES; i++) {

  cubes.push({ x: (i % 8) * cubeSize, y: Math.floor(i / 8) * cubeSize });

}

// Start tracking mouse movement

document.addEventListener("mousemove", function (event) {

  // Get coordinates of mouse position

  let x = event.clientX;

  let y = event.clientY;

  // Find which cube the mouse is in

  let cubeIndex = Math.floor(x / cubeSize) + Math.floor(y / cubeSize) * 8;

  // Check if cubeIndex is in the cubes array

  if (cubeIndex >= 0 && cubeIndex < cubes.length) {

    // Start timer if this is the first time in this cube

    if (!data[cubeIndex]) {

      data[cubeIndex] = { time: 0 };

    }

    if (!timer) {

      timer = setInterval(function () {

        data[cubeIndex].time += 1;

      }, 1000);

    }

  }

});

// Stop tracking mouse movement and save data when user leaves the page

window.addEventListener("beforeunload", function (event) {

  clearInterval(timer);

  saveData();

});

// Save data to JSON file

function saveData() {

  // Sort cubes by time in descending order

  let sortedCubes = Object.keys(data).sort(function (a, b) {

    return data[b].time - data[a].time;

  });

  // Create object to write to file

  let fileData = {

    pageWidth: pageWidth,

    pageHeight: pageHeight,

    cubeSize: cubeSize,

    cubes: sortedCubes.map(function (cube) {

      return { x: cubes[cube].x, y: cubes[cube].y, time: data[cube].time };

    }),

  };

  // Write object to JSON file

  let jsonString = JSON.stringify(fileData);

  let blob = new Blob([jsonString], { type: "application/json" });

  let url = URL.createObjectURL(blob);

  let link = document.createElement("a");

  link.download = "mouse_data.json";

  link.href = url;

  link.click();

}

