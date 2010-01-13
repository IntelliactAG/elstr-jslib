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
 * - Eventtrigger OnNodeClick (1)
 * - Gruppierung (Regeln?) (--> backend)
 *   - Gruppierte Objekte können nicht navigiert werden...
 * - Paging Node (3)
 * - Bei Mouseover Kontextmenu
 * - Linientyp (Hierarchisch) (2)
 * - Breadcrumb (Wunsch --> Einfärben)
 * - Typen Filter (nur bestimmte types anzeigen) (1)
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
		ELSTR.widget.SphereBrowser.instance = this;
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
			
			"FILTER": { 
                key: "filter"
            },
			
			"SBWIDTH": { 
                key: "sbwidth"
            },
			
			"SBHEIGHT": { 
                key: "sbheight"
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
            "NODE_DBLCLICK": "nodeDblClick",
            "NODE_CLICK": "nodeClick"
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
        //this.render(p_oObject);
		this.render();
    }

    //  "init" event handler that automatically renders the SphereBrowser
    function onInit() {
        Event.onDOMReady(onDOMReady, this.cfg.getProperty("container"), this);
    }

    YAHOO.extend(SphereBrowser, YAHOO.widget.Module, { 

		//that : {},
		//rgraph : {},
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
			
			/**
            * CustomEvent fired at nodeClick
            * @event beforeSubmitEvent
            */
            this.nodeClickEvent = this.createEvent(EVENT_TYPES.NODE_CLICK);
            this.nodeClickEvent.signature = SIGNATURE;
			
			this.nodeDblClickEvent = this.createEvent(EVENT_TYPES.NODE_DBLCLICK);
            this.nodeDblClickEvent.signature = SIGNATURE;
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
            * Filters for display of nodetypes
            * 
            * @config disabled
            * @type array
            * @default false
            */
            this.cfg.addProperty(DEFAULT_CONFIG.FILTER.key, {
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
						'strokeStyle': '#DDDDDD'
		            },
		            
		            'impl': {
		                'init': function(){},
		                'plot': function(canvas, ctx){
		                    var times = 2, d = 150;
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
				if (menu != undefined) {
					menu.activated = true;
					Dom.removeClass(menu.id, 'elstr-sb-menu-half');
					Dom.removeClass(menu.id, 'elstr-sb-menu-hide');
					Dom.addClass(menu.id, 'elstr-sb-menu-show');
				}
			}
			
			var onMenuLeave = function(e, menu) {				
				if (menu != undefined) {
					menu.activated = false;
					Dom.removeClass(menu.id, 'elstr-sb-menu-show');
					Dom.removeClass(menu.id, 'elstr-sb-menu-half');
					Dom.addClass(menu.id, 'elstr-sb-menu-hide');
				}
			}
			
			for (var i in nodeTypes) {
				var menu = nodeTypes[i].menu;
				if (menu != undefined) {
					menu.activated = false
					YAHOO.util.Event.addListener(menu.id, 'mouseover', onMenuEnter, menu);
					YAHOO.util.Event.addListener(menu.id, 'mouseout', onMenuLeave, menu);
					menu.render(this.body);
				}
			}
			RGraph.Plot.NodeTypes.implement(nodeRenders);
			//Hypertree.Plot.NodeTypes.implement(nodeRenders);
			RGraph.Plot.EdgeTypes.implement({  
				'none': function(adj, canvas) {  
					//do not display
   				},  
				'up': RGraph.Plot.EdgeTypes.prototype.arrow, 
				'down': RGraph.Plot.EdgeTypes.prototype.arrow, 
				'even': RGraph.Plot.EdgeTypes.prototype.line
			});  
			 //init rgraph
		    this.rgraph = new RGraph(canvas, {
			//this.rgraph = new Hypertree(canvas, {
		        //Add node/edge styles and set
		        //overridable=true if you want your
		        //styles to be individually overriden
				
				duration: 400,
				
		        Node: {
		            //set the RGraph rendering function
		            //as node type
		           'type': 'query',
				   overridable: true
		        },
		        Edge: {
		            color: '#8AADE0',
					lineWidth: 1
		        },
		        //Parent-children distance
		        levelDistance: 150,
				
		        //Add styles to node labels on label creation
		        onCreateLabel: function(domElement, node){
					var label = '';
					if (node.data.subType != undefined && node.data.number != undefined) {
						label = label + node.data.subType + ' ' + node.data.number;	
					}         
					if (label != '') {
						label = label + '<br>' + node.name;
					} else{
						label = node.name;
					}
					domElement.innerHTML = label;
		            domElement.id = node.id;
					Dom.addClass(domElement, node.data.$type);
		            domElement.onclick = function() {		                					   	
						// fire the clickevent						
				 		ELSTR.widget.SphereBrowser.instance.nodeClickEvent.fire({node : node, target : this});
		            };
					
					domElement.ondblclick = function() {		                					   							
						ELSTR.widget.SphereBrowser.instance.rgraph.onClick(node.id, { hideLabels: false	});
						// fire the clickevent						
				 		ELSTR.widget.SphereBrowser.instance.nodeDblClickEvent.fire({node : node, target : this});						
		            };
					
					if (!YAHOO.lang.isUndefined(nodeTypes[node.data.$type].menu)) {
						domElement.menu = nodeTypes[node.data.$type].menu;
						domElement.onmouseover = function(e){
							// Show the menu						
							var el = Event.getTarget(e);
							var oMenu = el.menu;
							if (oMenu.activated == false) {
								Dom.removeClass(oMenu.id, 'elstr-sb-menu-show');
								Dom.removeClass(oMenu.id, 'elstr-sb-menu-hide');
								Dom.addClass(oMenu.id, 'elstr-sb-menu-half');
								var xy = Dom.getXY(el.id);
								xy[1] = xy[1] + el.offsetHeight -1;
								oMenu.show();
								Dom.setXY(oMenu.id, xy);
							}
						}
						
						domElement.onmouseout = function(e){
							// Show the menu					
							var oMenu = this.menu;
							if (this.menu != undefined) {
								if (oMenu.activated == false) {
									Dom.removeClass(oMenu.id, 'elstr-sb-menu-show');
									Dom.removeClass(oMenu.id, 'elstr-sb-menu-half');
									Dom.addClass(oMenu.id, 'elstr-sb-menu-hide');
								}
							}
						}
					}
					// Fire Event onNodeCreated(e, node, domelement)				 
		        },
		        
		        onPlaceLabel: function(domElement, node){
		            var style = domElement.style;
		            var left = parseInt(style.left);
					var top = parseInt(style.top);
		            var w = domElement.offsetWidth;
		            style.left = (left - 10) + 'px';
					style.top = (top - 10) + 'px';
		            style.display = '';
		            style.cursor = 'pointer';
		            if (node._depth <= 1) {
						//Dom.removeClass(node, 'node-min');
						//Dom.addClass(node, 'node');
						style.fontSize='12px';
						style.height='40px';						
		            } else if(node._depth == 2){
		                //Dom.removeClass(node, 'node');
						//Dom.addClass(node, 'node-min');
						style.fontSize='9px';
						style.height='20px';
		            } else {
		                style.display = 'none';
		            }
					var filter = ELSTR.widget.SphereBrowser.instance.cfg.getProperty('filter');
					if (filter.nodeType[node.data.$type] != true) {						
						style.display = 'none';
					}
		        },
				
				onBeforePlotLine: function(adj) {
					if (adj.nodeTo._depth > 2 || adj.nodeFrom._depth > 2){
						adj.data.$type = 'none';
					}
					else {
						adj.data.$type = adj.nodeTo.data.edgeType;
					}
					var filter = ELSTR.widget.SphereBrowser.instance.cfg.getProperty('filter');
					if (filter.nodeType[adj.nodeTo.data.$type] != true || filter.nodeType[adj.nodeFrom.data.$type] != true) {
						adj.data.$type = 'none';
					}
				}
		    });

			/////////////////////////////////////////////////////////////////////////
			// Custom RGraph methods added by Felix Nyffenegger
			this.rgraph.widget = this;
			
			// Rearange nodes according to our policy
			this.rgraph.updateJson = function(json) {				

				(function (json) {												
					if (YAHOO.lang.isUndefined(json.data)) {
						json.data = {
							$type   : json.nodeType,
							updated : false
						}
						// add all properties and set nodeType
						for (var key in json) {
						   json.data[key] = json[key];
						}


					}
					if (json.children != undefined) {
						for (var i = 0, ch = json.children; i < ch.length; i++) {								
							arguments.callee(ch[i]);
						}
					}
					else {
						json.children = [];
					}
					
				})(json);
							
				return json;
			}
					    			
			//this.rgraph.refresh();			
						
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
		
		load: function(data) {
			// load with current id
			
			if (this.rgraph.root != undefined) {
				this.rgraph.op.removeNode(this.rgraph.root, {
					type: 'fade',
					duration: 100
				});
			}
			
			var res = ELSTR.utils.cloneObj(data.results);
			var json = this.rgraph.updateJson(res[0]);
			this.rgraph.root = json.id;
			this.rgraph.loadJSON(json);
			this.rgraph.refresh();
			//this.rgraph.graph = new Graph(this.rgraph.graphOptions);
			//this.rgraph.updateTree(data.results);
			//this.rgraph.refresh();
		},
		
		update: function(data) {						
			if (!(data.results[0].id == undefined || data.results[0].id == "undefined" || data.results[0].id == "")) {
				var node = this.rgraph.graph.getNode(data.results[0].id);
				if (node.data.updated == false) {
					var res = ELSTR.utils.cloneObj(data.results);
					var json = this.rgraph.updateJson(res[0]);
					this.rgraph.op.sum(json, {
						type: 'fade',
						duration: 500,
						hideLabels: false,
						transition: Trans.Quart.easeOut
					});
					node.data.updated = true;
				}
				this.rgraph.plot();
			}
		},
		
		search: function(query) {
			 
		},
		
		setFilter: function (filter) {
			this.cfg.setProperty('filter', filter);
		}
    });
}());