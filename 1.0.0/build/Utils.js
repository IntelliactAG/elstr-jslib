// Create the Namespace for the Framework
if (ELSTR == undefined) {
	var ELSTR = new Object();
};

/**
 * Die Utils Klasse beinhaltet einige Shortcuts fuer Funktionen
 * 
 * @author egli@intelliact.ch
 * @copyright Intelliact AG, 2009
 * @namespace ELSTR
 * @class ELSTR.Utils
 * @alias ElstrUtils
 * @classDescription Sugar for Elstr applications
 * @constructor
 */
ELSTR.Utils = {
	// public method for clearing all childs in the dom tree
	clearChilds : function(el) {
		if (el.childNodes) {
			while (el.hasChildNodes()) {
				el.removeChild(el.firstChild);
			}
		}
	}
}
