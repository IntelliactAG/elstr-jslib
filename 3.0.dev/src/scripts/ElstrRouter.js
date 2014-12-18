/**
 * Created by sahun on 02.12.2014.
 */

var ElstrLog = require("./ElstrLog");
var elstrLog = new ElstrLog({
    enabled: true
});

function ElstrRouter(){

}

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

};

module.exports = ElstrRouter;
