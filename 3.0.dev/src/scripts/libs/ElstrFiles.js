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

	var dataType = 'text/plain;charset=utf-8';
	ElstrFiles.setFileToDownload(filename, content, dataType);

};

/**
 * Creates and downloads a csv file.
 * @param filename Name of the file with extension.
 * @param data Matrix (array of arrays) content for the file to be encoded.
 */
ElstrFiles.downloadCsvFile = function(filename, data){

	var dataTxt = "";
	data.forEach(function(infoArray, index){

		var dataString = "\""+infoArray.join("\";\"")+"\"";
		dataTxt += index < data.length ? dataString+ "\n" : dataString;

	});

	var dataType = 'text/csv;charset=utf-8';
	ElstrFiles.setFileToDownload(filename, dataTxt, dataType);

};

/**
 * Prepares a file to be downloaded
 * @param filename Name of the file with extension.
 * @param href header to generate the file.
 */
ElstrFiles.setFileToDownload = function(filename, data, dataType){

	var blobData = new Blob([data], {type: dataType});

	if (navigator.msSaveBlob) {

		navigator.msSaveBlob(blobData, filename);

	} else {

		var element = document.createElement('a');

		var href = URL.createObjectURL(blobData);
		element.setAttribute('href', href);
		element.setAttribute('download', filename);

		element.style.display = 'none';
		document.body.appendChild(element);

		element.click();

		document.body.removeChild(element);


	}

};

module.exports = ElstrFiles;
