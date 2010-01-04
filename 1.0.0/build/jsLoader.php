<?php

/**
* Loader for Elstr-Skripts and Stylesheets
*
* @version $Id$
* @copyright 2010
*/

$contentString = "";
$files = array_keys($_GET);

for ($i = 0; $i < count($files); $i++) {
    $file = "../../../../" . $_GET[$files[$i]];
    $contentString .= file_get_contents($file);
}

header('Content-Type: application/x-javascript');
header('Content-Length: ' . strlen($contentString));

echo $contentString;

?>