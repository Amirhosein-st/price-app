module.exports = {
    globDirectory: 'build/',
    globPatterns: [
      '**/*.{html,js,css,ico,png,jpg,json,woff2,woff,svg}',
    ],
    swDest: 'build/service-worker.js',
    runtimeCaching: [
      {
        urlPattern: new RegExp('https://.*\\.(?:png|jpg|jpeg|svg|woff2|woff)'),
        handler: 'CacheFirst',
      },
      {
        urlPattern: new RegExp('https://.*\\.(?:js|css|json)'),
        handler: 'NetworkFirst',
      },
    ],
  };
  