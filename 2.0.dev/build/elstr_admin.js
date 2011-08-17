/**
 * @author egli@intelliact.ch
 */

YUI.add('elstr_admin', function(Y) {
 
    // private properties or functions
    var isInit = false,
    YAHOO = Y.YUI2,
    consoleDialog,
    datasource,
    resourceDataTable,
    roleDataTable,
    anyObject = {},
    _renderConsoleDialog = function() {
    
        var bodyHtml = "";
        bodyHtml += "<h3><span textid='Roles'>"+Y.APP.lang.text('Roles')+"</span></h3>";
        bodyHtml += "<div>";
        bodyHtml += "	<select id='elstrAdminConsoleRoleHandlerMode' style='margin:5px 0 10px 0;vertical-align:top;'>";
        bodyHtml += "		<option value='add'>Add</option>";
        bodyHtml += "		<option value='delete'>Delete</option>";
        bodyHtml += "	</select>";
        bodyHtml += "	<input id='elstrAdminConsoleRoleHandlerInput' type='text' value='' size='25' style='margin:5px 0 10px 0;vertical-align:top;'>";
        bodyHtml += "	<button id='elstrAdminConsoleRoleHandlerButton' type='button'>Go!</button>";
        bodyHtml += "</div>";
        bodyHtml += "<div id='elstrAdminConsoleRoleWidget'></div>";
        bodyHtml += "<h3><span textid='Resources'>"+Y.APP.lang.text('Resources')+"</span></h3>";
        bodyHtml += "<div>";
        bodyHtml += "	<select id='elstrAdminConsoleResourceHandlerMode' style='margin:5px 0 10px 0;vertical-align:top;'>";
        bodyHtml += "		<option value='add'>Add</option>";
        bodyHtml += "		<option value='delete'>Delete</option>";
        bodyHtml += "	</select>";
        bodyHtml += "	<input id='elstrAdminConsoleResourceHandlerInput' type='text' value='' size='50' style='margin:5px 0 10px 0;vertical-align:top;'>";
        bodyHtml += "	<select id='elstrAdminConsoleResourceHandlerType' style='margin:5px 0 10px 0;vertical-align:top;'>";
        bodyHtml += "		<option value='Application'>Application</option>";
        bodyHtml += "		<option value='Service'>Service</option>";
        bodyHtml += "		<option value='WidgetServer'>WidgetServer</option>";
        bodyHtml += "		<option value='Method'>Method</option>";
        bodyHtml += "	</select>";
        bodyHtml += "	<button id='elstrAdminConsoleResourceHandlerButton' type='button'>Go!</button>";
        bodyHtml += "</div>";
        bodyHtml += "<div id='elstrAdminConsoleResourceWidget'></div>";

        var handleClose = function() {
            consoleDialog.hide();
        };

        consoleDialog = new YAHOO.widget.Dialog("consoleDialog", {
            postmethod : "none",
            visible : false,
            fixedcenter : true,
            draggable : true,
            close : true,
            modal : true,
            width : window.innerWidth - 40 + 'px',
            height : window.innerHeight - 40 + 'px',
            buttons : [ {
                text : "<span textid='Close'>"+Y.APP.lang.text('Close')+"</span>",
                handler : handleClose
            } ]
        });
        consoleDialog.setHeader("<span textid='Admin Console'>"+Y.APP.lang.text('Admin Console')+"</span>");
        consoleDialog.setBody(bodyHtml);
        consoleDialog.render(document.body);
        YAHOO.util.Dom.setStyle(consoleDialog.body,"overflow","auto");

        var resourceHandlerButton = new YAHOO.widget.Button("elstrAdminConsoleResourceHandlerButton");
        resourceHandlerButton.on("click", _onResourceHandlerButtonClick);

        var roleHandlerButton = new YAHOO.widget.Button("elstrAdminConsoleRoleHandlerButton");
        roleHandlerButton.on("click", _onRoleHandlerButtonClick);
    },
    _createDatasource = function() {
        datasource = new YAHOO.util.XHRDataSource("services/ELSTR_WidgetServer_JSON_Admin");
        datasource.connMethodPost = true;
        datasource.responseType = YAHOO.util.DataSource.TYPE_JSON;
        datasource.connXhrMode = "queueRequests";
        datasource.responseSchema = {
            resultsList : "result"
        };
    },
    _renderRoleWidget = function() {
        var oColumnDefs = [];
        oColumnDefs[oColumnDefs.length] = {
            key : 'name',
            label : 'Name',
            sortable : false,
            resizeable : true
        };

        roleDataTable = new YAHOO.widget.DataTable("elstrAdminConsoleRoleWidget", oColumnDefs, datasource, {
            initialLoad : false,
            draggableColumns : true,
            selectionMode : "standard"
        });
        roleDataTable.subscribe("cellClickEvent",roleDataTable.onEventShowCellEditor);
        _loadRoleDataTable();
    },
    _recreateResourceWidget = function(){
        resourceDataTable.destroy();
        _renderResourceWidget();
    },
    _renderResourceWidget = function() {
        var oCallback = {
            // if our XHR call is successful, we want to make use
            // of the returned data and create child nodes.
            success : function(oRequest, oParsedResponse, oPayload) {
                var oColumnDefs = [];
                oColumnDefs[oColumnDefs.length] = {
                    key : 'type',
                    label : 'Type',
                    sortable : false,
                    resizeable : true
                };
                oColumnDefs[oColumnDefs.length] = {
                    key : 'name',
                    label : 'Name',
                    sortable : false,
                    resizeable : true
                };

                var cellFormatter = function(elCell, oRecord, oColumn, oData) {
                    elCell.innerHTML = oData;
                    if (oData == 'allow') {
                        YAHOO.util.Dom.setStyle(elCell,'background-color', '#99ff99');
                    } else if (oData == 'deny') {
                        YAHOO.util.Dom.setStyle(elCell,'background-color', '#ff9999');
                    }
                };

                for ( var i = 0; i < oParsedResponse.results.length; i++) {
                    oColumnDefs[oColumnDefs.length] = {
                        key : oParsedResponse.results[i].name,
                        label : oParsedResponse.results[i].name,
                        sortable : true,
                        resizeable : true,
                        formatter : cellFormatter,
                        editor : new YAHOO.widget.RadioCellEditor( {
                            radioOptions : [ "allow", "deny","inherit" ],
                            asyncSubmitter : _updateAccessRight,
                            disableBtns : true
                        })
                    };
                }

                resourceDataTable = new YAHOO.widget.DataTable("elstrAdminConsoleResourceWidget", oColumnDefs,
                    datasource, {
                        initialLoad : false,
                        draggableColumns : true,
                        selectionMode : "standard"
                    });
                resourceDataTable.subscribe("cellClickEvent",resourceDataTable.onEventShowCellEditor);
                _loadResourceDataTable();

            },
            failure : function(oRequest, oParsedResponse, oPayload) {
                Y.ELSTR.Error.requestFailure(oRequest, oParsedResponse, oPayload);
            },	
            scope : {},
            argument : {}
        };

        var oRequestPost = {
            "jsonrpc" : "2.0",
            "method" : "getRoleList",
            "params" : {},
            "id" : Y.ELSTR.Utils.uuid()
        };
        datasource.sendRequest(YAHOO.lang.JSON.stringify(oRequestPost),oCallback);
    },
    _updateAccessRight = function(fnCallback, newValue) {

        var data = this.getRecord()._oData;
        var column = this.getColumn();

        var oCallback = {
            success : function(oRequest, oParsedResponse, oPayload) {
                fnCallback(true, newValue);
                _loadResourceDataTable();
            },
            failure : function(oRequest, oParsedResponse, oPayload) {
                Y.ELSTR.Error.requestFailure(oRequest, oParsedResponse, oPayload);
                fnCallback(false, newValue);
                _loadResourceDataTable();
            },
            scope : {},
            argument : {}
        };

        var oRequestPost = {
            "jsonrpc" : "2.0",
            "method" : "updateAccessRight",
            "params" : {
                resourceName : data.name,
                roleName : column.key,
                accessRight : newValue
            },
            "id" : Y.ELSTR.Utils.uuid()
        };
        datasource.sendRequest(YAHOO.lang.JSON.stringify(oRequestPost),oCallback);
    },
    _loadResourceDataTable = function() {
        var oCallback = {
            success : resourceDataTable.onDataReturnInitializeTable,			
            failure : resourceDataTable.onDataReturnInitializeTable,
            argument : resourceDataTable.getState(),
            scope : resourceDataTable
        };

        // Show loading row
        resourceDataTable.deleteRows(0,resourceDataTable.getRecordSet()._records.length);
        resourceDataTable.addRow( {
            name : "<div class='loaderIcon'></div> Loading ..."
        }, 0);

        var oRequestPost = {
            "jsonrpc" : "2.0",
            "method" : "getResourceDataTable",
            "params" : {},
            "id" : Y.ELSTR.Utils.uuid()
        };
        datasource.sendRequest(YAHOO.lang.JSON.stringify(oRequestPost),oCallback);
    },
    _loadRoleDataTable = function() {
        var oCallback = {
            success : roleDataTable.onDataReturnInitializeTable,
            failure : roleDataTable.onDataReturnInitializeTable,
            argument : roleDataTable.getState(),
            scope : roleDataTable
        };

        // Show loading row
        roleDataTable.deleteRows(0,	roleDataTable.getRecordSet()._records.length);
        roleDataTable.addRow( {
            name : "<div class='loaderIcon'></div> Loading ..."
        }, 0);

        var oRequestPost = {
            "jsonrpc" : "2.0",
            "method" : "getRoleList",
            "params" : {},
            "id" : Y.ELSTR.Utils.uuid()
        };
        datasource.sendRequest(YAHOO.lang.JSON.stringify(oRequestPost),oCallback);
    },
    _onResourceHandlerButtonClick = function() {
        var oCallback = {
            success : function(oRequest, oParsedResponse, oPayload) {
                _loadResourceDataTable();
            },
            failure : function(oRequest, oParsedResponse, oPayload) {
                Y.ELSTR.Error.requestFailure(oRequest, oParsedResponse, oPayload);
                _loadResourceDataTable();
            },
            scope : {},
            argument : {}
        };

        var mode = YAHOO.util.Dom.get("elstrAdminConsoleResourceHandlerMode").value;
        var type = YAHOO.util.Dom.get("elstrAdminConsoleResourceHandlerType").value;
        var resource = YAHOO.util.Dom.get("elstrAdminConsoleResourceHandlerInput").value;

        if (resource != '') {
            var oRequestPost = {
                "jsonrpc" : "2.0",
                "method" : "updateResource",
                "params" : {
                    mode : mode,
                    resourceName : resource,
                    type : type
                },
                "id" : Y.ELSTR.Utils.uuid()
            };

            datasource.sendRequest(YAHOO.lang.JSON.stringify(oRequestPost),oCallback);
        }
    },
    _onRoleHandlerButtonClick = function() {
        var oCallback = {
            success : function(oRequest, oParsedResponse, oPayload) {
                _loadRoleDataTable();
                _recreateResourceWidget();
            },
            failure : function(oRequest, oParsedResponse, oPayload) {
                Y.ELSTR.Error.requestFailure(oRequest, oParsedResponse, oPayload);
                _loadRoleDataTable();
                _recreateResourceWidget();
            },
            scope : {},
            argument : {}
        };

        var mode = YAHOO.util.Dom.get("elstrAdminConsoleRoleHandlerMode").value;
        var role = YAHOO.util.Dom.get("elstrAdminConsoleRoleHandlerInput").value;

        if (role != '') {
            var oRequestPost = {
                "jsonrpc" : "2.0",
                "method" : "updateRole",
                "params" : {
                    mode : mode,
                    roleName : role
                },
                "id" : Y.ELSTR.Utils.uuid()
            };
            datasource.sendRequest(YAHOO.lang.JSON.stringify(oRequestPost),	oCallback);
        }
    };

    Y.namespace('ELSTR').Admin = {
        // public properties or functions
        initializer : function(){
            if(isInit === false){
                Y.one("body").addClass("yui-skin-sam");
                _renderConsoleDialog();
                _createDatasource();
                _renderRoleWidget();
                _renderResourceWidget();       
                isInit = true;
            }
        },
        openAdminConsole : function(){
            Y.ELSTR.Admin.initializer();
            consoleDialog.show();
        }
    }
 
}, '2.0' /* module version */, {
    requires: ['yui2-event','yui2-connection','yui2-json','yui2-button','yui2-container','yui2-datasource','yui2-datatable','base','node','elstr_user','elstr_auth','elstr_error']
});