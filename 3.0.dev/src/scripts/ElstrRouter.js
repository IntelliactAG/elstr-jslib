/**
 * Created by sahun on 02.12.2014.
 */

var ElstrLog = require("../lib/ElstrLog");
ElstrLog = new ElstrLog(true);

function ElstrRouter(){

};

ElstrRouter.prototype = {

	changeUrl : function( newUrl ){
		ElstrLog.trace();

	},

	setOnChangeUrl : function( onChangeFunc ){
		ElstrLog.trace();

	},

	back : function(){
		ElstrLog.trace();

	}

}

module.exports = ElstrRouter;
