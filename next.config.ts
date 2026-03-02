import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      '*.module.styl': {
        loaders: ['stylus-loader'],
        as: '*.module.css',
      },
      '*.styl': {
        loaders: ['stylus-loader'],
        as: '*.css',
      },
    },
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.styl$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            modules: {
              auto: /\.module\.styl$/,
              localIdentName: '[local]__[hash:base64:5]',
            },
          },
        },
        'stylus-loader',
      ],
    })
    return config
  },
}

export default nextConfig
