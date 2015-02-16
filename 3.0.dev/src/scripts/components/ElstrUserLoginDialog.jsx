var React = require('react');

var ElstrUserStore = require('../stores/ElstrUserStore');
var ElstrUserActions = require('../actions/ElstrUserActions');
var ElstrLog = require('../ElstrLog');
var ElstrLangStore = require('../stores/ElstrLangStore');

var Modal = require('react-bootstrap/Modal');
var Button = require('react-bootstrap/Button');
var Alert = require('react-bootstrap/Alert');

// Component css
require('../../css/ElstrUserLoginDialog.css');

var ElstrUserLoginDialog = React.createClass({

    mixins: [ElstrLangStore.mixin],

    getDefaultProps: function() {
        return {

            // By default hide Login dialog does nothing.
            hideLoginDialog: function(){},
            isAuth: ElstrUserStore.isAuth(),
            loading: ElstrUserStore.isLoading(),
            message: {}
        };
    },

    onChange: function() {
        this.storeDidChange();
    },

    storeDidChange: function() {

        this.state.forceAuthentication = ElstrUserStore.forceAuthentication();
        this.setState(this.state);

    },

    getInitialState: function() {
        return {
            forceAuthentication: ElstrUserStore.forceAuthentication(),
            isAuth: this.props.isAuth,
            loading: this.props.loading,
            message: this.props.message
        };
    },

    handleSubmit: function(e) {
        e.preventDefault();
        var username = this.refs.username.getDOMNode().value.trim();
        var password = this.refs.password.getDOMNode().value;

        if(username === ""){
            ElstrUserActions.didLogin("fail", null, null, null, null, null, "A username is required");
        } else if (password === "") {
            ElstrUserActions.didLogin("fail", null, null, null, null, null, "A password is required");
        } else {
            ElstrUserActions.login(username,password,"");
        }
    },

    componentDidMount: function() {
        this.refs.username.getDOMNode().focus();
    },

    render: function() {

        var cancelButton;
        if (this.state.forceAuthentication === false) {
            cancelButton = <Button onClick={this.props.hideLoginDialog}> {ElstrLangStore.text("Cancel")}</Button>;
        }

        var message;
        if(this.props.message){
            if(this.props.message.text && this.props.message.style){
                // Non structured errors.
                message = <Alert bsStyle={this.props.message.style}>{ElstrLangStore.text(this.props.message.text)}</Alert>;
            }
        }

        var submitButton;
        if(this.props.loading === false){
            submitButton = <Button bsStyle="primary" type="submit" onClick={this.handleSubmit}>{ElstrLangStore.text("Login")}</Button>;
        } else {
            submitButton = <Button bsStyle="info" disabled>{ElstrLangStore.text("Checking credentials ...")}</Button>;
        }

        return (
            <div className="elstrUserLoginDialog">
                <Modal title={ElstrLangStore.text("Login")}
                    backdrop={false}
                    animation={true}
                    onRequestHide={this.props.hideLoginDialog}>
                    <form>
                        <div className="modal-body">
                            <div className="form-group">
                                <label htmlFor="elstrUserLoginDialogInputUsername">{ElstrLangStore.text("Username")}</label>
                                <input ref="username" type="text" className="form-control" id="elstrUserLoginDialogInputUsername" placeholder={ElstrLangStore.text("Username")} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="elstrUserLoginDialogInputPassword">{ElstrLangStore.text("Password")}</label>
                                <input ref="password" type="password" className="form-control" id="elstrUserLoginDialogInputPassword" placeholder={ElstrLangStore.text("Password")} required />
                            </div>
                            {message}
                        </div>
                        <div className="modal-footer">
                            {submitButton}
                            {cancelButton}
                        </div>
                    </form>
                </Modal>
            </div>
        );

    }
});
module.exports = ElstrUserLoginDialog;