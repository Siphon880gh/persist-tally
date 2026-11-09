<?php

date_default_timezone_set ("America/Los_Angeles");

function rangeWeek ($datestr) {
   $dt = strtotime ($datestr);
   // 1 = Mon
   // 7 = Sun
   return array (
     "start" => date ('N', $dt) == 7 ? date ('m/d', $dt) : date ('m/d', strtotime ('last sunday', $dt)),
     "end" => date('N', $dt) == 6 ? date ('m/d', $dt) : date ('m/d', strtotime ('next saturday', $dt))
   );
} // rangeWeek

function rangeStartNum ($datestr) {
    $dt = strtotime ($datestr);
    // 1 = Mon
    // 7 = Sun
    return intval(date ('N', $dt) == 7 ? date ('d', $dt) : date ('d', strtotime ('last sunday', $dt)));
} // rangeStartNum

?>