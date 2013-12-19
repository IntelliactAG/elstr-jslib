/**
 * Module to privide a Widget and functionallity for consistent
 * messages along Elstr applications.
 *
 * @module elstr_message
 * @namespace ELSTR
 * @requires ...
 * @author egli@intelliact.ch
 * @copyright Intelliact AG, 2011
 */

YUI.add('elstr_message', function (Y) {


    Y.namespace('ELSTR').Message = Y.Base.create('elstr_message', Y.Overlay, [], {
                
        //
        // WIDGET FUNCTIONS
        //

        initializer: function () {
        // 

        },
        
        /**
         * Designated destructor
         *
         * @method destructor
         */
        destructor: function () {
            // Remove all click listeners
            this.get('contentBox').purge(true);
        },
        
       /**
         * renderUI implementation
         *
         * @method renderUI
         */
        renderUI: function () {  
            //
            this.set("headerContent","Header");
            this.set("bodyContent",this.get("message"));
            this.set("footerContent","<div class='close button'>Close</div>");
        },

       /**
         * bindUI implementation
         *
         * Hooks up events for the widget
         * @method bindUI
         */
        bindUI: function () {
            this.on('footerContentChange',function(e){
                this.get("contentBox").one(".close").on("click", function(e) {
                    this.hide();
                });
            },this);
            
            this.on("visibleChange",function(e){
                if(e.newVal === false){
                    this.destroy();
                }
            },this);
            
            Y.on("resize", this._handleWindowResize, window, this);
        },

        syncUI: function () {
            
        },
    
        //
        // PUBLIC FUNCTIONS
        //
     
    
        //
        // PRRIVATE VARIABLES
        //


        //
        // PRRIVATE FUNCTIONS
        //  

        _handleWindowResize : function(){
            this.set("centered",true);
        }
        
    }, {
       /**
         * Static property used to define the default attribute configuration of
         * the Widget.
         *
         * @property ATTRS
         * @type {Object}
         * @protected
         * @static
         */
        ATTRS: {
            /**
             * The message
             *
             * @attribute message
             * @type {String}
             * @default ""
             */
            message: {
                value: "",
                validator: Y.Lang.isString
            },
            /**
             * Priority of the message (has currently no effect on the widget)
             *
             * @attribute priorty
             * @type {String}
             * @default ""
             */
            priorty: {
                value: "",
                validator: Y.Lang.isString
            }
        }
    });

}, '2.0', {
    requires: ['base','node','overlay','elstr_messagecss'],
    skinnable: false
});
