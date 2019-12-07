// Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyCe9d8_eP-mSyo0HBHjfJ1VIco8vydwzU8",
  authDomain: "train-scheduler-daa21.firebaseapp.com",
  databaseURL: "https://train-scheduler-daa21.firebaseio.com",
  projectId: "train-scheduler-daa21",
  storageBucket: "train-scheduler-daa21.appspot.com",
  messagingSenderId: "604453159038",
  appId: "1:604453159038:web:eb4e6916545dedd3d1582f",
  measurementId: "G-DCZ8KB3C7E"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();



var database = firebase.database();

// 2. Button for adding Trains
$("#add-train-btn").on("click", function (event) {
  event.preventDefault();

  // Grabs user input
  var train = $("#train-name-input").val().trim();
  var destination = $("#destination").val().trim();
  var frequency = $("#frequency").val().trim();
  var firstTrainTime = $("#first-train-time").val().trim();

  // Creates local "temporary" object for holding train data
  var newTrain = {
    train: train,
    destination: destination,
    frequency: frequency,
    firstTrainTime: firstTrainTime,
  };

  // Uploads Train data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.train);
  console.log(newTrain.destination);
  console.log(newTrain.frequency);
  console.log(newTrain.firstTrainTime);

  alert("Train successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination").val("");
  $("#frequency").val("");
  $("#first-train-time").val("");

});

// 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot) {
  console.log(childSnapshot.val());

  // Store everything into a variable.
  var train = childSnapshot.val().train;
  var destination = childSnapshot.val().destination;
  var frequency = childSnapshot.val().frequency;
  var firstTrainTime = childSnapshot.val().firstTrainTime;
  var minutesAway = childSnapshot.val().minutesAway;

  // Train Info
  console.log(train);
  console.log(destination);
  console.log(frequency);
  console.log(firstTrainTime);
  console.log(minutesAway);

  // First Time (pushed back 1 year to make sure it comes before current time)
  var firstTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "years");
  console.log(firstTimeConverted);

  // Current Time
  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)
  var tRemainder = diffTime % frequency;
  console.log(tRemainder);

  // Minute Until Train
  var tMinutesTillTrain = frequency - tRemainder;
  console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

  // Next Train
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  var nextTrainFormat = moment(nextTrain).format("hh:mm")
  console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));


  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(train),
    $("<td>").text(destination),
    $("<td>").text(frequency),
    $("<td>").text(nextTrainFormat),
    $("<td>").text(tMinutesTillTrain),
  );

  // Append the new row to the table
  $("#train-table > tbody").append(newRow);


});


// Example Time Math
// -----------------------------------------------------------------------------
// Assume Train start date of January 1, 2015
// Assume current date is March 1, 2016

// We know that this is 15 months.
// Now we will create code in moment.js to confirm that any attempt we use meets this test case

