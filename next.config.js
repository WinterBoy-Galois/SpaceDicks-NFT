/** @type {import('next').NextConfig} */
module.exports = {
  webpack: (config, { webpack }) => {
    // SVG loader
    config.module.rules.push({
      test: /\.svg$/,
      issuer: {
        and: [/\.(js|ts)x?$/]
      },
      use: ['@svgr/webpack'],
    });

    // Fix "electron" error
    config.plugins.push(new webpack.IgnorePlugin({
      resourceRegExp: /^electron$/
    }))

    return config
  },
  reactStrictMode: true,
  images: {
    domains: [
      'localhost',
      'spacedicks-api.herokuapp.com',
      'spacedicks.xyz',
      '127.0.0.1',
      '192.168.1.12'
    ]
  }
}
