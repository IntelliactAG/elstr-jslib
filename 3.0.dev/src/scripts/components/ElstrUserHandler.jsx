var React = require('react');

var ElstrUserStore = require('../stores/ElstrUserStore');
var ElstrUserActions = require('../actions/ElstrUserActions');
var ElstrLog = require('../ElstrLog');
var ElstrLangStore = require('../stores/ElstrLangStore');
var ElstrUserLoginDialog = require('./ElstrUserLoginDialog');

var ElstrUserHandlerCss = require('../../css/ElstrUserHandler.css');

var ElstrUserHandler = React.createClass({

    mixins: [ElstrUserStore.mixin,ElstrLangStore.mixin],

    onChange: function() {
        if(ElstrUserStore.isAuth() === true){
            this.state.showLoginDialog = false;
        } else {
            if (ElstrUserStore.forceAuthentication() === true){
                this.state.showLoginDialog = true;
            }
        }
        this.state.username = ElstrUserStore.getUsername();
        this.state.isAuth = ElstrUserStore.isAuth();
        this.state.isAdmin = ElstrUserStore.isAdmin();
        this.setState(this.state);
    },

    getInitialState: function() {
        var showLoginDialog = false
        if (ElstrUserStore.forceAuthentication() === true && ElstrUserStore.isAuth() === false) {
            showLoginDialog = true;
        }
        return {
            username: ElstrUserStore.getUsername(),
            isAuth: ElstrUserStore.isAuth(),
            isAdmin: ElstrUserStore.isAdmin(),
            showLoginDialog: showLoginDialog
        };
    },
    showLoginDialog: function(e) {
        e.preventDefault()
        ElstrLog.trace("ElstrUserHandler.showLoginDialog");
        this.state.showLoginDialog = true;
        this.setState(this.state);
    },
    hideLoginDialog: function() {
        ElstrLog.trace("ElstrUserHandler.hideLoginDialog");
        console.log("hideLoginDialog");
        if (ElstrUserStore.forceAuthentication() === false){
            this.state.showLoginDialog = false;   

        }
        this.setState(this.state);
    },
    logout: function(e) {
        e.preventDefault()
        ElstrLog.trace("ElstrUserHandler.logout");
        ElstrUserActions.logout();
    },
    admin: function(e) {
        e.preventDefault()
        ElstrLog.trace("ElstrUserHandler.admin");
        //
        ElstrLog.error("admin interface is not implemented");
    },
    render: function() {
        var liUsername = <li className="username"><span>egli@intelliact-net.local</span></li>;
        var liLogin = <li><a href="#" title="Anmelden" className="login" onClick={this.showLoginDialog}>{ElstrLangStore.text("ANMELDEN")}</a></li>;
        var liLogout = <li><a href="#" title="Abmelden" className="logout" onClick={this.logout}>{ElstrLangStore.text("ABMELDEN")}</a></li>;
        var liAdmin = <li><a href="#" title="Admin" className="admin" onClick={this.admin}>Admin</a></li>;

        if (this.state.isAuth === true) {
            liLogin =  null;
        } else {
            liUsername = null;
            liLogout = null;
        }
        if (this.state.isAdmin !== true) {
            liAdmin = null;
        }

        var loginDialog;
        if(this.state.showLoginDialog){
            loginDialog = <ElstrUserLoginDialog hideLoginDialog={this.hideLoginDialog} />;
        }

        return (
            <div className="elstrUserHandler">

                {loginDialog}

                <ul>
                    {liUsername}
                    {liLogin}
                    {liLogout}
                    {liAdmin}


                </ul>
            </div>
        );
    }
});
module.exports = ElstrUserHandler;