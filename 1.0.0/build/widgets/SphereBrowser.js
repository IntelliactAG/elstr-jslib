/**
 * 
 * The SphereBrwoser is a widget that displays complex hierarchies in a spacetree pattern
 * 
 * To create a new SphereBrowser you first need to define:
 * 	- ObjectTypes
 *  - Optionally a Menu for each ObjectType (with accoring functions)
 *  - Optionally Eventhandler
 * 
 * Anforderungen: 
 * - Eventtrigger OnNodeClick
 * - Gruppierung (Regeln?)
 *   - Gruppierte Objekte können nicht navigiert werden...
 * - Paging Node?
 * - Bei Mouseover Kontextmenu
 * - Linientyp (Hierarchisch)
 * - Breadcrumb (Wunsch --> Einfärben)
 * - Typen Filter (nur bestimmte types anzeigen)
 * 
 * Public:
 * - BringNodeToCenter(id)
 * - addNode(JSON: Node, parentNode)
 * - removeNode(id)
 * 
 * @author nyffenegger
 * @extends YAHOO.widget.Overlay
 */

(function () {

    /**
    * SphereBrowser is an implementation of Overlay 
    * @namespace YAHOO.widget
    * @class Tooltip
    * @extends YAHOO.widget.Overlay
    * @constructor
    * @param {String} el The element ID representing the Tooltip <em>OR</em>
    * @param {HTMLElement} el The element representing the Tooltip
    * @param {Object} userConfig The configuration object literal containing 
    * the configuration that should be set for this Overlay. See configuration 
    * documentation for more details.
    */
    ELSTR.widget.SphereBrowser = function (el, userConfig) {
        ELSTR.widget.SphereBrowser.superclass.constructor.call(this, el, userConfig);
    };

    var Lang = YAHOO.lang,
        Event = YAHOO.util.Event,
        CustomEvent = YAHOO.util.CustomEvent,
        Dom = YAHOO.util.Dom,
        SphereBrowser = ELSTR.widget.SphereBrowser,
        UA = YAHOO.env.ua,
        bIEQuirks = (UA.ie && (UA.ie <= 6 || document.compatMode == "BackCompat")),

        m_oShadowTemplate,

        /**
        * Constant representing the SphereBrowser's configuration properties
        * @property DEFAULT_CONFIG
        * @private
        * @final
        * @type Object
        */
        DEFAULT_CONFIG = { 

            "CONTAINER": { 
                key: "container"
            },

            "DISABLED": {
                key: "disabled",
                value: false,
                suppressEvent: true
            },
			
			"NODETYPES": { 
                key: "nodetypes"
            },
			
			"DATASOURCE": { 
                key: "datasource"
            },
			
			"SBWIDTH": { 
                key: "sbwidth"
            },
			
			"SBHEIGHT": { 
                key: "sbheight"
            },
			
			"ROOTID": { 
                key: "rootid"
            },
			
			"SERVERURL": { 
                key: "serverurl"
            }


        },

        /**
        * Constant representing the name of the SphereBrowser's events
        * @property EVENT_TYPES
        * @private
        * @final
        * @type Object
        */
		
		// Tbd: @Marco:Waht is needed here really? 
		// Custom events? (Article selected etc...)
        EVENT_TYPES = {
            "CONTEXT_MOUSE_OVER": "contextMouseOver",
            "CONTEXT_MOUSE_OUT": "contextMouseOut"
        };

    /**
    * Constant representing the SphereBrowser CSS class
    * @property YAHOO.widget.SphereBrowser.CSS_TOOLTIP
    * @static
    * @final
    * @type String
    */
    SphereBrowser.CSS_SPHEREBROWSER = "elstr-sb";
 
    // "onDOMReady" that renders the SphereBrowser
    function onDOMReady(p_sType, p_aArgs, p_oObject) {
        this.render(p_oObject);
    }

    //  "init" event handler that automatically renders the SphereBrowser
    function onInit() {
        Event.onDOMReady(onDOMReady, this.cfg.getProperty("container"), this);
    }

    YAHOO.extend(SphereBrowser, YAHOO.widget.Module, { 

		that : {},
		rgraph : {},
        /**
        * The SphereBrowser initialization method. This method is automatically 
        * called by the constructor.
        * @method init
        * @param {String} el The element ID representing the Tooltip <em>OR</em>
        * @param {HTMLElement} el The element representing the Tooltip
        * @param {Object} userConfig The configuration object literal 
        * containing the configuration that should be set for this Tooltip. 
        * See configuration documentation for more details.
        */		
        init: function (el, userConfig) {
			that = this;
			SphereBrowser.superclass.init.call(this, el);

            this.beforeInitEvent.fire(SphereBrowser);

            Dom.addClass(this.element, SphereBrowser.CSS_SPHEREBROWSER);

            if (userConfig) {
                this.cfg.applyConfig(userConfig, true);
            }

            this.cfg.queueProperty("visible", true);
            //this.cfg.queueProperty("constraintoviewport", true);

            //ToDo: Here subscribe to all needed events such as
			// - changeWidth, changeHeight (?)
            this.subscribe("init", onInit);
            this.subscribe("render", this.onRender);
            this.initEvent.fire(SphereBrowser);
			
        },

        /**
        * Initializes the custom events for SphereBrowser
        * @method initEvents
        */
        initEvents: function () {

            SphereBrowser.superclass.initEvents.call(this);
            var SIGNATURE = CustomEvent.LIST;
        },

        /**
        * Initializes the class's configurable properties which can be 
        * changed using the Overlay's Config object (cfg).
        * @method initDefaultConfig
        */
        initDefaultConfig: function () {

            SphereBrowser.superclass.initDefaultConfig.call(this);
         
            /**
            * Specifies the container element that the SphereBrowser's markup 
            * should be rendered into.
            * @config container
            * @type HTMLElement/String
            * @default document.body
            */
            this.cfg.addProperty(DEFAULT_CONFIG.CONTAINER.key, {
                handler: this.configContainer,
                value: document.body
            });

            /**
            * Specifies whether or not the SphereBrowser is disabled. Disabled SphereBrowser
            * will be displayed grayed out and not interact with the user. 
            * 
            * @config disabled
            * @type Boolean
            * @default false
            */
            this.cfg.addProperty(DEFAULT_CONFIG.DISABLED.key, {
                handler: this.configContainer,
                value: DEFAULT_CONFIG.DISABLED.value,
                supressEvent: DEFAULT_CONFIG.DISABLED.suppressEvent
            });
         
           /**
            * 
            * 
            * @config disabled
            * @type Boolean
            * @default false
            */
            this.cfg.addProperty(DEFAULT_CONFIG.NODETYPES.key, {
                handler: this.configContainer
            });
			
           /**
            * 
            * 
            * @config disabled
            * @type Boolean
            * @default false
            */
            this.cfg.addProperty(DEFAULT_CONFIG.DATASOURCE.key, {
                handler: this.configContainer
            });		
			
			/**
            * Height of the brwosing area
            * 
            * @config disabled
            * @type Boolean
            * @default false
            */
            this.cfg.addProperty(DEFAULT_CONFIG.SBHEIGHT.key, {
                handler: this.configContainer
            });	
			
			/**
            * Width of the brwosing area
            * 
            * @config disabled
            * @type Boolean
            * @default false
            */
            this.cfg.addProperty(DEFAULT_CONFIG.SBWIDTH.key, {
                handler: this.configContainer
            });	
			
						
			/**
            * The ID of the first element to be displayed
            * 
            * @config disabled
            * @type Boolean
            * @default false
            */
            this.cfg.addProperty(DEFAULT_CONFIG.ROOTID.key, {
                handler: this.configContainer
            });				
				
						
			/**
            * The URL of the Webservic to call to revice data (replace later with datasource)
            * 
            * @config disabled
            * @type Boolean
            * @default false
            */
            this.cfg.addProperty(DEFAULT_CONFIG.SERVERURL.key, {
                handler: this.configContainer
            });        
        },
                
        /**
        * The default event handler fired when the "container" property 
        * is changed.
        * @method configContainer
        * @param {String} type The CustomEvent type (usually the property name)
        * @param {Object[]} args The CustomEvent arguments. For 
        * configuration handlers, args[0] will equal the newly applied value 
        * for the property.
        * @param {Object} obj The scope object. For configuration handlers,
        * this will usually equal the owner.
        */
        configContainer: function (type, args, obj) {
            var container = args[0];

            if (typeof container == 'string') {
                this.cfg.setProperty("container", document.getElementById(container), true);
            }
        },
        
        /**
        * @method _removeEventListeners
        * @description Removes all of the DOM event handlers from the HTML
        *  element(s) that trigger the display of the SphereBrowser.
        * @protected
        */
        _removeEventListeners: function () {
        
            var aElements = this._context,
                nElements,
                oElement,
                i;

            if (aElements) {
                nElements = aElements.length;
                if (nElements > 0) {
                    i = nElements - 1;
                    do {
                        oElement = aElements[i];
                        //Event.removeListener(oElement, "mouseover", this.onContextMouseOver);
                    }
                    while (i--);
                }
            }
        },
        
        // END BUILT-IN PROPERTY EVENT HANDLERS //

        // BEGIN BUILT-IN DOM EVENT HANDLERS //

        // END BUILT-IN DOM EVENT HANDLERS //

        /**
         * For now, do everything in the render method, later we can optimze performance by moving things to 
         * the initialization and do things needed for rendering here
         * 
        * @method onRender
        * @description "render" event handler for the SphereBrowser.
        * @param {String} p_sType String representing the name of the event  
        * that was fired.
        * @param {Array} p_aArgs Array of arguments sent when the event 
        * was fired.
        */
        onRender: function (p_sType, p_aArgs) {
    
			// Check container.js for examples			
 	        var infovis = this.body;
			var w = this.cfg.getProperty('sbwidth'), h = this.cfg.getProperty('sbheight');
			infovis.id = 'elstr_sb_1';
			Dom.setStyle(infovis.id, 'width', w+'px'); 
			Dom.setStyle(infovis.id, 'height', h+'px'); 			
			
		    //init canvas
		    //Create new canvas instances.
		    var canvas = new Canvas('mycanvas', {
		        'injectInto': infovis.id,
		        'width': w,
		        'height': h,
		        //Optional: create a background canvas and plot
		        //concentric circles in it.
		        'backgroundCanvas': {
		            'styles': {
		                'strokeStyle': '#CCCCCC'
		            },
		            
		            'impl': {
		                'init': function(){},
		                'plot': function(canvas, ctx){
		                    var times = 4, d = 100;
		                    var pi2 = Math.PI * 2;
		                    for (var i = 1; i <= times; i++) {
		                        ctx.beginPath();
		                        ctx.arc(0, 0, i * d, 0, pi2, true);
		                        ctx.stroke();
		                        ctx.closePath();
		                    }
		                }
		            }
		        }
			});
			
			var size = 40;
			
			// Render Implementation for nodeTypes
			var ctxNodeRenderer = function(node, canvas, animating){
				var ctx = canvas.getCtx(), pos = node.pos.getc(true);
				ctx.save();
				ctx.translate(pos.x, pos.y);
				ctx.restore();			
			}
			var nodeTypes = this.cfg.getProperty('nodetypes');
			var nodeRenders = {}
			for (var i in nodeTypes) {
				nodeRenders[i] = ctxNodeRenderer;
			}
			
			// Render the menues						
			var onMenuEnter = function(e, menu) {
				menu.activated = true;
				Dom.removeClass(menu.id, 'elstr-sb-menu-half');
				Dom.removeClass(menu.id, 'elstr-sb-menu-hide');
				Dom.addClass(menu.id, 'elstr-sb-menu-show');
			}
			
			var onMenuLeave = function(e, menu) {				
				menu.activated = false;
				Dom.removeClass(menu.id, 'elstr-sb-menu-show');
				Dom.removeClass(menu.id, 'elstr-sb-menu-half');
				Dom.addClass(menu.id, 'elstr-sb-menu-hide');
			}
			
			for (var i in nodeTypes) {
				var menu = nodeTypes[i].menu;
				menu.activated = false
				YAHOO.util.Event.addListener(menu.id, 'mouseover', onMenuEnter, menu);
				YAHOO.util.Event.addListener(menu.id, 'mouseout', onMenuLeave, menu);
				menu.render(this.body);
			}
			RGraph.Plot.NodeTypes.implement(nodeRenders);
			
			 //init rgraph
		    rgraph = new RGraph(canvas, {
		        //Add node/edge styles and set
		        //overridable=true if you want your
		        //styles to be individually overriden
				
				duration: 400,
				
		        Node: {
		            //set the RGraph rendering function
		            //as node type
		           'type': 'nodebg',
				   overridable: true
		        },
		        Edge: {
		            color: '#CCCCCC',
					lineWidth: 1
		        },
		        //Parent-children distance
		        levelDistance: 100,
				
		        //Add styles to node labels on label creation
		        onCreateLabel: function(domElement, node){
		            domElement.innerHTML = node.name + "<br>Sec line";		            										
		            domElement.id = node.id;
					Dom.addClass(domElement, node.data.$type);
		            domElement.onclick = function() {		                					   	
						rgraph.onClick(node.id, {
						hideLabels: false						    						  
						});
						// fire the clickevent
						// updateData
				 		rgraph._laodData(node.id);
		            };
					
					domElement.menu = nodeTypes[node.data.$type].menu;
					domElement.onmouseover = function(e) {
						// Show the menu						
						var el = Event.getTarget(e);
						var oMenu = el.menu;
						if (oMenu.activated == false) {
							Dom.removeClass(oMenu.id, 'elstr-sb-menu-show');
							Dom.removeClass(oMenu.id, 'elstr-sb-menu-hide');
							Dom.addClass(oMenu.id, 'elstr-sb-menu-half');
							var xy = Dom.getXY(el.id);
							xy[1] = xy[1] + 39;
							oMenu.show();
							Dom.setXY(oMenu.id, xy);
						}
					}
					
					domElement.onmouseout = function(e) {
						// Show the menu					
						var oMenu = this.menu;	

						if (oMenu.activated == false) {
							Dom.removeClass(oMenu.id, 'elstr-sb-menu-show');
							Dom.removeClass(oMenu.id, 'elstr-sb-menu-half');
							Dom.addClass(oMenu.id, 'elstr-sb-menu-hide');
						}
					}	
					// Fire Event onNodeCreated(e, node, domelement)				 
		        },
		        
		        onPlaceLabel: function(domElement, node){
		            var style = domElement.style;
		            var left = parseInt(style.left);
					var top = parseInt(style.top);
		            var w = domElement.offsetWidth;
		            style.left = (left - 20) + 'px';
					style.top = (top - 20) + 'px';
		            style.display = '';
		        }				

		    });

			/////////////////////////////////////////////////////////////////////////
			// Custom RGraph methods added by Felix Nyffenegger
			rgraph.widget = that;
			rgraph._laodData =  function(id) {
				var handleSuccess = function(o){
					if(o.responseText !== undefined){
						// Use the JSON Utility to parse the data returned from the server
						var jsonResponse =  YAHOO.lang.JSON.parse(o.responseText);
						//rgraph.loadJSON(YAHOO.lang.JSON.stringify(jsonResponse.result[0]));								
						//rgraph.loadJSON(jsonResponse.result[0]);
						//rgraph.refresh();
						rgraph.refreshTree(jsonResponse.result[0]);
					}
				};
				
				var handleFailure = function(o){
					if(o.responseText !== undefined){
						alert("Request failed");
					}
				};
				
				var callback =
				{
				  success:handleSuccess,
				  failure:handleFailure,
				};
				
				var sUrl = rgraph.widget.cfg.getProperty('serverurl');
				var postData = {
					"jsonrpc": "2.0",
					"method": 'getdata',
					"params": {
						"id": id
					},
					"id": 1
				};
				var request = YAHOO.util.Connect.asyncRequest('POST', sUrl, callback, YAHOO.lang.JSON.stringify(postData));
			}
			// Rearange nodes according to our policy
			rgraph.refreshTree = function(json) {
				// For Demo:
				// Get root node
				// Backloop through all nodes and remove grand-grand children
				
				// Push jsondata into an object
				// find the rootnode
				// Backloop from here and add all Nodes which are not yet there
				//var ans = new Graph(this.graphOptions);
				//setTimeout("w", function(){
					(function (ans, json) {												
						ans.addNode(json);
						for(var i=0, ch = json.children; i<ch.length; i++) {
							ans.addAdjacence(json, ch[i]);
							arguments.callee(ans, ch[i]);
						}
						
					})(rgraph.graph, json);
				//}, 400);
				rgraph.root = json.id;
				// If there's time: Try to add the collaps functionality				
				rgraph.refresh();
			}
		    
			 //load graph.
			var rootId = that.cfg.getProperty('rootid');
			if (rootId != '') {
				rgraph._laodData(rootId);
			}
			rgraph.refresh();			
						
        },

        /**
        * Removes the Tooltip element from the DOM and sets all child 
        * elements to null.
        * @method destroy
        */
        destroy: function () {
        
            // Remove any existing mouseover/mouseout listeners
            this._removeEventListeners();
            SphereBrowser.superclass.destroy.call(this);  
        
        },
        
        /**
        * Returns a string representation of the object.
        * @method toString
        * @return {String} The string representation of the Tooltip
        */
        toString: function () {
            return "SphereBrowser " + this.id;
        }, 
		
		refresh: function() {
			rgraph.clear();
			// load with current id
			//_laodData();
		},
		
		search: function(query) {
			
		}
    });

}());
