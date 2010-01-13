/**
 * @author egli
 */
YUI({
    modules: {
        'spinner': {
            fullpath: "Spinner.js",
            requires:['widget']
        }
    }
}).use('base', 'anim', 'spinner', function(Y){

    // Create a new Spinner instance, drawing it's 
    // starting value from an input field already on the 
    // page (contained in the #numberField content box)
    var spinner = new Y.ELSTR.Spinner({
        contentBox: "#numberField",
        max:100,
        min:0
    },Y);
    spinner.render();
    spinner.focus();
    
});
