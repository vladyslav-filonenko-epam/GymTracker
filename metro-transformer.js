/**
 * Metro transformer that handles both .sql and .svg files.
 * - .sql → exports the SQL content as a string module
 * - everything else → delegates to react-native-svg-transformer
 */
const svgTransformer = require('react-native-svg-transformer/react-native');

module.exports.transform = ({ src, filename, options }) => {
  if (filename.endsWith('.sql')) {
    const babelTransformer = require('@react-native/metro-babel-transformer');
    const code = `module.exports = ${JSON.stringify(src)};`;
    return babelTransformer.transform({ src: code, filename, options });
  }
  return svgTransformer.transform({ src, filename, options });
};
