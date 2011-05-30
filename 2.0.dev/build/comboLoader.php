<?php

/**
 * Javascript and Cascading Stylesheet loader for Elstr-Scripts
 * Compatible to YUI3
 *
 * @copyright 2011
 * @author egli@intelliact.ch
 * 
 */
$requestParameterString = substr(strstr($_SERVER['REQUEST_URI'], "?"), 1);

$contentString = "";
$contentType = "js";
if (strpos($requestParameterString, ".js") === false) {
    $contentType = "css";
}
$files = explode("&", $requestParameterString);
$count = count($files);
for ($i = 0; $i < $count; $i++) {
    if (strlen($files[$i]) > 0) {
        $file = "../../../../" . $files[$i];
        if ($contentType == "css") {
            // $contentType == "css"
            $fileContent = file_get_contents($file);
            $deltaPath = "../../../../" . substr($files[$i], 0, strrpos($files[$i], "/"));
            $fileContent = preg_replace('#url\("#', 'url("' . $deltaPath . '/', $fileContent);
            $fileContent = preg_replace('#url\(\'#', 'url(\'' . $deltaPath . '/', $fileContent);
            $contentString .= $fileContent . "\r\n";
        } else {
            // $contentType == "js"
            $contentString .= file_get_contents($file) . "\r\n";
        }
    }
}

if ($contentType == "css") {
    // $contentType == "css"
    header('Content-Type: text/css');
    header('Content-Length: ' . strlen($contentString));
} else {
    // $contentType == "js"
    header('Content-Type: application/x-javascript');
    header('Content-Length: ' . strlen($contentString));
}

echo $contentString;
?>