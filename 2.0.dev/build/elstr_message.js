/**
 * Message for Elstr applications
 * 
 * 
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

        destructor: function () {
            // Remove all click listeners
            this.get('contentBox').purge(true);
        },

        renderUI: function () {  
            //
            this.set("headerContent","Header");
            this.set("bodyContent",this.get("message"));
            this.set("footerContent","<div class='close button'>Close</div>");
        },

        bindUI: function () {
            var that = this;
            this.on('footerContentChange',function(e){
                that.get("contentBox").one(".close").on("click", function(e) {
                    that.hide();
                });
            });
            
            this.on("visibleChange",function(e){
                if(e.newVal === false){
                    that.destroy();
                }
            })
        },

        syncUI: function () {
            
        }
    
    //
    // PUBLIC FUNCTIONS
    //
     
    
    //
    // PRRIVATE VARIABLES
    //


    //
    // PRRIVATE FUNCTIONS
    //      
        
    }, {
        ATTRS: {
            message: {
                value: "",
                validator: Y.Lang.isString
            },
            priorty: {
                value: "",
                validator: Y.Lang.isString
            }
        }
    })

}, '2.0', {
    requires: ['base','widget','node','elstr_utils'],
    skinnable: false
});


















