var React = require('react');

var ElstrUserStore = require('../stores/ElstrUserStore');
var ElstrUserActions = require('../actions/ElstrUserActions');
var ElstrLog = require('../ElstrLog');
var ElstrLangStore = require('../stores/ElstrLangStore');

var Modal = require('react-bootstrap/Modal');
var Button = require('react-bootstrap/Button');
var Alert = require('react-bootstrap/Alert');

var ElstrUserLoginDialogCss = require('../../css/ElstrUserLoginDialog.css');

var ElstrUserLoginDialog = React.createClass({

    mixins: [ElstrUserStore.mixin, ElstrLangStore.mixin],

    getDefaultProps: function() {
        return {

            // By default hide Login dialog does nothing.
            hideLoginDialog: function(){}

        };
    },

    onChange: function() {
        this.state.isAuth = ElstrUserStore.isAuth();
        this.state.loading = ElstrUserStore.isLoading();
        if(ElstrUserStore.getMessage()){
            this.state.message.text = ElstrUserStore.getMessage();
            this.state.message.style = "danger";
        } else {
            this.state.message = {};
        }
        this.setState(this.state);
    },

    getInitialState: function() {
        return {
            isAuth: ElstrUserStore.isAuth(),
            loading: ElstrUserStore.isLoading(),            
            forceAuthentication: ElstrUserStore.forceAuthentication(),
            message: {}
        };
    },

    handleSubmit: function(e) {
        e.preventDefault();
        var username = this.refs.username.getDOMNode().value.trim();
        var password = this.refs.password.getDOMNode().value;

        if(username === ""){
            this.state.message.text = "A username is required";
            this.state.message.style = "info";
            this.setState(this.state);
        } else if (password === "") {
            this.state.message.text = "A password is required";
            this.state.message.style = "info";
            this.setState(this.state);
        } else {
            this.state.message = {};
            this.setState(this.state);            
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
        if(this.state.message.text && this.state.message.style){
            message = <Alert bsStyle={this.state.message.style}>{ElstrLangStore.text(this.state.message.text)}</Alert>;
        }

        var submitButton;
        if(this.state.loading === false){
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