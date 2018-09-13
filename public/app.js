$(document).on("click", ".card", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");
  console.log(thisId)
  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(article) {
      console.log(article);
      // The title of the article
      $("#notes").append("<h2>" + article[0].title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + article._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (article.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(article.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(article.note.body);
      }
    });
});