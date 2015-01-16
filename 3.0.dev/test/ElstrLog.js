/**
 * Created by sahun on 02.12.2014.
 */

var ElstrLog = require("../src/scripts/ElstrLog");

describe("ElstrLog", function() {

    it("Definition of the console outputs", function() {

        ElstrLog.init({});

        expect(ElstrLog.log).toBeDefined();
        expect(ElstrLog.info).toBeDefined();
        expect(ElstrLog.debug).toBeDefined();
        expect(ElstrLog.warn).toBeDefined();
        expect(ElstrLog.error).toBeDefined();
        expect(ElstrLog.count).toBeDefined();

    });

    it("Definition of the console aliases", function() {

        ElstrLog.init({
            justAConsoleAlias : true
        });

        expect(ElstrLog.log).toBeDefined();
        expect(ElstrLog.info).toBeDefined();
        expect(ElstrLog.debug).toBeDefined();
        expect(ElstrLog.warn).toBeDefined();
        expect(ElstrLog.error).toBeDefined();
        expect(ElstrLog.count).toBeDefined();

    });
});

