/**
 * File generation via Javascript
 * @author Andrés Sahún
 */

function ElstrFiles() {}

/**
 * Creates and downloads a txt file.
 * @param filename Name of the file with extension.
 * @param content Text content for the file to be encoded.
 */
ElstrFiles.downloadTextFile = function(filename, content){

	var href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(content);
	ElstrFiles.setFileToDownload(filename, href);

};

/**
 * Creates and downloads a csv file.
 * @param filename Name of the file with extension.
 * @param data Matrix (array of arrays) content for the file to be encoded.
 */
ElstrFiles.downloadCsvFile = function(filename, data){

	var csvContent = "";
	data.forEach(function(infoArray, index){

		var dataString = "\""+infoArray.join("\";\"")+"\"";
		csvContent += index < data.length ? dataString+ "\n" : dataString;

	});

	var href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
	ElstrFiles.setFileToDownload(filename, href);

};

/**
 * Prepares a file to be downloaded
 * @param filename Name of the file with extension.
 * @param href header to generate the file.
 */
ElstrFiles.setFileToDownload = function(filename, href){

	var element = document.createElement('a');

	element.setAttribute('href', href);
	element.setAttribute('download', filename);

	element.style.display = 'none';
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);

};

module.exports = ElstrFiles;
