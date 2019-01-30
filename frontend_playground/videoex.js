/* GLOBALS */

// Declare a constant variable and set its 
// value to a string with your robot's IP address.
const ip = "10.9.22.79";

// Create a global constant called you 
// and assign it to a string with your name. 
const you = "andy"
// Initialize another variable called 
// onList and set its value to false.
let onList = false;

// Create a new instance of LightSocket called 
// socket. Pass as arguments the ip variable 
// and a function named openCallback.
let socket = new LightSocket(ip, openCallback);

/* TIMEOUT */

// Define a helper function called sleep that 
// can pause code execution for a period of time.
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* CALLBACKS */

// Define the function passed as the callback 
// to the new instance of LightSocket. This is 
// the code that executes when socket opens a 
// connection to your robot.
async function openCallback() {

  // Unsubscribe from any existing ComputerVision 
  // WebSocket connections.
  socket.Unsubscribe("ComputerVision");

  // Use sleep() to pause execution for 
  // three seconds to give Misty time 
  // to register and execute the command.
  await sleep(3000);

  // Issue a GET request to the endpoint 
  // for the GetLearnedFaces command. 
  // Use then() to pass the response 
  // to a callback function.
  axios.get("http://" + ip + "/api/beta/faces").then(function (res) {
    // Store the list of known faces in the
    // faceArr variable and print this list.
    let faceArr = res.data[0].result;
    console.log("Learned faces:", faceArr);

    // Loop through each item in faceArr. 
    // Compare each item to the value stored 
    // in the you variable.
    for (let i = 0; i < faceArr.length; i++) {
      // If a match is found, update 
      // the value of onList to true.
      if (faceArr[i] === you) {
        onList = true;
      }
    }

    // Subscribe to the ComputerVision WebSocket. 
    // Pass ComputerVision for the eventName and 
    // msgType parameters. Set debounceMs to 200 
    // and pass a callback function named _ComputerVision 
    // for the callback parameter. Pass null for 
    // all other arguments.
    socket.Subscribe("ComputerVision", "ComputerVision", 200, null, null, null, null, _ComputerVision);

    // Use an if, else statement to execute 
    // startFaceRecognition() if onList is true 
    // and to execute startFaceTraining if otherwise.
    if (onList) {
      console.log("You were found on the list!");
      startFaceRecognition();
    } else {
      console.log("You're not on the list...");
      startFaceTraining();
    }
  });
};

// Define the callback function for handling  
// ComputerVision event data.
function _ComputerVision(data) {
  // Wrap the code for the _ComputerVision callback 
  // inside try and catch statements. 
  try {
    // Use an if statement to check that personName 
    // does not equal "unknown person", null, or 
    // undefined. personName is included in the 
    // message returned by ComputerVision WebSocket events.
    if (data.message.personName !== "unknown person" && data.message.personName !== null && data.message.personName !== undefined) {
      // If the face is recognized, print a 
      // message to greet the person by name.
      console.log(`A face was recognized. Hello there ${data.message.personName}!`);

      // Unsubscribe from the ComputerVision WebSocket.
      socket.Unsubscribe("ComputerVision");
      // Use Axios to issue a POST command to the 
      // endpoint for the StopFaceRecognition command.
      axios.post("http://" + ip + "/api/beta/faces/recognition/stop");
    }
  }
  // Print any errors to the console.
  catch (e) {
    console.log("Error: " + e);
  }
};

/* COMMANDS */

// Define the function that executes 
// if the value stored in you is on 
// Misty's list of known faces. 
function startFaceRecognition() {
  // Print a message to the console that Misty 
  // is “starting face recognition”. Then, use 
  // Axios to send a POST request to the endpoint 
  // for the StartFaceRecognition command.
  console.log("starting face recognition");
  axios.post("http://" + ip + "/api/beta/faces/recognition/start");
};

// Define the function that executes 
// to learn the user's face if the 
// value stored in you is not on Misty's 
// list of known faces.
async function startFaceTraining() {
  // Print a message to the console that Misty 
  // is “starting face training”. Then use Axios 
  // to send a POST request to the endpoint for 
  // the StartFaceTraining command.
  console.log("starting face training");
  axios.post("http://" + ip + "/api/beta/faces/training/start", { FaceId: you });

  // Give Misty time to complete the face 
  // training process. Call sleep and pass 
  // in the value 20000 for 20 seconds. 
  await sleep(20000);
  // Print a message to the console that 
  // face training is complete.
  console.log("face training complete");
  // Use Axios to send a POST request to the endpoint 
  // for the StartFaceRecognition command.
  axios.post("http://" + ip + "/api/beta/faces/recognition/start");
};

// Open the connection to your robot. 
// When the connection is established, 
// the openCallback function executes 
// to check whether the value stored in 
// you is on Misty's list of known faces. 
// Then, the program subscribes to the 
// ComputerVision WebSocket, and Misty 
// either greets you by name or starts 
// facial training to learn your face so 
// she can greet you in the future.
socket.Connect();
