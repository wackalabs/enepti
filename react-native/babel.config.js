module.exports = {
  presets: [
    'module:metro-react-native-babel-preset'
  ],
  plugins: [
    [
      'module-resolver',
      {
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        root: 'src',
        alias: {
          components: './src/components',
        }
      }
    ],
    '@babel/plugin-transform-spread',
    '@babel/proposal-object-rest-spread',
    '@babel/plugin-proposal-numeric-separator',
    ['@babel/plugin-proposal-decorators', { "legacy": true }],
    [
      'babel-plugin-rewrite-require', {
        aliases: {
          os: 'react-native-os'
        }
      }
    ]
  ]
  
};
