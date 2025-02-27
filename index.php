<?php
// Get user's IP address
$ip = $_SERVER['REMOTE_ADDR'];

// Fetch location details from ipinfo.io
$api_url = 'https://ipinfo.io/154.161.167.177/json?token=a454bd64654271'; // Use dynamic IP and replace with your API token
$response = @file_get_contents($api_url);

if ($response === FALSE) {
    die("Error retrieving location. Please try again later.");
}

$data = json_decode($response, true);

// Deny access if the user is NOT in Ghana
if ($data['country'] !== 'GH') {
    die("<h2>Access Denied</h2><p>This service is only available in Ghana.</p>");
}
// If the user is in Ghana, continue to render the HTML content
?>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Ndede Ai</title>
    <!-- Linking Google Fonts For Icons -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@32,400,0,0" />
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <div class="container">
      <!-- App Header -->
      <header class="app-header">
        <h1 class="heading">Chale, this be Ndede AI!</h1>
        <h4 class="sub-heading">how I go fit help?</h4>
      </header>
      <!-- Suggestions List -->
      <ul class="suggestions">
        <li class="suggestions-item">
          <p class="text">Chale, how I fit start my own business for Ghana?</p>
          <span class="icon material-symbols-rounded">draw</span>
        </li>
        <li class="suggestions-item">
          <p class="text">Give me some mad pickup lines wey go work for Ghana babe.</p>
          <span class="icon material-symbols-rounded">lightbulb</span>
        </li>
        <li class="suggestions-item">
          <p class="text">Chale, what dey go on for Ghana now?</p>
          <span class="icon material-symbols-rounded">explore</span>
        </li>
        <li class="suggestions-item">
          <p class="text">Massa, abeg help me debug this my code, e no dey work!</p>
          <span class="icon material-symbols-rounded">code_blocks</span>
        </li>
      </ul>
      <!-- Chats -->
      <div class="chats-container"></div>
      <!-- Prompt Input -->
      <div class="prompt-container">
        <div class="prompt-wrapper">
          <form action="#" class="prompt-form">
            <input type="text" placeholder="Chale, ask Ndede AI sharp!" class="prompt-input" autofocus required />
            <div class="prompt-actions">
              <!-- File Upload Wrapper -->
              <div class="file-upload-wrapper">
                <img src="#" class="file-preview" />
                <input id="file-input" type="file" accept="image/*, .pdf, .txt, .csv" hidden />
                <button type="button" class="file-icon material-symbols-rounded">description</button>
                <button id="cancel-file-btn" type="button" class="material-symbols-rounded">close</button>
                <button id="add-file-btn" type="button" class="material-symbols-rounded">attach_file</button>
              </div>
              <!-- Send Prompt and Stop Response Buttons -->
              <button id="stop-response-btn" type="button" class="material-symbols-rounded">stop_circle</button>
              <button id="send-prompt-btn" class="material-symbols-rounded">arrow_upward</button>
            </div>
          </form>
          <!-- Theme and Delete Chats Buttons -->
          <button id="theme-toggle-btn" class="material-symbols-rounded">light_mode</button>
          <button id="delete-chats-btn" class="material-symbols-rounded">delete</button>
        </div>
        <p class="disclaimer-text">Ndede AI vibes, verify! Powered by AkaTum Technologies.</p>
      </div>
    </div>
    <script src="script.js"></script>
  </body>
</html>