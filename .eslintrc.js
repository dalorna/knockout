module.exports = {
  env: {
    "browser": true,
    "es2021": true,
    "node": true
  },
  extends: "eslint:recommended",
  rules: {
    "no-unused-vars": "warn"
  },
  parserOptions: {
    "sourceType": "module",
    "ecmaVersion": 2020,
    "ecmaFeatures": {
      "jsx": true
    }
  }

};
