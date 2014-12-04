/**
 * Created by sahun on 02.12.2014.
 */

function ElstrI18N(currentLang){
	this._currentLang = currentLang;
}

ElstrI18N.prototype = {

	getAvailableLangs : function(){

		return [];
	},

	getCurrentLang : function(){
		return this._currentLang;
	},

	setCurrentLang : function( lang ){
		this._currentLang = lang;
	},

	translate : function( text ){
		return "";
	}

};

module.exports = ElstrI18N;
