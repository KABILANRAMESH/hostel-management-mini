const path = require('path');

module.exports = {
  // ... your existing config
  resolve: {
    fallback: {
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
    },
  },
};

