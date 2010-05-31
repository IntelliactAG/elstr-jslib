<?php

/**
* Cascading Stylesheet loader for Elstr
*
* @copyright 2010
* @author egli@intelliact.ch
* 
*/

$contentString = "";
$files = array_keys($_GET);

for ($i = 0; $i < count($files); $i++) {
	$fileToLoad = $_GET[$files[$i]];

    $file = "../../../../" . $fileToLoad;    
    
    $fileContent = file_get_contents($file);
    
    $deltaPath = "../../../../". substr($fileToLoad, 0, strrpos($fileToLoad, "/"));
	$fileContent = preg_replace('#url\("#', 'url("'.$deltaPath.'/',$fileContent);
	$fileContent = preg_replace('#url\(\'#', 'url(\''.$deltaPath.'/',$fileContent);
	
    $contentString .= $fileContent;
}

header('Content-Type: text/css');
header('Content-Length: ' . strlen($contentString));

echo $contentString;

?>