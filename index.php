<?php
// Get user's IP address
$ip = $_SERVER['REMOTE_ADDR'];

// Fetch location details from ipinfo.io
$api_url = 'https://ipinfo.io/154.161.167.177/json?token=a454bd64654271'; // Replace with your API token
$response = @file_get_contents($api_url);

if ($response === FALSE) {
    die("Error retrieving location. Please try again later.");
}

$data = json_decode($response, true);

// Redirect if the user is in Ghana
if ($data['country'] === 'GH') {
    header("Location: dashbord.html");
    exit();
}

// If the user is NOT in Ghana, deny access
die("<h2>Access Denied</h2><p>This service is only available in Ghana.</p>");
?>
