export let isExpo = false
try {
  const Constants = require('expo-constants')
  // True if the app is running in an `expo build` app or if it's running in Expo Go.
  isExpo =
    Constants.executionEnvironment === 'standalone' ||
    Constants.executionEnvironment === 'storeClient'
} catch {}
