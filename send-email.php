<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars($_POST['name']);
    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    $message = htmlspecialchars($_POST['message']);

    $to = "rezerwacje@domkigaba.pl//sdsfwvwrvwb";  // zmienic email
    $subject = "Nowa wiadomość od: $name";
    $headers = "Od: $email\r\n";
    $headers .= "Content-Type: text/plain; charset=utf-8\r\n";

    if (mail($to, $subject, $message, $headers)) {
        echo "Wiadomość wysłana!";
    } else {
        echo "Błąd podczas wysyłania wiadomości.";
    }
}
?>