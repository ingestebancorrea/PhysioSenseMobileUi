module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: ['./jest.setup.js'],
  transform: {
    '^.+\\.(js|ts|tsx|mjs)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|lucide-react-native|@react-navigation|react-native-screens|react-native-safe-area-context|react-native-vector-icons|react-native-gifted-charts|gifted-charts-core|react-native-linear-gradient|react-native-svg)/)',
  ],
};
