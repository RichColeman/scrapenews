// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<div").addClass("col-md-12");
    $("#articles").append("<p data-id='" + data[i]._id + "' target='#notes'>" + data[i].title + "<br />" + "<a href=" + data[i].link + ">" + data[i].link +"</a></p>");
  }
});

// Whenever someone clicks a p tag
$(document).on("click", "p", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  let thisId = $(this).attr("data-id");


  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      // The title of the article

      $("#notes").append("<div>").addClass("col-md-12");
      $("#notes").append("<h2>").addClass("i").text("Add a note!");
      $("#notes").append("<h2>" + data.title + "</h2><br>");
      // An input to enter a new title
      $("#notes").append("<h3>Title of Note</h3><br><input id='titleinput' name='title' ><br>");
      // A textarea to add a new note body
      $("#notes").append("<h3>Body</h3><br><textarea id='bodyinput' name='body'></textarea><br>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
      $("#notes").append("<button data-id='" + data._id + "' id='deletenote'>Delete Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
      $([document.documentElement, document.body]).animate({
        scrollTop: $("#notes").offset().top
    }, 2000);
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function () {
  // Grab the id associated with the article from the submit button
  let thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  $(document).on("click", "#deletenote", function () {
    console.log("baleeted")
    let thisID = $(this).attr("data-id");
    $.ajax({
      method: "DELETE",
      url: "/articles/" + thisID
    })
      // With that done, add the note information to the page
      .then(function (data) {
        $("#titleinput").val("");
        $("#bodyinput").val("");
      });
  });
  
  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
