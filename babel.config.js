module.exports = {
  presets: ['babel-preset-expo', 'module:@react-native/babel-preset'],
  plugins: [
    'react-native-iconify/plugin',
    'react-native-reanimated/plugin',
    [
      'inline-import',
      {
        extensions: ['.sql'],
      },
    ],
  ],
};
