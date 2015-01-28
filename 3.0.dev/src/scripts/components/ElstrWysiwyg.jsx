/**
 * Bom Compare component
 * Contains the 6 tables representing the item information & changes.
 * This tables take in account the status of the filters.
 */

var React = require('react');

var ElstrLog = require('../ElstrLog');
var ElstrLangStore = require('../stores/ElstrLangStore');

var Scribe = require('scribe-editor');
var ScribePluginToolbar = require('scribe-plugin-toolbar');

var ScribePluginBlockquoteCommand = require("scribe-plugin-blockquote-command");
var ScribePluginCodeCommand = require("scribe-plugin-code-command");

var ScribePluginCurlyQuotes = require("scribe-plugin-curly-quotes");
var ScribePluginCodeHeadingCommand = require("scribe-plugin-heading-command");
var ScribePluginCodeIntelligentUnlinkCommand = require("scribe-plugin-intelligent-unlink-command");
var ScribePluginCodeKeyboardShortcuts = require("scribe-plugin-keyboard-shortcuts");
var ScribePluginCodeLinkPromptCommand = require("scribe-plugin-link-prompt-command");

// We load also the css
require('../../css/ElstrWysiwyg.css');

var ElstrWysiwyg = React.createClass({

    mixins: [ElstrLangStore.mixin],

    onChange: function () {
        // Nothing to do
    },

    getInitialState: function() {
        return {
        };
    },

    componentDidMount: function(){

        var scribeOptions = {
            allowBlockElements: true,
            debug: false
        };

        var scribeElement = this.refs.scribe.getDOMNode();
        var scribe = new Scribe(scribeElement, scribeOptions);

        var toolbarElement = this.refs.toolbar.getDOMNode();
        scribe.use(ScribePluginToolbar(toolbarElement));

        /* Optional plugins */
        scribe.use(ScribePluginBlockquoteCommand());
        scribe.use(ScribePluginCodeCommand());
        scribe.use(ScribePluginCurlyQuotes());
        scribe.use(ScribePluginCodeHeadingCommand());
        scribe.use(ScribePluginCodeIntelligentUnlinkCommand());
        scribe.use(ScribePluginCodeKeyboardShortcuts());
        scribe.use(ScribePluginCodeLinkPromptCommand());

        var that = this;
        if (this.props.updateData) {
            scribe.on('content-changed', function(){
                var html = scribe.getHTML();
                that.props.updateData(html);
            });
        }

    },

    render: function() {

        var txtBold = ElstrLangStore.text("Bold");
        var txtItalic = ElstrLangStore.text("Italic");
        var txtStrikeThrough = ElstrLangStore.text("Strike Through");
        var txtRemoveFormatting = ElstrLangStore.text("Remove Formatting");
        var txtLink = ElstrLangStore.text("Link");
        var txtUnlink = ElstrLangStore.text("Unlink");
        var txtOrderedList = ElstrLangStore.text("Ordered List");
        var txtUnorderedList = ElstrLangStore.text("Unordered List");
        var txtIndent = ElstrLangStore.text("Indent");
        var txtOutdent = ElstrLangStore.text("Outdent");
        var txtBlockquote = ElstrLangStore.text("Blockquote");
        var txtCode = ElstrLangStore.text("Code");
        var txtUndo = ElstrLangStore.text("Undo");
        var txtRedo = ElstrLangStore.text("Redo");

        if (this.props.icons){

            var lineStyle = {
                textDecoration: 'line-through'
            };

            txtBold = (<span className="glyphicon glyphicon-bold" ></span>);
            txtItalic = (<span className="glyphicon glyphicon-italic" ></span>);
            txtStrikeThrough = (<span style={lineStyle} className="glyphicon glyphicon-none" >Line</span>);
            txtRemoveFormatting = (<span className="glyphicon glyphicon-none" >Clean</span>);

            txtLink = (<span className="glyphicon glyphicon-link" >Link</span>);
            txtUnlink = (<span style={lineStyle} className="glyphicon glyphicon-link" >Unlink</span>);

            txtOrderedList = (<span><span className="glyphicon glyphicon-list" ></span> Ordered</span>);
            txtUnorderedList = (<span><span className="glyphicon glyphicon-list" ></span> Unordered</span>);

            txtIndent = (<span className="glyphicon glyphicon-indent-left" ></span>);
            txtOutdent = (<span className="glyphicon glyphicon-indent-right" ></span>);

            txtBlockquote = (<span className="glyphicon glyphicon-none" >Blockquote</span>);
            txtCode = (<span className="glyphicon glyphicon-pencil" ></span>);

            txtUndo = (<span className="glyphicon glyphicon-step-backward" ></span>);
            txtRedo = (<span className="glyphicon glyphicon-step-forward" ></span>);

        }

        return (
            <div className="wysiwyg">
                <div className="toolbar" ref="toolbar">

                    <div className="btn-toolbar" role="toolbar">
                        <div className="btn-group" role="group">
                            <button type="button" className="btn btn-default" data-command-name="bold">{txtBold}</button>
                            <button type="button" className="btn btn-default" data-command-name="italic">{txtItalic}</button>
                            <button type="button" className="btn btn-default" data-command-name="strikeThrough">{txtStrikeThrough}</button>
                            <button type="button" className="btn btn-default" data-command-name="removeFormat">{txtRemoveFormatting}</button>
                        </div>
                        <div className="btn-group" role="group">
                            <button type="button" className="btn btn-default" data-command-name="linkPrompt">{txtLink}</button>
                            <button type="button" className="btn btn-default" data-command-name="unlink">{txtUnlink}</button>
                        </div>
                        <div className="btn-group" role="group">
                            <button type="button" className="btn btn-default" data-command-name="insertOrderedList">{txtOrderedList}</button>
                            <button type="button" className="btn btn-default" data-command-name="insertUnorderedList">{txtUnorderedList}</button>
                        </div>
                        <div className="btn-group" role="group">
                            <button type="button" className="btn btn-default" data-command-name="indent">{txtIndent}</button>
                            <button type="button" className="btn btn-default" data-command-name="outdent">{txtOutdent}</button>
                        </div>
                        <div className="btn-group" role="group">
                            <button type="button" className="btn btn-default" data-command-name="blockquote">{txtBlockquote}</button>
                            <button type="button" className="btn btn-default" data-command-name="code">{txtCode}</button>
                        </div>
                        <div className="btn-group" role="group">
                            <button type="button" className="btn btn-default" data-command-name="undo">{txtUndo}</button>
                            <button type="button" className="btn btn-default" data-command-name="redo">{txtRedo}</button>
                        </div>
                    </div>

                </div>
                <div className="scribe"  contentEditable="true" ref="scribe" />
            </div>
        );

    }
});

module.exports = ElstrWysiwyg;