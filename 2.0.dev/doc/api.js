YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "ELSTR.Admin",
        "ELSTR.Api",
        "ELSTR.Auth",
        "ELSTR.Error",
        "ELSTR.Lang",
        "ELSTR.User"
    ],
    "modules": [
        "elstr_admin",
        "elstr_api",
        "elstr_auth",
        "elstr_error",
        "elstr_lang",
        "elstr_message",
        "elstr_user"
    ],
    "allModules": [
        {
            "displayName": "elstr_admin",
            "name": "elstr_admin",
            "description": "The amdin module provides all functionallity to allow admin tasks.\nCurrently this includes only the definition of the ACL"
        },
        {
            "displayName": "elstr_api",
            "name": "elstr_api",
            "description": "Module to privide acces to information of API calls to the Elstr server"
        },
        {
            "displayName": "elstr_auth",
            "name": "elstr_auth",
            "description": "Module to privide a Widget and functionallity to handle user authentication\nand access to the frontend. Access to data is controlled by the backend."
        },
        {
            "displayName": "elstr_error",
            "name": "elstr_error",
            "description": "Module for consistent error handling throught Elstr applications"
        },
        {
            "displayName": "elstr_lang",
            "name": "elstr_lang",
            "description": "Module to privide a Widget and functionallity for multilanguage handling\nin Elstr applications."
        },
        {
            "displayName": "elstr_message",
            "name": "elstr_message",
            "description": "Module to privide a Widget and functionallity for consistent\nmessages along Elstr applications."
        },
        {
            "displayName": "elstr_user",
            "name": "elstr_user",
            "description": "Module to privide a Widget and functionallity to handle basic user funtions\nsuch as login, logout, admin in Elstr applicationss."
        }
    ]
} };
});