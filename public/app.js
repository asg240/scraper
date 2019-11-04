document.addEventListener('DOMContentLoaded', function() {
    let noteModalInit = document.querySelector('.modal');
    let noteModal = M.Modal.init(noteModalInit);
    $(".tooltipped").tooltip();
  

    let getArticles = function() {
      $("#articles").empty();
      $.getJSON("/articles", function(data) {
        for (let i = 0; i < data.length; i++) {
          var articleCard = $("<div>");
          articleCard.addClass("card");
          articleCard.attr("data-id", data[i]._id);
          articleCard.html("<div class='card-content'><span class='card-title'><a href='"+data[i].link+"' target='_blank'>"+data[i].title+"</a></span></div><div class='card-action'><a class='noteLink' data-id='"+data[i]._id+"'>Notes</a></div>");
          $("#articles").prepend(articleCard);
        }
      });
    }
    
    getArticles();
  


    $(document).on("click", function() {
      if (!noteModal.isOpen) {
        $("#notes").empty();
        $("#saveNoteFooter").empty();
        $("#noteEntry").val("");
        M.textareaAutoResize($("#noteEntry"));
      }
    });
  
  
    $(document).on("click", ".noteLink", function() {
      let thisId = $(this).attr("data-id");
      $.ajax({
        method: "GET",
        url: "/notes/" + thisId
      })

        .then(function(data) {
          noteModal.open();
          if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
              $("#notes").append("<li class='collection-item noteItem'><div>"+data[i].body+"<a class='secondary-content deleteNote' data-noteId='"+data[i]._id+"'><i class='material-icons'>cancel</i></a></div></li>");
            }

          }
          $("#saveNoteFooter").append("<a class='modal-close waves-effect waves-green btn-flat' id='saveNote' data-id='" + thisId + "'>Submit</a>");
        });
    });
    
    
    $(document).on("click", "#saveNote", function() {
      let thisId = $(this).attr("data-id");
      $("#notes").empty();
      $("#saveNoteFooter").empty();
      $.ajax({

        method: "POST",
        url: "/notes/" + thisId,
        data: {
          articleID: thisId,
          body: $("#noteEntry").val()
        }
      })

        .then(function(data) {
          $("#noteEntry").val("");
          M.textareaAutoResize($("#noteEntry"));
        });
    });
  

    $("#scrape").on("click", function(event) {
      event.preventDefault();
      $.ajax({
        method: "GET",
        url: "/scrape"
      })

        .then(function() {
        M.toast({html: '<p>Loading...<p><br><div class="preloader-wrapper small active"><div class="spinner-layer spinner-orange-only"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>', displayLength: 10000});
        setTimeout(getArticles, 10000);
        });
    });
    
  
    $(document).on("click", ".deleteNote", function(event) {
      event.preventDefault();
      let thisId = $(this).attr("data-NoteId");
      $(this).parents(".noteItem").remove();
      $.ajax({
        method: "GET",
        url: "/notes/delete/" + thisId
      })
    })
  
  });