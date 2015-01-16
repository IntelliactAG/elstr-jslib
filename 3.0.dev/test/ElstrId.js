/**
 * Created by sahun on 02.12.2014.
 */

var ElstrId = require("../src/scripts/ElstrId");

describe("ElstrId", function() {

    it("Not equal ids", function() {

        var uid1 = ElstrId.create();
        var uid2 = ElstrId.create();

        expect(uid1).not.toEqual(uid2);
    });

    it("Not equal unique ids", function() {
        var uDid1 = ElstrId.createDocumentUnique();
        var uDid2 = ElstrId.createDocumentUnique();

        expect(uDid1).not.toEqual(uDid2);

    });

});
