const upstreamTransformer = require('metro-react-native-babel-transformer')
const tsTransformer = require('react-native-typescript-transformer')
const svgTransformer = require('react-native-svg-transformer')

module.exports.transform = function({ src, filename, options }) {
  if (filename.endsWith('.ts') || filename.endsWith('.tsx')) {
    return tsTransformer.transform({ src, filename, options })
  } else if (filename.endsWith('.svg')) {
    return svgTransformer.transform({ src, filename, options })
  }  else {
    return upstreamTransformer.transform({ src, filename, options })
  }
}

