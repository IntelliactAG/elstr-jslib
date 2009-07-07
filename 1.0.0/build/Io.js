/***
 * This is just a rough draft of the IO object
 */

ELSTR.IO = {};

ELSTR.IO.DatasourceManager = function() {
	var that = this;
	var datasources = {};
	
	that.registerDatasource = function(name, datasourcedefinition) {
		datasources[name] = datasourcedefinition;
	}
	
	that.getDataSource = function(name) {
		return datasources[name];			
	}
}
