"use strict";
var React = require('react');
var ReactDom = require('react-dom');
var createReactClass = require('create-react-class');
var PropTypes = require('prop-types');

var ElstrScrollStore = require('../stores/ElstrScrollStore');
var ElstrDisplayStore = require('../stores/ElstrDisplayStore');

require('../libs/ElstrFunctionsControl');

require ("../../css/ElstrSmartTable.css");
require ("../../css/ElstrTableDefaultLayout.css");

React.__spread = Object.assign;

/**
 * Renders the content of a single row.
 * If a build function is provided, provides a reload function so the single row updates.
 */
var ElstrSmartTableContentRow = createReactClass({

    getInitialState: function(){
        return {};
    },

    reloadFunction: function(){
        if (this.isMounted){
            this.forceUpdate();
        }
    },

    componentDidMount: function(){
        this.isMounted = true;
    },
    componentWillUnmount: function(){
        this.isMounted = false;
    },

    storeDidChange: function(){
        this.forceUpdate();
    },

    render: function(){

        var contentRow;
        if (this.props.buildContentFunction){
            contentRow = this.props.buildContentFunction(this.props.children, this.reloadFunction);
        }else{
            contentRow = this.props.children;
        }

        return (<tr {...this.props} ref="content">{contentRow}</tr>);
    }
});

/**
 * State calculation for the table Header
 */
function _getHeaderState(component, loaded){

    var height = 0;
    var width = 0;

    var positionTop = 0;
    var positionLeft = 0;

    var scrollTop = 0;
    var scrollLeft = 0;

    if (component && loaded){
        var htmlComp = ReactDom.findDOMNode(component);

        scrollTop = htmlComp.scrollTop;
        scrollLeft = htmlComp.scrollLeft;

        var bodyBoundingRect = document.body.getBoundingClientRect();

        if (htmlComp){
            var componentBoundingRect = htmlComp.getBoundingClientRect();
            if (componentBoundingRect){
                height = parseInt(componentBoundingRect.height);
                width = parseInt(componentBoundingRect.width);
            }

            positionTop = parseInt(componentBoundingRect.top - bodyBoundingRect.top);
            positionLeft = parseInt(componentBoundingRect.left - bodyBoundingRect.left);
        }

    }

    var state = {

        screenScrollTop : ElstrScrollStore.getCurrentScroll(),

        positionTop : positionTop,
        positionLeft : positionLeft,

        height : height,
        width : width,

        scrollTop : scrollTop,
        scrollLeft : scrollLeft
    };

    if (!loaded){
        state.loaded = false;
    }

    return state;
}


/**
 * Component for the header of the table.
 * The header is designed to stick to the top when scroll
 */
var ElstrSmartTableHeader = createReactClass({

    mixins: [
        ElstrScrollStore.mixin, ElstrDisplayStore.mixin
    ],

    getInitialState: function(){

        return _getHeaderState(this, false);

    },

    storeDidChange: function(){

        this.setState(
            _getHeaderState(this, true)
        );
    },

    componentDidUpdate: function(){

        if (this.props.headers && this.props.headers.length>0 &&
            this.props.colsWidth && this.props.colsWidth.length>0){

            for (var j = 0; j < this.props.headers.length; j++) {

                var row = this.refs["tr"+j];

                if (row) {
                    var contentFirstRow = row.children;

                    // We assign the widths from the table
                    for (var i = 0; i < contentFirstRow.length; i++) {
                        if (this.props.colsWidth[i]) {
                            // To avoid any rounding down by the browser
                            contentFirstRow[i].width = this.props.colsWidth[i] + 0.49;

                        }
                    }

                    this.state.loaded = true;
                }
            }
        }
    },

    shouldComponentUpdate: function(nextProps, nextState) {

        var equals =
            this.props.contentVersion == nextProps.contentVersion &&
            this.props.tableWidth == nextProps.tableWidth &&
            this.props.colsWidthVersion == nextProps.colsWidthVersion;

        // With different width we reload the widths
        if (this.props.tableWidth !== nextProps.tableWidth ||
            this.props.colsWidthVersion !== nextProps.colsWidthVersion){
            this.state.loaded = false;
        }

        if (!this.props.fixed || !this.props.headerFloating){

            return !equals;

        } else{

            if (this.props.headers && this.props.headers.length>0 &&
                this.props.colsWidth.length>0 && !this.state.loaded){

                    return true;

            }else if (this.props.headerFloating){

                if (!equals) return true;

                // Only rerender on scroll top change (Not left or right)
                else if ((this.state.screenScrollTop !== nextState.screenScrollTop)) {

                    // When the screen is over the table we don't reload
                    // With a little bit of margin.
                    return (nextState.screenScrollTop > (this.props.positionTop-nextState.height*2));
                }else{
                    return false;
                }

            }else{
                return !equals;
            }
        }

    },

    render: function() {

        var headerStyle;
        var positionCorrected = 0;

        if ((this.props.positionTop || !this.props.headerFloating) && this.props.fixed) {

            // Only when the header is floating the position may change
            if (this.props.headerFloating &&
                this.state.screenScrollTop > this.props.positionTop) {

                positionCorrected = this.state.screenScrollTop - this.props.positionTop;

                // It always allows 100 pixels to be displayed
                if (((this.props.tableHeight - this.state.height) - positionCorrected) < 100){
                    positionCorrected = (this.props.tableHeight - this.state.height) - 100;
                }

            }

            headerStyle = {
                position: "absolute",
                top: positionCorrected,
                zIndex: 2000
            };

        }else{

            headerStyle = {
                visibility: "hidden"
            };
        }


        var contentHtml;
        var that = this;

        if (this.props.headers){
            contentHtml = this.props.headers.map(function(contentRow, indexTr){
                return (
                    <tr {...that.props.headersTrProps[indexTr]} ref={"tr"+indexTr}>{contentRow}</tr>
                );
            });
        }

        return (
            <thead style={headerStyle}>
                {contentHtml}
            </thead>
        );
    }
});

/**
 * Component for the content of the table.
 * The idea is that the content is not always reloaded.
 */
var ElstrSmartTableContent = createReactClass({

    mixins: [
        ElstrScrollStore.mixin,
    ],

    getInitialState: function(){

        return {
            screenScrollTop : ElstrScrollStore.getCurrentScroll(),
            average : 25
        };
    },


    storeDidChange: function(){
        this.setState(
            function(prevState, props) {
                return {
                    screenScrollTop : ElstrScrollStore.getCurrentScroll()
                };
            }
        );
    },

    shouldComponentUpdate: function(nextProps, nextState) {

        var equals =
            this.props.contentVersion == nextProps.contentVersion;

        // With different width we reload the widths
        if (this.props.tableWidth !== nextProps.tableWidth){
            this.state.loaded = false;
        }

        if (this.props.content && this.props.content.length>0 && !this.state.loaded){

            return true;

        }else if (this.props.hideRowsOptimization){

            // Only rerender on scroll top change (Not left or right)
            return (this.state.screenScrollTop !== nextState.screenScrollTop) || !equals;

        }else{

            return !equals;
        }

    },

    componentDidUpdate: function(){

        var colsWidth = [];

        if (!this.state.colsHeight)
            this.state.colsHeight = {};

        var widthsCalculated = false;

        if (this.props.content && this.props.content.length>0){

            // We get the column widths from the first rendered row
            for (var j = 0; j < this.props.content.length && !widthsCalculated; j++) {

                if (this.refs["tr"+j]){

                    var firstRow = this.refs["tr"+j];
                    if (firstRow && firstRow.refs.content){
                        var contentFirstRow = firstRow.refs.content.children;

                        for (var i = 0; i < contentFirstRow.length; i++) {

                            colsWidth[i] = contentFirstRow[i].offsetWidth;
                        }
                        widthsCalculated = true;
                    }
                }
            }

            this.state.loaded = true;

        }

        if (widthsCalculated){

            this.props.setWidths(
                colsWidth
            );
        }

    },

    render: function() {

        var contentHtml = [];

        var initialSpaceRow = null;
        var finalSpaceRow = null;

        var initialSpace = 0;
        var finalSpace = 0;

        var firstTr = null;
        var finalTr = null;

        if (this.props.content && this.props.content.length>0){

            var rowScrollTotal = 0;
            var finish = false;

            for (var indexTr = 0; indexTr < this.props.content.length && !finish; indexTr++) {

                var addContent = true;

                if (this.props.hideRowsOptimization){

                    addContent = false;

                    // We add the height if we know it or the average if not
                    rowScrollTotal += this.state.average;

                    // We add the column or we assign height the the initial space.
                    if ((this.state.screenScrollTop-this.props.positionTop) < rowScrollTotal ||

                        // At least minimun amount of rows
                        (this.props.content.length-indexTr)<this.props.defaultRowsDisplayedPerScreen ){

                        addContent = true;
                    }else{
                        initialSpace = parseInt(rowScrollTotal);
                    }

                    if (this.state.screenScrollTop<this.props.positionTop && // Scroll before the table
                        // More than 20 items displayed
                        indexTr>this.props.defaultRowsDisplayedPerScreen){

                        finish = true;

                    }else if (contentHtml.length>this.props.defaultRowsDisplayedPerScreen){

                        finish = true;

                    }

                    /**
                     * We finish the loop calculating the final Space
                     **/
                    if (finish){

                        for (var indexTrToFinish = indexTr; indexTrToFinish < this.props.content.length; indexTrToFinish++) {
                            if (this.state.colsHeight && this.state.colsHeight[indexTr]>0){
                                finalSpace += this.state.colsHeight[indexTr];
                            }else{
                                finalSpace += this.state.average;
                            }
                        }

                    }
                }

                if (!finish) {

                    /**
                     * We add the content
                     **/

                    if (addContent) {

                        if (firstTr === null) firstTr = indexTr;
                        finalTr = indexTr;

                        // key={this.props.contentTrProps[indexTr].key}
                        contentHtml.push((
                            <ElstrSmartTableContentRow {...this.props.contentTrProps[indexTr]}
                                buildContentFunction={this.props.buildContentFunction} ref={"tr" + indexTr}>
                                {this.props.content[indexTr]}
                            </ElstrSmartTableContentRow>
                        ));

                    }
                }
            }
        }

        finalSpace = parseInt(finalSpace);

        if (this.props.content && this.props.content.length>0){
            var numColumns = this.props.content[0].length;

            if (initialSpace>0){
                initialSpaceRow = (<tr><td colSpan={numColumns} style={{height:initialSpace}} /></tr>);
            }
            if (finalSpace>0){
                finalSpaceRow = (<tr><td colSpan={numColumns} style={{height:finalSpace}}  /></tr>);
            }
        }

        return (
            <tbody>
                {initialSpaceRow}
                {contentHtml}
                {finalSpaceRow}
            </tbody>
        );

    }
});

/**
 * Optional parameters:
 *
 * scrollSpeed: [Default: 200] Pixels to move horizontally on mouse over.
 *
 * hideRowsOptimization: [Default: false] - Re render the table only with the content in screen (With fake scroll).
 * headerFloating: [Default: true] - Header stays in the top of the page.
 *
 * defaultRowsDisplayedPerScreen: [Default: 40]
 *
 */
var ElstrSmartTable = createReactClass({

    mixins: [
        ElstrDisplayStore.mixin,
    ],

    propTypes: {
        key: PropTypes.string,
        headers: PropTypes.array,
        content: PropTypes.array,
        className: PropTypes.any,
        style: PropTypes.any
    },

    getInitialState: function(){

        return {

            _scrollSpeed : this.props.scrollSpeed || 200,

            _hideRowsOptimization : this.props.hideRowsOptimization, // Re render the table only with the content in screen (With fake scroll).
            _headerFloating : this.props.headerFloating || this.props.hideRowsOptimization, // Header stays in the top of the page.

            _defaultRowsDisplayedPerScreen : this.props.defaultRowsDisplayedPerScreen || 40,


            colsWidth : []
        };
    },

    storeDidChange: function(){
        this.updateTableData();
    },

    /**
     * The content transmits the widths of the columns to the header
     * Note: The width of the content depends on the content of a column AND the header content.
     * After rendering it for the first time, the header floating gets the widths form the fixed width.
     */
    setWidths: function(colsWidth){

        var colsWidthVersion = 0;
        if (this.state.colsWidthVersion){
            colsWidthVersion = this.state.colsWidthVersion;
        }

        if (colsWidth && colsWidth.length>0){

            var height = 0;
            var width = 0;

            var htmlComp = ReactDom.findDOMNode(this);
            var componentBoundingRect = htmlComp.getBoundingClientRect();

            if (componentBoundingRect){
                height = parseInt(componentBoundingRect.height);
                width = parseInt(componentBoundingRect.width);
            }

            this.setState({
                height: height,
                width: width,
                colsWidth: colsWidth,
                colsWidthVersion: ++colsWidthVersion
            });

        }else{

            this.setState({
                colsWidthVersion: ++colsWidthVersion
            });
        }

    },

    /**
     * Updates the position in the page of the table, width and height
     * It also updated the scroll positions
     */
    updateTableData: function(){

        var htmlComp = ReactDom.findDOMNode(this);
        var htmlTable = ReactDom.findDOMNode(this.refs.smart);

        var bodyBoundingRect = document.body.getBoundingClientRect();

        var height = 0;
        var width = 0;

        var tableHeight = 0;
        var tableWidth = 0;

        var positionTop = 0;
        var positionLeft = 0;

        if (htmlComp){
            var componentBoundingRect = htmlComp.getBoundingClientRect();
            if (componentBoundingRect){
                height = parseInt(componentBoundingRect.height);
                width = parseInt(componentBoundingRect.width);
            }

            positionTop = parseInt(componentBoundingRect.top - bodyBoundingRect.top);
            positionLeft = parseInt(componentBoundingRect.left - bodyBoundingRect.left);
        }

        if (htmlTable){
            var tableBoundingRect = htmlTable.getBoundingClientRect();
            if (tableBoundingRect){
                tableHeight = parseInt(tableBoundingRect.height);
                tableWidth = parseInt(tableBoundingRect.width);
            }
        }

        var scrollTop = htmlComp.scrollTop;
        var scrollLeft = htmlComp.scrollLeft;

        if (this.state.tableHeight != tableHeight ||
            this.state.tableWidth != tableWidth  ||
            this.state.positionTop != positionTop  ||
            this.state.positionLeft != positionLeft ||
            this.state.height != height ||
            this.state.width != width ||
            this.state.scrollTop != scrollTop ||
            this.state.scrollLeft != scrollLeft){

            var colsWidthVersion = 0;
            if (this.state.colsWidthVersion){
                colsWidthVersion = this.state.colsWidthVersion;
            }

            this.setState({
                positionTop : positionTop,
                positionLeft : positionLeft,
                tableHeight : tableHeight,
                tableWidth : tableWidth,
                height : height,
                width : width,
                scrollTop : scrollTop,
                scrollLeft : scrollLeft,
                colsWidthVersion: ++colsWidthVersion
            });
        }


    },

    /**
     * While the table is mounted we keep an interval checking the table position.
     * Elements over the table may have been modified or loaded, so the position has to be updated
     * (Only if the table has a special optimization)
     */
    componentDidMount: function(){

        if (this.state._headerFloating || this.state._hideRowsOptimization){
            this.state.positionInterval =
                setInterval(this.updateTableData,1000);
        }else{
            this.updateTableData();
        }
    },

    componentWillUnmount: function(){

        this.stopScrollIntervals();
        if (this.state.positionInterval ){
            clearInterval(this.state.positionInterval);
        }

    },

    /**
     * MOVE SCROLL WITH THE LATERAL BARS
     */
    onMouseEnterR: function(){

        // We raise an event to move the scroll until the mouse leaves the area
        var that = this;
        this.stopScrollIntervals();
        this.state.onMouseEnterR = setInterval(function(){
            that._moveScroll(that.state._scrollSpeed);
        },200);

    },
    onMouseLeaveR: function(){
        // We stop previous events
        var that = this;
        setTimeout(function() {
            that.stopScrollIntervals();
        });
    },
    onMouseEnterL: function(){

        // We raise an event to move the scroll until the mouse leaves the area
        var that = this;
        this.stopScrollIntervals();
        this.state.onMouseEnterL = setInterval(function(){
            that._moveScroll(-that.state._scrollSpeed);
        },200);
    },
    onMouseLeaveL: function(){
        // We stop previous events
        var that = this;
        setTimeout(function() {
            that.stopScrollIntervals();
        });
    },

    // Cleans intervals related to
    stopScrollIntervals: function(){
        if (this.state.onMouseEnterR){ clearInterval(this.state.onMouseEnterR); this.state.onMouseEnterR= false; }
        if (this.state.onMouseEnterL){ clearInterval(this.state.onMouseEnterL); this.state.onMouseEnterL= false; }
    },

    /**
     * EXIT
     */


    onClickR: function(e){
        e.stopPropagation();

        // Full scroll to the right
        this.stopScrollIntervals();
        this._moveScroll(this.state.width);
    },
    onClickL: function(e){
        e.stopPropagation();

        // Full scroll to the left
        this.stopScrollIntervals();
        this._moveScroll(-this.state.width);
    },

    _moveScroll: function(amount){
        var htmlComp = ReactDom.findDOMNode(this);

        var original = htmlComp.scrollLeft;

        htmlComp.scrollLeft+=amount;

        var diference = Math.abs(htmlComp.scrollLeft - original);
        if (diference < amount/2){

            if (this.state.onMouseEnterR){ clearInterval(this.state.onMouseEnterR); this.state.onMouseEnterR= false; }
            if (this.state.onMouseEnterL){ clearInterval(this.state.onMouseEnterL); this.state.onMouseEnterL= false; }

        }

        this.setState(
            {scrollLeft : htmlComp.scrollLeft});
    },

    onScroll: function(){
        var htmlComp = ReactDom.findDOMNode(this);
        this.setState(
            {scrollLeft : htmlComp.scrollLeft});
    },

    onKeyDown: function(event){

        if (event.ctrlKey){

            var htmlComp = ReactDom.findDOMNode(this);

            // Left
            if (event.which == 37) {

                this.setState({scrollLeft : 0});
                htmlComp.scrollLeft=0;

                return;

                // Right
            }else if (event.which == 39) {

                htmlComp.scrollLeft=this.state.width;
                this.setState({scrollLeft : this.state.width});
                return;

            }
        }

        if (this.props.onKeyDown){
            this.props.onKeyDown(event);
        }

    },

    render: function() {

        var scrollRightStyle;
        var scrollLeftStyle;

        // Scroll bars are only displayed when needed.
        if (this.state.scrollLeft>0){
            scrollLeftStyle = { left: this.state.scrollLeft };
        }else{
            scrollLeftStyle = { display: "none" };
        }


        if ((this.state.scrollLeft + this.state.width)< this.state.tableWidth){
            scrollRightStyle = { right: -this.state.scrollLeft };
        }else{
            scrollRightStyle = { display: "none" };
        }

        var header1;
        var header2;
        var content1;

        var contentVersion;
        if (this.props.contentVersion){
            contentVersion = this.props.contentVersion;
        }else if (this.props.content){
            contentVersion = this.props.content.length;
        }

        header1=(
            <ElstrSmartTableHeader headers={this.props.headers} headersTrProps={this.props.headersTrProps} colsWidth={this.state.colsWidth}
                                   positionTop={this.state.positionTop} positionLeft={this.state.positionLeft} tableHeight={this.state.tableHeight}
                                   tableWidth={this.state.tableWidth} fixed={true} headerFloating={this.state._headerFloating}
                                   contentVersion={contentVersion} colsWidthVersion={this.state.colsWidthVersion} />
        );

        header2=(
            <ElstrSmartTableHeader headers={this.props.headers} headersTrProps={this.props.headersTrProps} colsWidth={this.state.colsWidth}
                                   positionTop={this.state.positionTop} positionLeft={this.state.positionLeft} tableHeight={this.state.tableHeight}
                                   tableWidth={this.state.tableWidth} fixed={false} headerFloating={this.state._headerFloating}
                                   contentVersion={contentVersion} colsWidthVersion={this.state.colsWidthVersion}  />
        );

        if (this.props.content && (this.state.positionTop ||
            !(this.state._headerFloating || this.state._hideRowsOptimization))){

            content1=(
                <ElstrSmartTableContent
                                        positionTop={this.state.positionTop} content={this.props.content} buildContentFunction={this.props.buildContentFunction}
                                        contentTrProps={this.props.contentTrProps} setWidths={this.setWidths}
                                        hideRowsOptimization={this.state._hideRowsOptimization}
                                        defaultRowsDisplayedPerScreen={this.state._defaultRowsDisplayedPerScreen}
                                        tableWidth={this.state.tableWidth}
                                        contentVersion={contentVersion} />
            );
        }

        return (
            <div className="smartTable" onClick={this.props.onClick} onDoubleClick={this.props.onDoubleClick} onKeyDown={this.onKeyDown} onScroll={this.onScroll} >

                <table ref="smart" className={this.props.className} style={this.props.style} >

                    {/** Double header is needed to avoid display problems, only one scrolls */}

                    {header1}
                    {header2}
                    {content1}

                </table>

                {/** Scroll bars in the laterals of the table container */}
                <div ref="scrollRight" key={"sr"+scrollRightStyle.display+"_"+scrollRightStyle.right} className="scrollRight noPrint" style={scrollRightStyle}
                     onMouseEnter={this.onMouseEnterR.throttle(50)} onMouseLeave={this.onMouseLeaveR}
                     onMouseOut={this.onMouseLeaveR} onClick={this.onClickR}  />

                <div ref="scrollLeft" key={"sl"+scrollRightStyle.display+"_"+scrollRightStyle.left} className="scrollLeft noPrint" style={scrollLeftStyle}
                     onMouseEnter={this.onMouseEnterL.throttle(50)} onMouseLeave={this.onMouseLeaveL}
                     onMouseOut={this.onMouseLeaveL} onClick={this.onClickL} />

            </div>
        );

    }
});


module.exports = ElstrSmartTable;
