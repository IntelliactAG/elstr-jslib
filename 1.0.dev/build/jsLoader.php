<?php

/**
* Javascript loader for Elstr-Scripts
*
* @copyright 2010
* @author egli@intelliact.ch
* 
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