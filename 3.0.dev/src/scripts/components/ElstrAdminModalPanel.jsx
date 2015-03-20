/**
 * Admin button that opens a bootstrap modal window with an admin Panel.
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

require('../../css/ElstrAdminPanel.css');

var AdminPanel = require('./AdminPanel');

function _getState(){
    return {
        showWindow: false
    };
}


var AdminModalPanel = React.createClass({

    mixins: [ElstrLangStore.mixin],

    getInitialState: function(){
        return _getState();
    },

    storeDidChange: function () {

        this.setState(this.state);
    },

    showWindow: function(){
        this.state.showWindow = true;

        this.setState(this.state);
    },

    hideWindow: function(){
        this.state.showWindow = false;
        this.setState(this.state);
    },

    render: function() {

        var modalW;

        if (this.state.showWindow){

            modalW = (
                <Modal className="ElstrAdminModal" title={ElstrLangStore.text("Admin")}
                    backdrop={true}
                    animation={false}
                    onRequestHide={this.hideWindow}>

                    <div className="modal-body">

                        <AdminPanel />

                    </div>
                </Modal>
            );
        }
        return (
            <span>
                <span onClick={this.showWindow}>{ElstrLangStore.text("admin")}</span>
                {modalW}
            </span>
        );

    }

});

module.exports = AdminModalPanel;