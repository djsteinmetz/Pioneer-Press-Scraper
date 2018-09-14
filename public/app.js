$(document).ready(function () {
  $(document).on("click", ".article", function () {
    // openNav();
    // Empty the notes from the note section
    // $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");
    // console.log(thisId)
    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // With that done, add the note information to the page
      .then(function (article) {
        $("#titleinput").empty();
        $("#bodyinput").empty();
        $("#noteTitle").empty();
        $("#noteBody").empty();
        $("#button").empty();
        $("#noteSection").empty();
        // console.log(article);
        // console.log(article.title);
        $("#button").empty();
        const $notes = $("#notes");
        $("#articleTitle").html(`${article.title}`);
        $("#button").html(`<button class='btn btn-dark thin' data-id='${article._id}' id='saveNote' method="post"  onclick="closeNav()">Save Note</button>`);
        // If there's a note in the article
        if (article.note) {
          $("#noteSection").html(`<hr />Notes`)
          $("#noteTitle").html(`${article.note.title}`);
          $("#noteBody").html(`${article.note.body}`);
          $("#titleinput").val(article.note.title);
          $("#bodyinput").val(article.note.body);
          $("#button").html(`<div class="container" style="padding: 0px">
          <button class='btn btn-dark thin' data-id='${article._id}' id='saveNote' method="post"  onclick="closeNav()">Update Note</button>
          <button class='btn btn-dark thin' data-id='${article.note._id}' id='deleteNote' method="post"  onclick="closeNav()">Delete Note</button>
          </div>`);
        }
      });
  });
  // When you click the savenote button
  $(document).on("click", "#saveNote", function () {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

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
      });

    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });

  // Delete note
  $(document).on("click", "#deleteNote", function () {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: `/articles/${thisId}/note/delete`,
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
      });

    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });

});
