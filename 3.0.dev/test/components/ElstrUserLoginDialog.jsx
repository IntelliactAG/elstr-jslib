/**
 * Created by sahun on 02.12.2014.
 */

var React = require('react/addons');
var ReactTestUtils = React.addons.TestUtils;

var ElstrUserLoginDialog = require("../../src/scripts/components/ElstrUserLoginDialog.jsx");

describe("ElstrUserHandler", function() {

    var elstrUserLoginDialog = ReactTestUtils.renderIntoDocument(
        <ElstrUserLoginDialog />
    );

    it ("Default state", function() {

        expect(elstrUserLoginDialog.state.isAuth).toBe(false);
        expect(elstrUserLoginDialog.state.loading).toBe(false);
        expect(elstrUserLoginDialog.state.forceAuthentication).toBe(true);
        expect(elstrUserLoginDialog.state.message).toEqual({});

    });

    it ("Defined a form", function() {

        // Verify that it's Off by default
        var form = ReactTestUtils.findRenderedDOMComponentWithTag(
            elstrUserLoginDialog, 'form');

        expect(form).toBeDefined();

    });

    it ("Defined 2 inputs", function() {

        var inputs = ReactTestUtils.scryRenderedDOMComponentsWithTag(
            elstrUserLoginDialog, 'input');

        expect(inputs.length).toBe(2);

        // By references
        expect(elstrUserLoginDialog.refs.username).toBeDefined();
        expect(elstrUserLoginDialog.refs.password).toBeDefined();

    });

    it ("Defined 2 inputs empty", function() {

        expect(elstrUserLoginDialog.refs.username.getDOMNode().value).toEqual("");
        expect(elstrUserLoginDialog.refs.password.getDOMNode().value).toEqual("");

    });

    it ("Has a submit button", function (){

        // Verify that it's Off by default
        var button = ReactTestUtils.findRenderedDOMComponentWithClass(
            elstrUserLoginDialog, 'btn-primary');

        expect(button).toBeDefined();
        expect(button.props.type).toEqual("submit");

    });

    /*
    it ("Username gets value", function() {

        var usernameNode = elstrUserLoginDialog.refs.username.getDOMNode();

        console.log(usernameNode);

        ReactTestUtils.Simulate.click(usernameNode);
        ReactTestUtils.Simulate.change(usernameNode, {target: {value: 'vaca'}});
        ReactTestUtils.Simulate.keyDown(usernameNode, {key: "Enter"});

        console.log(usernameNode);

        expect(usernameNode.value).toEqual("vaca");

    });
*/
    var previousError;

    it ("Submit the form with back username", function() {

        // Verify that it's Off by default
        var button = ReactTestUtils.findRenderedDOMComponentWithClass(
            elstrUserLoginDialog, 'btn-primary');

        ReactTestUtils.Simulate.click(button);

        // Now we get an error.
        expect(elstrUserLoginDialog.state.message).not.toEqual({});
        previousError = elstrUserLoginDialog.state.message.text;

    });

    it ("Submit the form with full username and no password", function() {

        var usernameNode = elstrUserLoginDialog.refs.username.getDOMNode();
        usernameNode.value = 'foouser';

        // Verify that it's Off by default
        var button = ReactTestUtils.findRenderedDOMComponentWithClass(
            elstrUserLoginDialog, 'btn-primary');

        ReactTestUtils.Simulate.click(button);

        // Now we get an error.
        expect(elstrUserLoginDialog.state.message).not.toEqual({});
        expect(elstrUserLoginDialog.state.message.text).not.toEqual(previousError);

    });

    it ("Submit the form with full username and no password", function() {

        var passwordNode = elstrUserLoginDialog.refs.password.getDOMNode();
        passwordNode.value = 'foopasword ';

        // Verify that it's Off by default
        var button = ReactTestUtils.findRenderedDOMComponentWithClass(
            elstrUserLoginDialog, 'btn-primary');

        ReactTestUtils.Simulate.click(button);
        // Now we get an error.
        expect(elstrUserLoginDialog.state.isAuth).toBe(false);
        expect(elstrUserLoginDialog.state.loading).toBe(false);
        expect(elstrUserLoginDialog.state.forceAuthentication).toBe(true);
        expect(elstrUserLoginDialog.state.message).toEqual({});

    });




});