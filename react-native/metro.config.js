const path = require('path')
const { getDefaultConfig } = require('metro-config')

/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

 module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts }
  } = await getDefaultConfig()

  return {
    
    projectRoot: path.resolve(__dirname, '.'),

    watchFolders: [],

    transformer: {
      babelTransformerPath: require.resolve('./metroTransformer.js'),
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: false,
        },
      }),
    },

    resolver: {
      assetExts: [...assetExts, 'm4a', 'woff', 'woff2', 'css', 'ttf', 'svg'],

      sourceExts: [...sourceExts, 'ts', 'tsx', 'js', 'cjs', 'jsx', 'json'],

      resolverMainFields: [
        'browser',
        'main'
      ]
    }
  }
})()
