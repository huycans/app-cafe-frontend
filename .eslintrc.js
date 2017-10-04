module.exports = {
    "env": {
        "browser": true,
        "es6": true,
		"node": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
		"ecmaVersion": 2017,
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true
        },
        "sourceType": "module",
		
    },
    "plugins": [
        "react"
    ],
    "rules": {
        
        "linebreak-style": 0,
        "no-console": 0,
        "semi": [
            "error",
            "always"
        ],
		"no-unused-vars": ["warn", { "vars": "all", "args": "after-used", "ignoreRestSiblings": false }]
    }
};