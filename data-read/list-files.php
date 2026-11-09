<?php
    $files = scandir("../data");
    echo json_encode($files);
?>