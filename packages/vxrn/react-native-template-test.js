const global =
  typeof globalThis !== 'undefined'
    ? globalThis
    : typeof global !== 'undefined'
      ? global
      : typeof window !== 'undefined'
        ? window
        : this

globalThis['global'] = global
global['react'] = {}
global['exports'] = {}
global['module'] = {}
global['__DEV__'] = true
global['___modules___'] = {}
global['___vxrnAbsoluteToRelative___'] = {}
// to avoid it looking like browser...
delete globalThis['window']

// TODO fixing vite bringing along some preload-helper.js and this:
// var e = new Event("vite:preloadError", {
//   cancelable: true
// });
global['Event'] =
  global['Event'] ||
  function () {
    return this
  }
global['dispatchEvent'] = global['dispatchEvent'] || (() => {})

globalThis['__cachedModules'] = {}

function printError(err) {
  return `${err instanceof Error ? `${err.message}\n${err.stack}` : err}`
}

const runningModules = new Map()

function __getRequire(absPath) {
  absPath = ___vxrnAbsoluteToRelative___[absPath] || absPath

  if (!__cachedModules[absPath]) {
    const runModule = ___modules___[absPath]

    // do not run again if the module is already running, avoids infinite stacks on circular dependencies
    if (runningModules.has(absPath)) {
      return runningModules.get(absPath).exports
    }

    if (runModule) {
      const mod = { exports: {} }
      runningModules.set(absPath, mod)
      try {
        runModule(mod.exports, mod)
      } catch (err) {
        console.error(`Error running module: "${absPath}"\n${printError(err)}`)
        return {}
      } finally {
        runningModules.delete(absPath)
      }

      __cachedModules[absPath] = mod.exports || mod
    }
  }

  return __cachedModules[absPath]
}

const __specialRequireMap = {
  'react-native': '.vxrn/react-native.js',
  react: '.vxrn/react.js',
  'react/jsx-runtime': '.vxrn/react-jsx-runtime.js',
  'react/jsx-dev-runtime': '.vxrn/react-jsx-runtime.js',
}

const nodeImports = {
  fs: true,
  path: true,
  os: true,
  child_process: true,
}

function createRequire(importer, importsMap) {
  if (!importsMap) {
    console.error(`No imports map given from ${importer}\n${new Error().stack}`)
  }

  return function require(_mod) {
    try {
      if (_mod === 'vxs') {
        // TODO this should be passed in not hardcoded
        const found = __getRequire('packages/vxs/dist/esm/index.js')
        if (found) return found
      }

      if (_mod.startsWith('node:') || nodeImports[_mod]) {
        console.warn(`Warning node import not supported: "${_mod}" from "${importer}"`)
        return {}
      }

      // find via maps
      let path = __specialRequireMap[_mod] || importsMap[_mod] || _mod
      const found = __getRequire(path)
      if (found) return found

      // quick and dirty relative()
      if (importer && path[0] === '.') {
        let currentDir = (() => {
          const paths = importer.split('/')
          return paths.slice(0, paths.length - 1) // remove last part to get dir
        })()

        const pathParts = path.split('/')
        while (true) {
          if (pathParts[0] !== '..') break
          pathParts.shift()
          currentDir.pop()
        }
        path = [...currentDir, ...pathParts]
          // Prevent generating a path like this: `foo/./bar.js` when requiring `./bar.js` from `foo`.
          .filter((p) => p !== '.')
          .join('/')
      }

      // find our import.meta.glob which don't get the nice path addition, for now hardcode but this shouldnt be hard to fix properly:
      const foundGlob = __getRequire(path.replace(/\.[jt]sx?$/, '.js'))
      if (foundGlob) {
        return foundGlob
      }

      // find internals loosely
      try {
        for (const [key, value] of Object.entries(__specialRequireMap)) {
          if (_mod.endsWith(value)) {
            const found = __getRequire(__specialRequireMap[key])
            if (found) {
              return found
            }
          }
        }
      } catch (err) {
        console.info('error loose internal', err)
      }

      // find externals loosely
      try {
        for (const [key, value] of Object.entries(importsMap)) {
          if (key.endsWith(_mod.replace(/(\.\.?\/)+/, ''))) {
            const found = __getRequire(importsMap[key])
            if (found) {
              return found
            }
          }
        }
      } catch (err) {
        console.info('error loose external', err)
      }

      // is this cruft
      if (globalThis[path]) {
        const output = globalThis[path]()
        __cachedModules[_mod] = output
        return output
      }

      console.error(
        `Module not found "${_mod}" imported by "${importer}"\n

  In importsMap:

${JSON.stringify(importsMap, null, 2)}

  Stack:

${new Error().stack
  .split('\n')
  .map((l) => `    ${l}`)
  .join('\n')}


--------------`
      )
      return {}
    } catch (err) {
      throw new Error(`\n◆ ${_mod} "${err}"`.replace('Error: ', '').replaceAll('"', ''))
    }
  }
}

globalThis['setImmediate'] = (cb) => cb()
//cb => Promise.resolve().then(() => cb())

// idk why
console._tmpLogs = []
;['trace', 'info', 'warn', 'error', 'log', 'group', 'groupCollapsed', 'groupEnd', 'debug'].forEach(
  (level) => {
    const og = globalThis['console'][level]
    globalThis['_ogConsole' + level] = og
    const ogConsole = og.bind(globalThis['console'])
    globalThis['console'][level] = (...data) => {
      if (console._tmpLogs) {
        console._tmpLogs.push({ level, data })
      }
      return ogConsole(...data)
    }
  }
)

console._isPolyfilled = true

global.performance = {
  now: () => Date.now(),
}

global.ErrorUtils = {
  setGlobalHandler: () => {},
  reportFatalError: (err) => {
    // biome-ignore lint/suspicious/noConsoleLog: <explanation>
    console.log('err' + err['message'] + err['stack'])
  },
}

// ------ Below is repro of circular dependency issue ------

// Run me:
//
// ```
// node packages/vxrn/react-native-template-test.js
// ```

___modules___['index.js'] = function moduleFnIndex(exports, module) {
  const require = createRequire('index.js', {
    './fnA': 'fnA.js',
    './fnB': 'fnB.js',
  })
  const fnA = require('./fnA.js')
  const fnB = require('./fnB.js')
  exports.fnA = fnA.default
  exports.fnB = fnB.default
}

___modules___['fnA.js'] = function moduleFnIndex(exports, module) {
  const require = createRequire('index.js', {})
  const fnA = () => {
    console.log('Hi! This is FnA.')
  }
  exports.default = fnA
}

___modules___['fnB.js'] = function moduleFnIndex(exports, module) {
  const require = createRequire('index.js', {
    index: 'index.js',
  })
  const index = require('index')
  const fnB = () => {
    console.log("Hi! This is FnB. I'm going to call FnA...")
    index.fnA()
  }
  exports.default = fnB
}

___modules___['app.js'] = function moduleFnIndex(exports, module) {
  const require = createRequire('app.js', {
    index: 'index.js',
  })
  const index = require('index')
  index.fnB()
}

const __require = createRequire(':root:', {})
__require('app.js')
