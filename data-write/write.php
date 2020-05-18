<?php
if(isset($_POST["payload"])) {
    // Only writes if valid JSON
    @file_put_contents("../data/data.json", json_encode($_POST["payload"]));
}
?>