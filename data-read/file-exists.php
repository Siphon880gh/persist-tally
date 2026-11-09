<?php
if(isset($_GET["filename"])) {
    $filename = $_GET["filename"];
    if(file_exists("../data/$filename.json"))
        echo "success";
    else
        echo "error";
} else {
    echo "error";
}
?>