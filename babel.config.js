module.exports = {
  presets: ['babel-preset-expo'],
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
