module.exports = {
  env: {
    "browser": true,
    "es2021": true,
    "node": true
  },
  extends: "eslint:recommended",
  rules: {
    "no-unused-vars": "off",
    "no-debugger": "off"
  },
  parserOptions: {
    "sourceType": "module",
    "ecmaVersion": 2020,
    "ecmaFeatures": {
      "jsx": true
    }
  }

};
