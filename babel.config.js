module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    'react-native-iconify/plugin',
    'react-native-reanimated/plugin',
    [
      '@react-unforget/babel-plugin',
      {
        /* options */
      },
    ],
  ],
};
