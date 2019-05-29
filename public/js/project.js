$(document).ready(function(){
  // Activate Carousel
  $(".carousel-item").carousel({interval: 200});


  
  $('.dropdown-submenu a.test').on("click", function(e){
      $(this).next('ul').toggle();
      e.stopPropagation();
      e.preventDefault();
  });

// blogContainer holds all of our posts
var projectContainer = $(".project-container");
var postCategorySelect = $("#category");
// Click events for the edit and delete buttons
$(document).on("click", "button.delete", handlePostDelete);
$(document).on("click", "button.edit", handlePostEdit);
postCategorySelect.on("change", handleCategoryChange);
var posts;

// This function grabs posts from the database and updates the view
function getPosts(category) {
  var categoryString = category || "";
  if (categoryString) {
    categoryString = "/category/" + categoryString;
  }
  $.get("/api/posts" + categoryString, function(data) {
    console.log("Posts", data);
    posts = data;
    if (!posts || !posts.length) {
      displayEmpty();
    }
    else {
      initializeRows();
    }
  });
}

// This function does an API call to delete posts
function deletePost(id) {
  $.ajax({
    method: "DELETE",
    url: "/api/posts/" + id
  })
    .then(function() {
      getPosts(postCategorySelect.val());
    });
}

// Getting the initial list of posts
getPosts();
// InitializeRows handles appending all of our constructed post HTML inside
// blogContainer
function initializeRows() {
  blogContainer.empty();
  var postsToAdd = [];
  for (var i = 0; i < posts.length; i++) {
    postsToAdd.push(createNewRow(posts[i]));
  }
  blogContainer.append(postsToAdd);
}

// This function constructs a post's HTML
function createNewRow(post) {
  var newPostCard = $("<div>");
  newPostCard.addClass("card");
  var newPostCardHeading = $("<div>");
  newPostCardHeading.addClass("card-header");
  var deleteBtn = $("<button>");
  deleteBtn.text("x");
  deleteBtn.addClass("delete btn btn-danger");
  var editBtn = $("<button>");
  editBtn.text("EDIT");
  editBtn.addClass("edit btn btn-default");
  var newPostTitle = $("<h2>");
  var newPostDate = $("<small>");
  var newPostCategory = $("<h5>");
  newPostCategory.text(post.category);
  newPostCategory.css({
    float: "right",
    "font-weight": "700",
    "margin-top":
    "-15px"
  });
  var newPostCardBody = $("<div>");
  newPostCardBody.addClass("card-body");
  var newPostBody = $("<p>");
  newPostTitle.text(post.title + " ");
  newPostBody.text(post.body);
  var formattedDate = new Date(post.createdAt);
  formattedDate = moment(formattedDate).format("MMMM Do YYYY, h:mm:ss a");
  newPostDate.text(formattedDate);
  newPostTitle.append(newPostDate);
  newPostCardHeading.append(deleteBtn);
  newPostCardHeading.append(editBtn);
  newPostCardHeading.append(newPostTitle);
  newPostCardHeading.append(newPostCategory);
  newPostCardBody.append(newPostBody);
  newPostCard.append(newPostCardHeading);
  newPostCard.append(newPostCardBody);
  newPostCard.data("post", post);
  return newPostCard;
}

// This function figures out which post we want to delete and then calls
// deletePost
function handlePostDelete() {
  var currentPost = $(this)
    .parent()
    .parent()
    .data("post");
  deletePost(currentPost.id);
}

// This function figures out which post we want to edit and takes it to the
// Appropriate url
function handlePostEdit() {
  var currentPost = $(this)
    .parent()
    .parent()
    .data("post");
  window.location.href = "/project?post_id=" + currentPost.id;
}

// This function displays a message when there are no posts
function displayEmpty() {
  blogContainer.empty();
  var messageH2 = $("<h2>");
  messageH2.css({ "text-align": "center", "margin-top": "50px" });
  messageH2.html("No posts yet for this category, navigate <a href='/cms'>here</a> in order to create a new post.");
  blogContainer.append(messageH2);
}

// This function handles reloading new posts when the category changes
function handleCategoryChange() {
  var newPostCategory = $(this).val();
  getPosts(newPostCategory);
}

// Gets an optional query string from our url (i.e. ?post_id=23)
var url = window.location.search;
var postId;
// Sets a flag for whether or not we're updating a post to be false initially
var updating = false;

// If we have this section in our url, we pull out the post id from the url
// In localhost:8080/cms?post_id=1, postId is 1
if (url.indexOf("?post_id=") !== -1) {
  postId = url.split("=")[1];
  getPostData(postId);
}

// Getting jQuery references to the post body, title, form, and category select
var bodyInput = $("#body");
var titleInput = $("#title");
var projectForm = $("#project");
var postCategorySelect = $("#category");
// Giving the postCategorySelect a default value
postCategorySelect.val("Personal");
// Adding an event listener for when the form is submitted
$(projectForm).on("submit", function handleFormSubmit(event) {
  event.preventDefault();
  // Wont submit the post if we are missing a body or a title
  if (!titleInput.val().trim() || !bodyInput.val().trim()) {
    return;
  }
  // Constructing a newPost object to hand to the database
  var newPost = {
    title: titleInput.val().trim(),
    body: bodyInput.val().trim(),
    category: postCategorySelect.val()
  };

  console.log(newPost);

  // If we're updating a post run updatePost to update a post
  // Otherwise run submitPost to create a whole new post
  if (updating) {
    newPost.id = postId;
    updatePost(newPost);
  }
  else {
    submitPost(newPost);
  }
});

// Submits a new post and brings user to blog page upon completion
function submitPost(Post) {
  $.post("/api/posts/", Post, function() {
    window.location.href = "/project";
  });
}

// Gets post data for a post if we're editing
function getPostData(id) {
  $.get("/api/posts/" + id, function(data) {
    if (data) {
      // If this post exists, prefill our cms forms with its data
      titleInput.val(data.title);
      bodyInput.val(data.body);
      postCategorySelect.val(data.category);
      // If we have a post with this id, set a flag for us to know to update the post
      // when we hit submit
      updating = true;
    }
  });
}

// Update a given post, bring user to the blog page when done
function updatePost(post) {
  $.ajax({
    method: "PUT",
    url: "/api/posts",
    data: post
  })
    .then(function() {
      window.location.href = "/project";
    });
}

});


  