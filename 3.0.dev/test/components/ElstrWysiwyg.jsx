/**
 * Created by sahun on 02.12.2014.
 */

var React = require('react/addons');
var ReactTestUtils = React.addons.TestUtils;

var ElstrWysiwyg = require("../../src/scripts/components/ElstrWysiwyg.jsx");

var _updateData = function(html){
    return html;
}

describe("ElstrWysiwyg", function() {

    var elstrElstrWysiwyg = ReactTestUtils.renderIntoDocument(
        <ElstrWysiwyg updateData={_updateData} icons={true} />
    );

    it ("Default state", function() {

        expect(elstrElstrWysiwyg.state).toEqual({});

    });

    it ("Default props", function() {

        expect(elstrElstrWysiwyg.props.icons).toBe(true);
        expect(elstrElstrWysiwyg.props.updateData).toBeDefined();

    });

});