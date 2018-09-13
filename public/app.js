$(document).ready(function() {
  $(document).on("click", ".article", function() {
    // openNav();
    // Empty the notes from the note section
    // $("#notes").empty();
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
        const $notes = $("#notes");
        console.log(article);
        $("#articleTitle").html(`${article[0].title}`);
        // $notes.append(`<button class='btn btn-dark thin data-id='${article._id}' id='savenote'>Save Note</button>`);
        // If there's a note in the article
        if (article.note) {
          // Place the title of the note in the title input
          $("#titleinput").val(article.note.title);
          // Place the body of the note in the body textarea
          $("#bodyinput").val(article.note.body);
        }
      });
  });
});
