/**
 * Component to manage the ELSTR Roles.
 */

var React = require('react');
var ElstrLangStore = require('../stores/ElstrLangStore');

var DropdownButton = require('react-bootstrap/DropdownButton');
var Button = require('react-bootstrap/Button');
var MenuItem = require('react-bootstrap/MenuItem');
var Modal = require('react-bootstrap/Modal');
var ButtonGroup = require('react-bootstrap/ButtonGroup');
var Input = require('react-bootstrap/Input');

var Row = require('react-bootstrap/Row');
var Col = require('react-bootstrap/Col');

require('../../css/ElstrAdminTable.css');
require('../../css/ElstrAdminPanel.css');

var ElstrAdminActions = require('../actions/ElstrAdminActions');
var ElstrAdminStore = require('../stores/ElstrAdminStore');

function _getState(){
    return {

        rolle: "add",
        resource: "add",
        application: "Application",

        rolleText: "",
        resourceText: "",

        roles: ElstrAdminStore.getRoles(),
        resources: ElstrAdminStore.getResources(),

        /** LOADING STATES */
        loadingResources : ElstrAdminStore.getLoadingResources(),
        loadingRoles : ElstrAdminStore.getLoadingRoles(),

        errorResources : ElstrAdminStore.getErrorResources(),
        errorRoles : ElstrAdminStore.getErrorRoles(),

        loadingUpdateResources : ElstrAdminStore.getLoadingUpdateResources(),
        loadingUpdateRoles : ElstrAdminStore.getLoadingUpdateRoles()

    };
}

var ResourceCell = React.createClass({


    getInitialState: function(){
        return {
            visible: false
        };
    },

    setVisibleTrue: function(){
        this.state.visible = true;
        this.setState(this.state);
    },
    setVisibleFalse: function(){
        this.state.visible = false;
        this.setState(this.state);
    },
    onSelect: function(){

        console.log(this.refs.select.getDOMNode().value);

        var accessRight = this.refs.select.getDOMNode().value;

        var resourceName = this.props.name;
        var roleName = this.props.roleName;

        ElstrAdminActions.updateAcessright(accessRight, resourceName, roleName);

        this.state.visible = false;
        this.setState(this.state);
    },
    render : function(){

         var cell;

         if (this.state.visible && !this.props.isCore){
             // onClick={this.setVisibleFalse}

             var selectStyle = {
                 margin: "0px",
                 padding: "0px"
             };

             if (this.props.hasParent){
                 cell = (
                     <td>
                         <select ref="select" style={selectStyle} defaultValue={this.props.value} onChange={this.onSelect} >
                             <option value="allow" >Allow</option>
                             <option value="deny" >Deny</option>
                             <option value="inherit" >Inherit ({this.props.valueOriginal})</option>
                         </select><button onClick={this.setVisibleFalse}>x</button>
                     </td>);
             }else{
                 cell = (
                     <td>
                         <select ref="select" style={selectStyle} defaultValue={this.props.value} onChange={this.onSelect} >
                             <option value="allow" >Allow</option>
                             <option value="deny" >Deny</option>
                         </select><button onClick={this.setVisibleFalse}>x</button>
                     </td>);
             }

         }else{

             if (this.props.value == this.props.valueOriginal){

                 cell = (<td onClick={this.setVisibleTrue} className="greenCell cursorPointer" > {ElstrLangStore.text("allow")} </td>);
                 if (this.props.value != "allow") cell = (<td onClick={this.setVisibleTrue} className="redCell cursorPointer" > {ElstrLangStore.text("deny")} </td>);

             }else{

                 var valueOriginal = this.props.valueOriginal;

                 if (valueOriginal === null) valueOriginal = "-";
                 else if (valueOriginal !== null) valueOriginal = "("+valueOriginal+")";

                 if (this.props.value == "allow"){
                     cell = (<td onClick={this.setVisibleTrue} className="greenCell cursorPointer" > {ElstrLangStore.text("allow")} {valueOriginal}</td>);
                 }else{
                     cell = (<td onClick={this.setVisibleTrue} className="redCell cursorPointer" > {ElstrLangStore.text("deny")} {valueOriginal}</td>);
                 }

             }

         }

        return cell;

    }

});

var AdminPanel = React.createClass({

    mixins: [
        ElstrLangStore.mixin,
        ElstrAdminStore.mixin],

    getInitialState: function(){
        return _getState();
    },

    storeDidChange: function () {

        this.state.roles = ElstrAdminStore.getRoles();
        this.state.resources = ElstrAdminStore.getResources();

        this.state.loadingResources = ElstrAdminStore.getLoadingResources();
        this.state.loadingRoles = ElstrAdminStore.getLoadingRoles();

        this.state.errorResources = ElstrAdminStore.getErrorResources();
        this.state.errorRoles = ElstrAdminStore.getErrorRoles();

        this.state.loadingUpdateResources = ElstrAdminStore.getLoadingUpdateResources();
        this.state.loadingUpdateRoles = ElstrAdminStore.getLoadingUpdateRoles();

        this.setState(this.state);
    },


    componentWillMount: function(){

        ElstrAdminActions.getRoleList();
        ElstrAdminActions.getResourceList();
    },

    changeRolle: function(rolle, e){
        console.log("changeRolle",rolle, e);

        this.state.rolle = rolle;
        this.setState(this.state);

    },

    changeResource: function(resource, e){
        console.log("changeResource",resource, e);

        this.state.resource = resource;
        this.setState(this.state);
    },

    changeApplication: function(application, e){
        console.log("changeApplication",application, e);

        this.state.application = application;
        this.setState(this.state);
    },



    changeRolleApply: function(){
        console.log("changeRolleApply",this.refs.roleText);

        var modeRolle = this.state.rolle;
        var roleName = this.refs.roleText.getValue();

        console.log("changeRolleApply",modeRolle, roleName);

        ElstrAdminActions.updateRole(modeRolle, roleName);

        this.state.rolleText = "";
        this.setState(this.state);
    },

    changeResourceApply: function(){
        console.log("changeResourceApply",this.refs.resourceText);

        var modeResource = this.state.resource;
        var resourceName = this.refs.resourceText.getValue();

        var type = this.state.application;

        console.log("changeRolleApply",modeResource, resourceName, type);

        ElstrAdminActions.updateResource( modeResource, resourceName, type);

        this.state.resourceText = "";
        this.setState(this.state);
    },

    changeRolleText: function(event){
        console.log("changeRolleText");

        this.state.rolleText = event.target.value;
        this.setState(this.state);

    },
    changeResourceText: function(event){
        console.log("changeResourceText");

        this.state.resourceText = event.target.value;
        this.setState(this.state);

    },

    changeRolleTextFixed: function(value){
        console.log("changeRolleTextFixed");

        this.state.rolleText = value;
        this.setState(this.state);

    },

    changeResourceTextFixed: function(value){
        console.log("changeResourceTextFixed");

        this.state.resourceText = value;
        this.setState(this.state);

    },

    changeApplicationFixed: function(value){
        console.log("changeApplicationFixed",value);

        this.state.application = value;
        this.setState(this.state);
    },

    getRow: function (type, name, resourceData, roles,isCore){

        var extraCels = [];

        for (var i = 0; i < roles.length; i++) {
            var roleName = roles[i].origin;
            var value = resourceData[roleName];
            var valueOriginal = resourceData[roleName+"_original"];

            var hasParent = roles[i].parent;

            extraCels.push(<ResourceCell type={type} name={name} roleName={roleName} value={value} valueOriginal={valueOriginal} isCore={isCore} hasParent={hasParent}  />);

        }

        var classN;
        if (isCore) classN = "isCore";

        return (
            <tr className={classN} >
                <td className="cursorPointer" onClick={this.changeApplicationFixed.bind(this, type)} >
                    {type}
                </td>
                <td className="cursorPointer" onClick={this.changeResourceTextFixed.bind(this, name)} >
                    {name}
                </td>
                {extraCels}
            </tr>);

    },

    getRowRole: function (roleName, parent){

        return (
            <tr>
                <td className="cursorPointer" onClick={this.changeRolleTextFixed.bind(this, roleName)} >
                    {roleName}
                </td>
                <td className="cursorPointer" onClick={this.changeRolleTextFixed.bind(this, parent)} >
                    {parent}
                </td>
            </tr>);
    },

    getHeaderRole: function (roleName){

        return (
            <th>
                {roleName}
            </th>
        );
    },


    render: function() {

        var maxWidthStyle = {
            width: "40%"
        };

        var resources_rows = [];
        var roles_rows = [];
        var roleNames = [];

        var roles_headers = [];

        if (this.state.roles){
            for (var j = 0; j < this.state.roles.length; j++) {

                var roleName = this.state.roles[j].name;
                var roleParentName = this.state.roles[j].parent;

                roleNames.push({
                    origin: roleName,
                    parent: roleParentName
                });

                roles_rows.push(this.getRowRole(roleName, roleParentName));
                roles_headers.push(this.getHeaderRole(roleName));

            }
        }

        if (this.state.resources) {
            for (var i = 0; i < this.state.resources.length; i++) {

                var resourceData = this.state.resources[i];

                var type = resourceData.type;
                var name = resourceData.name;
                var isCore = (resourceData.isCore == "1");

                resources_rows.push(this.getRow(type, name, resourceData, roleNames, isCore));
            }
        }

        var loadingResources;
        var loadingRoles;
        var errorResources;
        var errorRoles;
        var loadingUpdateResources;
        var loadingUpdateRoles;

        if (this.state.loadingResources){
            loadingResources = (
                <div className="alert alert-info" role="alert">
                    {ElstrLangStore.text("WIRD_GELADEN")}
                </div>);
        }
        if (this.state.loadingRoles){
            loadingRoles = (
                <div className="alert alert-info" role="alert">
                    {ElstrLangStore.text("WIRD_GELADEN")}
                </div>);
        }

        if (this.state.errorResources){
            errorResources = (
                <div className="alert alert-danger" role="alert">
                    {this.state.errorResources}
                </div>);
        }
        if (this.state.errorRoles){
            errorRoles = (
                <div className="alert alert-danger" role="alert">
                    {this.state.errorRoles}
                </div>);
        }

        if (this.state.loadingUpdateResources){
            loadingUpdateResources = (
                <div className="alert alert-info" role="alert">
                    {ElstrLangStore.text("WIRD_GELADEN")}
                </div>);
        }
        if (this.state.loadingUpdateRoles){
            loadingUpdateRoles = (
                <div className="alert alert-info" role="alert">
                    {ElstrLangStore.text("WIRD_GELADEN")}
                </div>);
        }


        return (
            <Row>
                <Col xs={12} md={3}>
                    <h3>
                        <span textid='Roles'>{ElstrLangStore.text("Roles")}</span>
                    </h3>
                    <div>
                        <div>
                            <ButtonGroup>
                                <Input ref="roleText" id='elstrAdminConsoleRoleHandlerInput' type='text'

                                    value={this.state.rolleText}
                                    onChange={this.changeRolleText}

                                    buttonBefore={
                                        <DropdownButton title={this.state.rolle} >
                                            <MenuItem onSelect={this.changeRolle.bind(this,"add")}  eventKey="1">{ElstrLangStore.text("Add")}</MenuItem>
                                            <MenuItem onSelect={this.changeRolle.bind(this,"delete")}  eventKey="2">{ElstrLangStore.text("Delete")}</MenuItem>
                                        </DropdownButton>}
                                    buttonAfter={
                                        <Button id='elstrAdminConsoleRoleHandlerButton' onClick={this.changeRolleApply}>{ElstrLangStore.text("Go!")}</Button>}
                                />

                            </ButtonGroup>
                        </div>
                        <div>

                            {loadingRoles}
                            {errorRoles}
                            {loadingUpdateRoles}

                            <table className="ElstrAdminTable">
                                <thead>
                                    <tr>
                                        <th>
                                                {ElstrLangStore.text("Name")}
                                        </th>
                                        <th>
                                                {ElstrLangStore.text("Inherits from")}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                        {roles_rows}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Col>
                <Col xs={12} md={9}>

                    <div>
                        <Col xs={12}>
                            <h3><span textid='Resources'>{ElstrLangStore.text("Resources")}</span></h3>
                        </Col>
                    </div>
                    <div>
                        <Col xs={10}>
                            <ButtonGroup>

                                <Input ref="resourceText" id='elstrAdminConsoleResourceHandlerMode' type='text'

                                    value={this.state.resourceText}
                                    onChange={this.changeResourceText}

                                    buttonBefore={
                                        <DropdownButton title={this.state.resource} >
                                            <MenuItem eventKey="a" onSelect={this.changeResource.bind(this,"add")} >{ElstrLangStore.text("Add")}</MenuItem>
                                            <MenuItem eventKey="d" onSelect={this.changeResource.bind(this,"delete")} >{ElstrLangStore.text("Delete")}</MenuItem>
                                        </DropdownButton>}
                                    buttonAfter={
                                        <DropdownButton title={this.state.application} >
                                            <MenuItem eventKey="a" onSelect={this.changeApplication.bind(this,"Application")} >{ElstrLangStore.text("Application")}</MenuItem>
                                            <MenuItem eventKey="s" onSelect={this.changeApplication.bind(this,"Service")} >{ElstrLangStore.text("Service")}</MenuItem>
                                            <MenuItem eventKey="w" onSelect={this.changeApplication.bind(this,"WidgetServer")} >{ElstrLangStore.text("WidgetServer")}</MenuItem>
                                            <MenuItem eventKey="m" onSelect={this.changeApplication.bind(this,"Method")} >{ElstrLangStore.text("Method")}</MenuItem>
                                        </DropdownButton>}
                                />

                            </ButtonGroup>
                        </Col>
                        <Col xs={2}>
                            <Button id='elstrAdminConsoleResourceHandlerButton' onClick={this.changeResourceApply} >{ElstrLangStore.text("Go!")}</Button>
                        </Col>
                    </div>
                    <div>
                        <Col xs={12}>

                                {loadingResources}
                                {errorResources}
                                {loadingUpdateResources}

                            <table className="ElstrAdminTable">
                                <thead>
                                    <tr>
                                        <th>
                                        {ElstrLangStore.text("Type")}
                                        </th>
                                        <th style={maxWidthStyle} >
                                        {ElstrLangStore.text("Name")}
                                        </th>
                                        {roles_headers}
                                    </tr>
                                </thead>
                                <tbody>
                                        {resources_rows}
                                </tbody>
                            </table>
                        </Col>
                    </div>
                </Col>
            </Row>
        );
    }

});

module.exports = AdminPanel;