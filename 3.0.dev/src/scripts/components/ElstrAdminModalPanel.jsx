/**
 * Copyright 2014, Intelliact AG
 * Copyrights licensed under the New BSD License
 * Created by sahun@intelliact on 20.03.2015.
 *
 * Admin button that opens a bootstrap modal window with an admin Panel.
 */

var React = require('react');
var ElstrLangStore = require('../stores/ElstrLangStore');


/**
 * Bootstrap elements.
 */

var DropdownButton = require('react-bootstrap/DropdownButton');
var Button = require('react-bootstrap/Button');
var MenuItem = require('react-bootstrap/MenuItem');
var Modal = require('react-bootstrap/Modal');
var ButtonGroup = require('react-bootstrap/ButtonGroup');
var Input = require('react-bootstrap/Input');

var Row = require('react-bootstrap/Row');
var Col = require('react-bootstrap/Col');

/**
 * Custom CSS elements
 */
require('../../css/ElstrAdminPanel.css');

/**
 * Content of the modal window.
 */
var ElstrAdminPanel = require('./ElstrAdminPanel');

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

                        <ElstrAdminPanel />

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