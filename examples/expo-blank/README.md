# expo-blank

An Expo project with minimum required npm dependencies and without configuring navigation.

Originally from https://github.com/expo/expo/tree/main/templates/expo-template-blank, with the following changes made:

* Adds the `"vxrn": "workspace:^"` dependency in `package.json`, and changes relative NPM scripts to use `vxrn` instead of `expo`.
* Removes `babel.config.js` which originally adds the `babel-preset-expo` preset, since vxrn has pre-configured Babel configurations that might conflict with `babel-preset-expo`.
