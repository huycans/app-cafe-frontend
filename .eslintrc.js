module.exports = {
  "env": {
      "browser": true,
      "es6": true,
      "node": true
  },
  "parser": "babel-eslint",
  "plugins": [
    "flowtype",
    "react"
  ],
  "extends": ["eslint:recommended", "plugin:react/recommended","plugin:flowtype/recommended"],
  "parserOptions": {
      "ecmaVersion": 2017,
      "ecmaFeatures": {
          "experimentalObjectRestSpread": true,
          "jsx": true
      },
      "sourceType": "module"
  },
  "rules": {
      "strict": 0,
      "linebreak-style": 0,
      "no-console": 0,
      "semi": [
          "error",
          "always"
      ],
      "react/no-unescaped-entities": 0,
      "react/prop-types": 0,
      "react/display-name": 0,
      "no-unused-vars": "warn",
      "flowtype/boolean-style": [
        2,
        "boolean"
      ],
      "flowtype/define-flow-type": 1,
      "flowtype/delimiter-dangle": [
        2,
        "never"
      ],
      "flowtype/generic-spacing": [
        2,
        "never"
      ],
      "flowtype/no-primitive-constructor-types": 2,
      "flowtype/no-types-missing-file-annotation": 2,
      "flowtype/no-weak-types": 1,
      "flowtype/object-type-delimiter": [
        2,
        "comma"
      ],
      "flowtype/require-parameter-type": 2,
      "flowtype/require-return-type": [
        2,
        "always",
        {
          "annotateUndefined": "never"
        }
      ],
      "flowtype/require-valid-file-annotation": 2,
      "flowtype/semi": [
        2,
        "always"
      ],
      "flowtype/space-after-type-colon": [
        2,
        "always"
      ],
      "flowtype/space-before-generic-bracket": [
        2,
        "never"
      ],
      "flowtype/space-before-type-colon": [
        2,
        "never"
      ],
      "flowtype/type-id-match": [
        2,
        "^([A-Z][a-z0-9]+)+Type$"
      ],
      "flowtype/union-intersection-spacing": [
        2,
        "always"
      ],
      "flowtype/use-flow-type": 1,
      "flowtype/valid-syntax": 1
    },
    "settings": {
      "flowtype": {
        "onlyFilesWithFlowAnnotation": true
      }
    }
};