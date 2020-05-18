<?php
if(isset($_POST["payload"])) {
    function get_filename($jsonObj) {
        // $data = json_decode($jsonObj, true);
        return $jsonObj["filename"];
    }

    $filename = get_filename($_POST["payload"]);

    // Only writes if valid JSON
    @file_put_contents("../data/$filename.json", json_encode($_POST["payload"]));
}
?>