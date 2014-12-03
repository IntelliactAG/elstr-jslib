/**
 * Created by sahun on 02.12.2014.
 */

function ElstrI18N(){};

ElstrI18N.currentLang = "de";

ElstrI18N.getLangs = function(){

    return [];
}

ElstrI18N.setLang = function( lang ){
    ElstrI18N.currentLang = lang;
}

ElstrI18N.translate = function( text ){
    
    return "";
}

module.exports = ElstrI18N;
