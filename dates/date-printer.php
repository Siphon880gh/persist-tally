<?php
$today = date("m/d/y"); 
$range = rangeWeek(date("m/d/y"));
$prevRange = rangeWeek(date('m/d/y', strtotime('-7 days')));
// $startNum = rangeStartNum(date("m/d/y"));
$startNum = Date('d');
$startNum2 = Date('d', strtotime("+1 day"));
$startNum3 = Date('d', strtotime("+2 days"));
$startNum4 = Date('d', strtotime("+3 days"));
$startNum5 = Date('d', strtotime("+4 days"));
$startNum6 = Date('d', strtotime("+5 days"));
$startNum7 = Date('d', strtotime("+6 days"));
$start = $range["start"];
$end = $range["end"];
$startPrev = $prevRange["start"];
$endPrev = $prevRange["end"];
echo sprintf("<span onclick='insertTheDate(event)'>$today</span>
      <span class='vertical-bar'>&nbsp;|&nbsp;</span>
      <span class='clickable' onclick='$(this).hide(); $(this).next().show();'>$start - $end &nbsp;&nbsp;(Days: %d, %d, %d, %d, %d, %d, %d)</span>
      <span class='clickable' onclick='$(this).hide(); $(this).prev().show();' style='display:none;'>$startPrev - $endPrev &nbsp;&nbsp;(Last Week)</span>", 
        $startNum, $startNum2, $startNum3, $startNum4, $startNum5, $startNum6, $startNum7);
?>