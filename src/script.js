var isLoading = false;
var isEndOfResults = false;

function makeRequest(url, successCallback) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        successCallback(xhr.responseText);
      } else {
        console.error("Request failed with status:", xhr.status);
      }
    }
  };
  xhr.send();
}

function displayData(elementId, data) {
  var element = document.getElementById(elementId);
  element.innerHTML = data;
}

function appendData(elementId, data) {
  var element = document.getElementById(elementId);
  element.insertAdjacentHTML("beforeend", data);
}

function getPosts() {
  if (isLoading) return;

  isLoading = true;
  var randomPage = Math.floor(Math.random() * 4000) + 1; // Generate a random page number between 1 and 45555
  var url = "https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&limit=10&json=1&pid=" + randomPage;
  makeRequest(url, function(response) {
    var posts = JSON.parse(response);
    var html = "";
    posts.forEach(function(post) {
      html += "<div class='post'>";
      html += "<div class='post-image'>";
      html += "<a href='" + post.file_url + "' target='_blank'>";
      html += "<img src='" + post.file_url + "' alt='Post Image'>";
      html += "</a>";
      html += "<a class='btn-download' href='" + post.file_url + "' download>Full Image</a>";
      html += "</div>";
      html += "<div class='post-info'>";
      html += "<strong>Post ID:</strong> " + post.id + "<br>";
      html += "</div>";
      html += "</div>";
    });
    appendData("posts", html);

    if (posts.length === 0) {
      isEndOfResults = true;
      appendData("posts", "<p class='infinite-scroll-error'>No more posts available.</p>");
    }

    isLoading = false;
  });
}

function handleScroll() {
  var windowHeight = window.innerHeight;
  var documentHeight = document.documentElement.scrollHeight;
  var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (documentHeight - (windowHeight + scrollTop) < 4000) {
    getPosts();
  }
}

window.addEventListener("scroll", handleScroll);

getPosts();
