<?php
// Get user's IP address
$ip = $_SERVER['REMOTE_ADDR'];

// Fetch location details from ip-api
$api_url = "http://ip-api.com/json/$ip";
$response = file_get_contents($api_url);
$data = json_decode($response, true);

// Check if API request was successful
if ($data['status'] !== 'success') {
    die("Error retrieving location. Please try again later.");
}

// Redirect if the user is in Ghana
if ($data['countryCode'] === 'GH') {
    header("Location: https://blaisedrich-ndede-ackah.github.io/Ndede-AI/"); // Change this to your desired URL
    exit();
}

// If the user is NOT in Ghana, deny access
die("<h2>Access Denied</h2><p>This service is only available in Ghana.</p>");
?>