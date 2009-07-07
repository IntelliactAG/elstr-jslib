/***
 * This is the main Object of ELSTR Framework
 * @param {Object} Params 
 * @param {Object} E Output: The Elstrobject
 */ 

var ELSTR = function(Params, E) {
	
}


ELSTR.DatasourceManager = function() {
	var that = this;
	var datasources = {};
	
	that.registerDatasource = function(name, datasourcedefinition) {
		datasources[name] = datasourcedefinition;
	}
	
	that.getDataSource = function(name) {
		return datasources[name];			
	}
}

