<?php

if (array_key_exists('email', $_POST)) {

    require 'vendor/autoload.php';

    $isAjax = !empty($_SERVER['HTTP_X_REQUESTED_WITH']) &&
        strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';

    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
    $dotenv->load();

    $email = new \SendGrid\Mail\Mail();
    $email->setFrom("info@lostworldtattoos.com", "Lost World Tattoos");
    $email->setSubject("New Contact Form Enquiry");
    $email->addTo("info@lostworldtattoos.com", "Lost World Tattoos");
    $email->setReplyTo($_POST['email'], $_POST['name']);
    $email->addContent(
        "text/plain", <<<EOT
        Name:
        {$_POST['name']}
    
        Email:
        {$_POST["email"]}
    
        Number:
        {$_POST['number']}
    
        Message:
        {$_POST['description']}
        EOT
    );

    $email->addContent("text/html", <<<EOT
    <strong>Name:</strong><br>
    {$_POST['name']}<br>
    <br>
    <strong>Email:</strong><br>
    {$_POST["email"]}<br>
    <br>
    <strong>Number:</strong><br>
    {$_POST['number']}<br>
    <br>
    <strong>Message:</strong><br>
    {$_POST['description']}<br>
    EOT
    );

    // Add Attachments
    for($i = 0; $i < 2; $i++) {
        if($_FILES['userfile']['name'][$i] == ""){
            continue;
        }
        $file_encoded = base64_encode(file_get_contents($_FILES['userfile']['tmp_name'][$i]));
        $email->addAttachment(
            $file_encoded,
            $_FILES['userfile']['type'][$i],
            $_FILES['userfile']['name'][$i],
            "attachment"
        );
    }

    $sendgrid = new \SendGrid($_ENV['SENDGRID_API_KEY']);

    try {
        $response = $sendgrid->send($email);
        // print $response->statusCode() . "\n"; // SHOULD BE 202 IF EVERYTHING IS OK AND QUEUED TO SEND
        // print_r($response->headers());
        // print $response->body() . "\n";

        $response = [
            "status" => true,
            "message" => 'Message sent! We will be in touch.'
        ];


    } catch (Exception $e) {
        echo 'Caught exception: '. $e->getMessage() ."\n";
        if ($isAjax) {
            http_response_code(500);
            echo $e->getMessage();
        }

        $response = [
            "status" => false,
            "message" => 'Sorry, something went wrong. Please try again later or try calling on 01279 899287.'
        ];
    }
    if ($isAjax) {
        header('Content-type:application/json;charset=utf-8');
        echo json_encode($response);
        exit();
    }
}

http_response_code(403);
exit();