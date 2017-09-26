$(document).ready(function() {
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyD9VIgUH1MY3n8M4kMSvJet8CSIxwJ9F4s",
    authDomain: "bishr-demo.firebaseapp.com",
    databaseURL: "https://bishr-demo.firebaseio.com",
    projectId: "bishr-demo",
    storageBucket: "bishr-demo.appspot.com",
    messagingSenderId: "323764653078"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  var name = "";
  var destination = "";
  var time = "";
  var frequency = 0;
  $("#add-user").on("click", function(event) {
    console.log("clicked");
    event.preventDefault();

    name = $("#name-input")
      .val()
      .trim();
    destination = $("#destination-input")
      .val()
      .trim();

    time = $("#time-input")
      .val()
      .trim();

    frequency = $("#freq-input")
      .val()
      .trim();

    // Code for handling the push
    database.ref().push({
      name: name,
      destination: destination,
      time: time,
      frequency: frequency,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
  });

  database
    .ref()
    .orderByChild("dateAdded")
    .on(
      "child_added",
      function(snapshot) {
        // storing the snapshot.val() in a variable for convenience
        var sv = snapshot.val();

        name = sv.name;
        destination = sv.destination;
        firstTime = sv.time;
        frequency = sv.frequency;
        //Calculate the time for the next train
        var firstTimeConverted = moment(firstTime, "hh:mm").subtract(
          1,
          "years"
        );

        var currentTime = moment();

        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

        var tRemainder = diffTime % frequency;
        console.log(tRemainder);

        var tMinutesTillTrain = frequency - tRemainder;

        // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");
        nextTrain2 = moment(nextTrain).format("hh:mm");

        // Change the HTML to reflect
        var table = document.getElementById("myTable");
        $("#myTable tr:last").after(
          "<tr><td>" +
            name +
            "</td><td>" +
            destination +
            "</td><td>" +
            frequency +
            "</td><td>" +
            nextTrain2 +
            "</td><td>" +
            tMinutesTillTrain +
            "</td>" +
            "</tr>"
        );
      },
      function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
      }
    );
});
