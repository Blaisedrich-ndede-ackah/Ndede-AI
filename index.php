<?php
// Get the raw POST data
$payload = file_get_contents('php://input');
$headers = getallheaders();

// Verify the signature (if signing key is provided)
$signingKey = 'Nana111'; // Replace with your httpSMS signing key
$signature = $headers['X-HttpSMS-Signature'] ?? '';
$computedSignature = hash_hmac('sha256', $payload, $signingKey);

if ($signature !== $computedSignature) {
    http_response_code(401);
    die('Unauthorized');
}

// Decode the JSON payload
$data = json_decode($payload, true);

// Log the webhook data
file_put_contents('webhook.log', print_r($data, true), FILE_APPEND);

// Handle events
$event = $data['event'] ?? '';
$phoneNumber = $data['phoneNumber'] ?? '';
$message = $data['message'] ?? '';

switch ($event) {
    case 'message.phone.received':
        echo "Message received from $phoneNumber: $message";
        break;
    case 'message.phone.sent':
        echo "Message sent to $phoneNumber: $message";
        break;
    case 'message.phone.delivered':
        echo "Message delivered to $phoneNumber: $message";
        break;
    case 'message.send.failed':
        echo "Message failed to send to $phoneNumber: $message";
        break;
    case 'message.send.expired':
        echo "Message expired for $phoneNumber: $message";
        break;
    default:
        echo "Unknown event: $event";
}

http_response_code(200);
?>