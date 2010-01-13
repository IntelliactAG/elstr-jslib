YUI.add('spinner', function(Y) {

/**
 * Create a sliding value range input visualized as a draggable thumb on a
 * background element.
 * 
 * @module spinner
 */

var Lang = Y.Lang,
    Widget = Y.Widget,
    Node = Y.Node;

Y.ELSTR = YUI.namespace("elstr");

/**
 * Create a spinner to represent an integer value between a given minimum and
 * maximum.  Sliders may be aligned vertically or horizontally, based on the
 * <code>axis</code> configuration.
 *
 * @class Spinner
 * @extends Widget
 * @param config {Object} Configuration object
 * @constructor
 */
function Spinner() {
    Spinner.superclass.constructor.apply(this,arguments);
}



Y.mix(Spinner, {


    /**
     * The identity of the widget.
     *
     * @property Spinner.NAME
     * @type String
     * @static
     */
    NAME : "Spinner",


    INPUT_CLASS : 'yui-spinner-value',

    INPUT_TEMPLATE : '<input type="text" class="yui-spinner-value">',
    BTN_TEMPLATE : '<button type="button"></button>',


    HTML_PARSER : {
        value: function (contentBox) {
            var node = contentBox.query(".yui-spinner-value");
            return (node) ? parseInt(node.get("value")) : null;
        }
    },


    /**
     * Static property used to define the default attribute configuration of
     * the Widget.
     *
     * @property Slider.ATTRS
     * @type Object
     * @protected
     * @static
     */
    ATTRS : {

// The minimum value for the spinner.
        min : {
            value:0
        },

        // The maximum value for the spinner.
        max : {
            value:100
        },

        // The current value of the spinner.
        value : {
            value:0,
            validator: function(val) {
                return this._validateValue(val);
            }
        },

        // Amount to increment/decrement the spinner when the buttons or arrow up/down keys are pressed.
        minorStep : {
            value:1
        },

        // Amount to increment/decrement the spinner when the page up/down keys are pressed.
        majorStep : {
            value:10
        },

        // The localizable strings for the spinner. This attribute is 
        // defined by the base Widget class but has an empty value. The
        // spinner is simply providing a default value for the attribute.
        strings: {
            value: {
                tooltip: "Press the arrow up/down keys for minor increments, page up/down for major increments.",
                increment: "Increment",
                decrement: "Decrement"
            }
        }
    }
});


Y.extend(Spinner, Y.Widget, {


        initializer: function() {
            // Not doing anything special during initialization
        },


        destructor : function() {
            this._documentMouseUpHandle.detach();

            this.inputNode = null;
            this.incrementNode = null;
            this.decrementNode = null;
        },


        renderUI : function() {
            this._renderInput();
            this._renderButtons();
        },


        bindUI : function() {
            this.after("valueChange", this._afterValueChange);

            var boundingBox = this.get("boundingBox");

            // Looking for a key event which will fire continously across browsers while the key is held down. 38, 40 = arrow up/down, 33, 34 = page up/down
            var keyEventSpec = (!Y.UA.opera) ? "down:" : "press:";
            keyEventSpec += "38, 40, 33, 34";

            Y.on("key", Y.bind(this._onDirectionKey, this), boundingBox, keyEventSpec);
            Y.on("mousedown", Y.bind(this._onMouseDown, this), boundingBox);
            this._documentMouseUpHandle = Y.on("mouseup", Y.bind(this._onDocMouseUp, this), boundingBox.get("ownerDocument"));

            Y.on("change", Y.bind(this._onInputChange, this), this.inputNode);
        },


        syncUI : function() {
            this._uiSetValue(this.get("value"));
        },


        _renderInput : function() {
            var contentBox = this.get("contentBox"),
                input = contentBox.query("." + Spinner.INPUT_CLASS),
                strings = this.get("strings");

            if (!input) {
                input = Node.create(Spinner.INPUT_TEMPLATE);
                contentBox.appendChild(input);
            }

            input.set("title", strings.tooltip);
            this.inputNode = input;
        },


        _renderButtons : function() {
            var contentBox = this.get("contentBox"),
                strings = this.get("strings");

            var inc = this._createButton(strings.increment, this.getClassName("increment"));
            var dec = this._createButton(strings.decrement, this.getClassName("decrement"));

            this.incrementNode = contentBox.appendChild(inc);
            this.decrementNode = contentBox.appendChild(dec);
        },


        _createButton : function(text, className) {

            var btn = Y.Node.create(Spinner.BTN_TEMPLATE);
            btn.set("innerHTML", text);
            btn.set("title", text);
            btn.addClass(className);

            return btn;
        },


        _onMouseDown : function(e) {
            var node = e.target,
                dir,
                handled = false,
                currVal = this.get("value"),
                minorStep = this.get("minorStep");

            if (node.hasClass(this.getClassName("increment"))) {
                this.set("value", currVal + minorStep);
                dir = 1;
                handled = true;
            } else if (node.hasClass(this.getClassName("decrement"))) {
                this.set("value", currVal - minorStep);
                dir = -1;
                handled = true;
            }

            if (handled) {
                this._setMouseDownTimers(dir, minorStep);
            }
        },


        _onDocMouseUp : function(e) {
            this._clearMouseDownTimers();
        },


        _onDirectionKey : function(e) {

            e.preventDefault();

            var currVal = this.get("value"),
                newVal = currVal,
                minorStep = this.get("minorStep"),
                majorStep = this.get("majorStep");

            switch (e.charCode) {
                case 38:
                    newVal += minorStep;
                    break;
                case 40:
                    newVal -= minorStep;
                    break;
                case 33:
                    newVal += majorStep;
                    newVal = Math.min(newVal, this.get("max"));
                    break;
                case 34:
                    newVal -= majorStep;
                    newVal = Math.max(newVal, this.get("min"));
                    break;
            }

            if (newVal !== currVal) {
                this.set("value", newVal);
            }
        },

        _onInputChange : function(e) {
            if (!this._validateValue(this.inputNode.get("value"))) {
                this.syncUI();
            }
        },


        _setMouseDownTimers : function(dir, step) {
            this._mouseDownTimer = Y.later(500, this, function() {
                this._mousePressTimer = Y.later(100, this, function() {
                    this.set("value", this.get("value") + (dir * step));
                }, null, true)
            });
        },


        _clearMouseDownTimers : function() {
            if (this._mouseDownTimer) {
                this._mouseDownTimer.cancel();
                this._mouseDownTimer = null;
            }
            if (this._mousePressTimer) {
                this._mousePressTimer.cancel();
                this._mousePressTimer = null;
            }
        },


        _afterValueChange : function(e) {
            this._uiSetValue(e.newVal);
        },


        _uiSetValue : function(val) {
            this.inputNode.set("value", val);
        },

        _validateValue: function(val) {
            var min = this.get("min"),
                max = this.get("max");

            return (Lang.isNumber(val) && val >= min && val <= max);
        }
    });


Y.ELSTR.Spinner = Spinner;

}, '1.0.0' ,{requires:['widget']});


