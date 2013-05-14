<?php

/**
 * Javascript and Cascading Stylesheet loader for Elstr-Scripts
 * Compatible to YUI3
 *
 * @copyright 2011
 * @author egli@intelliact.ch
 * 
 */
$requestParameterString = $_SERVER['QUERY_STRING'];

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
            $deltaPath = substr($file, 0, strrpos($file, "/"));

            // Maskieren von Strings url(data: mit denen direkt Daten übergeben werden
            $fileContent = preg_replace('#url\(data:#', 'urlDataDoNotConvert', $fileContent);

            // Damit das Ersetzen mit und ohne Hochkommas funktioniert wurde folgendes Vorgehen gewählt
            // 1. Einfügen des deltaPath nach jeder öffnenden Klammer von url()           
            $fileContent = preg_replace('#url\(#', 'url(' . $deltaPath . '/', $fileContent);
            // 2. und 3. War der Ursrungspfad in Hochkommas url('') oder url("") wird der deltaPath direkt nach der öffnenden Klammer wieder entfernt
            // Bsp. url(deltaPath'originPath') nach url('deltaPath+originPath')
            $fileContent = preg_replace('#url\(' . $deltaPath . '/"#', 'url("' . $deltaPath . '/', $fileContent);
            $fileContent = preg_replace('#url\(' . $deltaPath . '/\'#', 'url(\'' . $deltaPath . '/', $fileContent);               

            // Entmaskieren der Strings url(data:
            $fileContent = preg_replace('#urlDataDoNotConvert#', 'url(data:', $fileContent);

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