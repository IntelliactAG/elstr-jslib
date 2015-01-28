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
require('font-awesome/css/font-awesome.css'); 

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

        var txtBold = (<span className="fa fa-bold fa-lg" ></span>),
            txtItalic = (<span className="fa fa-italic fa-lg" ></span>),
            txtStrikeThrough = (<span className="fa fa-strikethrough fa-lg" ></span>),
        
            txtLink = (<span className="fa fa-chain fa-lg" ></span>),
            txtUnlink = (<span className="fa fa-chain-broken fa-lg" ></span>),

            txtOrderedList = (<span><span className="fa fa-list-ol fa-lg" ></span></span>),
            txtUnorderedList = (<span><span className="fa fa-list-ul fa-lg" ></span></span>),

            txtIndent = (<span className="fa fa-indent fa-lg" ></span>),
            txtOutdent = (<span className="fa fa-outdent fa-lg" ></span>),

            txtBlockquote = (<span className="fa fa-quote-right fa-lg" ></span>),
            txtCode = (<span className="fa fa-code fa-lg" ></span>),

            txtRemoveFormatting = (<span className="fa fa-remove fa-lg" ></span>),
            txtUndo = (<span className="fa fa-rotate-left fa-lg" ></span>),
            txtRedo = (<span className="fa fa-rotate-right fa-lg" ></span>);
        
        return (
            <div className="wysiwyg">
                <div className="toolbar" ref="toolbar">

                    <div className="btn-toolbar" role="toolbar">
                        <div className="btn-group" role="group">
                            <button type="button" className="btn btn-default btn-sm" data-command-name="bold">{txtBold}</button>
                            <button type="button" className="btn btn-default btn-sm" data-command-name="italic">{txtItalic}</button>
                            <button type="button" className="btn btn-default btn-sm" data-command-name="strikeThrough">{txtStrikeThrough}</button>                        
                        </div>
                        <div className="btn-group" role="group">
                            <button type="button" className="btn btn-default btn-sm" data-command-name="linkPrompt">{txtLink}</button>
                            <button type="button" className="btn btn-default btn-sm" data-command-name="unlink">{txtUnlink}</button>
                        </div>
                        <div className="btn-group" role="group">
                            <button type="button" className="btn btn-default btn-sm" data-command-name="insertOrderedList">{txtOrderedList}</button>
                            <button type="button" className="btn btn-default btn-sm" data-command-name="insertUnorderedList">{txtUnorderedList}</button>
                        </div>
                        <div className="btn-group" role="group">
                            <button type="button" className="btn btn-default btn-sm" data-command-name="indent">{txtIndent}</button>
                            <button type="button" className="btn btn-default btn-sm" data-command-name="outdent">{txtOutdent}</button>
                        </div>
                        <div className="btn-group" role="group">
                            <button type="button" className="btn btn-default btn-sm" data-command-name="blockquote">{txtBlockquote}</button>
                            <button type="button" className="btn btn-default btn-sm" data-command-name="code">{txtCode}</button>
                        </div>
                        <div className="btn-group" role="group">
                            <button type="button" className="btn btn-default btn-sm" data-command-name="removeFormat">{txtRemoveFormatting}</button>
                            <button type="button" className="btn btn-default btn-sm" data-command-name="undo">{txtUndo}</button>
                            <button type="button" className="btn btn-default btn-sm" data-command-name="redo">{txtRedo}</button>
                        </div>
                    </div>

                </div>
                <div className="scribe"  contentEditable="true" ref="scribe" />
            </div>
        );

    }
});

module.exports = ElstrWysiwyg;