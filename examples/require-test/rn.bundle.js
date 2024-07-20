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

function __getRequire(absPath) {
  if (!__cachedModules[absPath]) {
    const runModule = ___modules___[absPath]
    if (runModule) {
      const mod = { exports: {} }
      try {
        runModule(mod.exports, mod)
      } catch (err) {
        console.error(`Error running module: "${absPath}"\n${printError(err)}`)
        return {}
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
          // Prevent generate a path like this: `foo/./bar.js` when requiring `./bar.js` from `foo`.
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

// id: color-name/index.js
// name: node_modules/color-name/index
// facadeModuleId: /Users/z/Projects/vxrn/node_modules/color-name/index.js
___modules___["color-name/index.js"] = ((exports, module) => {
const require = createRequire("color-name/index.js", {
  "../_virtual/_commonjsHelpers.js": "_virtual/_commonjsHelpers.js"
})

"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const _commonjsHelpers = require("../../_virtual/_commonjsHelpers.js");
"use strict";
var colorName = {
  "aliceblue": [
    240,
    248,
    255
  ],
  "antiquewhite": [
    250,
    235,
    215
  ],
  "aqua": [
    0,
    255,
    255
  ],
  "aquamarine": [
    127,
    255,
    212
  ],
  "azure": [
    240,
    255,
    255
  ],
  "beige": [
    245,
    245,
    220
  ],
  "bisque": [
    255,
    228,
    196
  ],
  "black": [
    0,
    0,
    0
  ],
  "blanchedalmond": [
    255,
    235,
    205
  ],
  "blue": [
    0,
    0,
    255
  ],
  "blueviolet": [
    138,
    43,
    226
  ],
  "brown": [
    165,
    42,
    42
  ],
  "burlywood": [
    222,
    184,
    135
  ],
  "cadetblue": [
    95,
    158,
    160
  ],
  "chartreuse": [
    127,
    255,
    0
  ],
  "chocolate": [
    210,
    105,
    30
  ],
  "coral": [
    255,
    127,
    80
  ],
  "cornflowerblue": [
    100,
    149,
    237
  ],
  "cornsilk": [
    255,
    248,
    220
  ],
  "crimson": [
    220,
    20,
    60
  ],
  "cyan": [
    0,
    255,
    255
  ],
  "darkblue": [
    0,
    0,
    139
  ],
  "darkcyan": [
    0,
    139,
    139
  ],
  "darkgoldenrod": [
    184,
    134,
    11
  ],
  "darkgray": [
    169,
    169,
    169
  ],
  "darkgreen": [
    0,
    100,
    0
  ],
  "darkgrey": [
    169,
    169,
    169
  ],
  "darkkhaki": [
    189,
    183,
    107
  ],
  "darkmagenta": [
    139,
    0,
    139
  ],
  "darkolivegreen": [
    85,
    107,
    47
  ],
  "darkorange": [
    255,
    140,
    0
  ],
  "darkorchid": [
    153,
    50,
    204
  ],
  "darkred": [
    139,
    0,
    0
  ],
  "darksalmon": [
    233,
    150,
    122
  ],
  "darkseagreen": [
    143,
    188,
    143
  ],
  "darkslateblue": [
    72,
    61,
    139
  ],
  "darkslategray": [
    47,
    79,
    79
  ],
  "darkslategrey": [
    47,
    79,
    79
  ],
  "darkturquoise": [
    0,
    206,
    209
  ],
  "darkviolet": [
    148,
    0,
    211
  ],
  "deeppink": [
    255,
    20,
    147
  ],
  "deepskyblue": [
    0,
    191,
    255
  ],
  "dimgray": [
    105,
    105,
    105
  ],
  "dimgrey": [
    105,
    105,
    105
  ],
  "dodgerblue": [
    30,
    144,
    255
  ],
  "firebrick": [
    178,
    34,
    34
  ],
  "floralwhite": [
    255,
    250,
    240
  ],
  "forestgreen": [
    34,
    139,
    34
  ],
  "fuchsia": [
    255,
    0,
    255
  ],
  "gainsboro": [
    220,
    220,
    220
  ],
  "ghostwhite": [
    248,
    248,
    255
  ],
  "gold": [
    255,
    215,
    0
  ],
  "goldenrod": [
    218,
    165,
    32
  ],
  "gray": [
    128,
    128,
    128
  ],
  "green": [
    0,
    128,
    0
  ],
  "greenyellow": [
    173,
    255,
    47
  ],
  "grey": [
    128,
    128,
    128
  ],
  "honeydew": [
    240,
    255,
    240
  ],
  "hotpink": [
    255,
    105,
    180
  ],
  "indianred": [
    205,
    92,
    92
  ],
  "indigo": [
    75,
    0,
    130
  ],
  "ivory": [
    255,
    255,
    240
  ],
  "khaki": [
    240,
    230,
    140
  ],
  "lavender": [
    230,
    230,
    250
  ],
  "lavenderblush": [
    255,
    240,
    245
  ],
  "lawngreen": [
    124,
    252,
    0
  ],
  "lemonchiffon": [
    255,
    250,
    205
  ],
  "lightblue": [
    173,
    216,
    230
  ],
  "lightcoral": [
    240,
    128,
    128
  ],
  "lightcyan": [
    224,
    255,
    255
  ],
  "lightgoldenrodyellow": [
    250,
    250,
    210
  ],
  "lightgray": [
    211,
    211,
    211
  ],
  "lightgreen": [
    144,
    238,
    144
  ],
  "lightgrey": [
    211,
    211,
    211
  ],
  "lightpink": [
    255,
    182,
    193
  ],
  "lightsalmon": [
    255,
    160,
    122
  ],
  "lightseagreen": [
    32,
    178,
    170
  ],
  "lightskyblue": [
    135,
    206,
    250
  ],
  "lightslategray": [
    119,
    136,
    153
  ],
  "lightslategrey": [
    119,
    136,
    153
  ],
  "lightsteelblue": [
    176,
    196,
    222
  ],
  "lightyellow": [
    255,
    255,
    224
  ],
  "lime": [
    0,
    255,
    0
  ],
  "limegreen": [
    50,
    205,
    50
  ],
  "linen": [
    250,
    240,
    230
  ],
  "magenta": [
    255,
    0,
    255
  ],
  "maroon": [
    128,
    0,
    0
  ],
  "mediumaquamarine": [
    102,
    205,
    170
  ],
  "mediumblue": [
    0,
    0,
    205
  ],
  "mediumorchid": [
    186,
    85,
    211
  ],
  "mediumpurple": [
    147,
    112,
    219
  ],
  "mediumseagreen": [
    60,
    179,
    113
  ],
  "mediumslateblue": [
    123,
    104,
    238
  ],
  "mediumspringgreen": [
    0,
    250,
    154
  ],
  "mediumturquoise": [
    72,
    209,
    204
  ],
  "mediumvioletred": [
    199,
    21,
    133
  ],
  "midnightblue": [
    25,
    25,
    112
  ],
  "mintcream": [
    245,
    255,
    250
  ],
  "mistyrose": [
    255,
    228,
    225
  ],
  "moccasin": [
    255,
    228,
    181
  ],
  "navajowhite": [
    255,
    222,
    173
  ],
  "navy": [
    0,
    0,
    128
  ],
  "oldlace": [
    253,
    245,
    230
  ],
  "olive": [
    128,
    128,
    0
  ],
  "olivedrab": [
    107,
    142,
    35
  ],
  "orange": [
    255,
    165,
    0
  ],
  "orangered": [
    255,
    69,
    0
  ],
  "orchid": [
    218,
    112,
    214
  ],
  "palegoldenrod": [
    238,
    232,
    170
  ],
  "palegreen": [
    152,
    251,
    152
  ],
  "paleturquoise": [
    175,
    238,
    238
  ],
  "palevioletred": [
    219,
    112,
    147
  ],
  "papayawhip": [
    255,
    239,
    213
  ],
  "peachpuff": [
    255,
    218,
    185
  ],
  "peru": [
    205,
    133,
    63
  ],
  "pink": [
    255,
    192,
    203
  ],
  "plum": [
    221,
    160,
    221
  ],
  "powderblue": [
    176,
    224,
    230
  ],
  "purple": [
    128,
    0,
    128
  ],
  "rebeccapurple": [
    102,
    51,
    153
  ],
  "red": [
    255,
    0,
    0
  ],
  "rosybrown": [
    188,
    143,
    143
  ],
  "royalblue": [
    65,
    105,
    225
  ],
  "saddlebrown": [
    139,
    69,
    19
  ],
  "salmon": [
    250,
    128,
    114
  ],
  "sandybrown": [
    244,
    164,
    96
  ],
  "seagreen": [
    46,
    139,
    87
  ],
  "seashell": [
    255,
    245,
    238
  ],
  "sienna": [
    160,
    82,
    45
  ],
  "silver": [
    192,
    192,
    192
  ],
  "skyblue": [
    135,
    206,
    235
  ],
  "slateblue": [
    106,
    90,
    205
  ],
  "slategray": [
    112,
    128,
    144
  ],
  "slategrey": [
    112,
    128,
    144
  ],
  "snow": [
    255,
    250,
    250
  ],
  "springgreen": [
    0,
    255,
    127
  ],
  "steelblue": [
    70,
    130,
    180
  ],
  "tan": [
    210,
    180,
    140
  ],
  "teal": [
    0,
    128,
    128
  ],
  "thistle": [
    216,
    191,
    216
  ],
  "tomato": [
    255,
    99,
    71
  ],
  "turquoise": [
    64,
    224,
    208
  ],
  "violet": [
    238,
    130,
    238
  ],
  "wheat": [
    245,
    222,
    179
  ],
  "white": [
    255,
    255,
    255
  ],
  "whitesmoke": [
    245,
    245,
    245
  ],
  "yellow": [
    255,
    255,
    0
  ],
  "yellowgreen": [
    154,
    205,
    50
  ]
};
const index = /* @__PURE__ */ _commonjsHelpers.getDefaultExportFromCjs(colorName);
;
var __ignore = typeof __moduleExports === "undefined" ? 0 : 0;
globalThis.____forceExport = colorName;
exports.colorName = colorName;
exports.default = index;

})




// id: _virtual/index.js
// name: _virtual/index
// facadeModuleId:  /Users/z/Projects/vxrn/node_modules/color-name/index.js?commonjs-proxy
___modules___["_virtual/index.js"] = ((exports, module) => {
const require = createRequire("_virtual/index.js", {
  "../node_modules/color-name/index.js": "color-name/index.js"
})

"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const index = require("../node_modules/color-name/index.js");
exports.default = index.colorName;

})




// id: color-convert/route.js
// name: node_modules/color-convert/route
// facadeModuleId: /Users/z/Projects/vxrn/node_modules/color-convert/route.js
___modules___["color-convert/route.js"] = ((exports, module) => {
const require = createRequire("color-convert/route.js", {
  "../_virtual/_commonjsHelpers.js": "_virtual/_commonjsHelpers.js",
  "../_virtual/conversions.js": "_virtual/conversions.js",
  "../node_modules/color-convert/conversions.js": "color-convert/conversions.js"
})

"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const _commonjsHelpers = require("../../_virtual/_commonjsHelpers.js");
require("../../_virtual/conversions.js");
const conversions$1 = require("./conversions.js");
var conversions = conversions$1.conversions;
function buildGraph() {
  var graph = {};
  var models = Object.keys(conversions);
  for (var len = models.length, i = 0; i < len; i++) {
    graph[models[i]] = {
      // http://jsperf.com/1-vs-infinity
      // micro-opt, but this is simple.
      distance: -1,
      parent: null
    };
  }
  return graph;
}
function deriveBFS(fromModel) {
  var graph = buildGraph();
  var queue = [
    fromModel
  ];
  graph[fromModel].distance = 0;
  while (queue.length) {
    var current = queue.pop();
    var adjacents = Object.keys(conversions[current]);
    for (var len = adjacents.length, i = 0; i < len; i++) {
      var adjacent = adjacents[i];
      var node = graph[adjacent];
      if (node.distance === -1) {
        node.distance = graph[current].distance + 1;
        node.parent = current;
        queue.unshift(adjacent);
      }
    }
  }
  return graph;
}
function link(from, to) {
  return function(args) {
    return to(from(args));
  };
}
function wrapConversion(toModel, graph) {
  var path = [
    graph[toModel].parent,
    toModel
  ];
  var fn = conversions[graph[toModel].parent][toModel];
  var cur = graph[toModel].parent;
  while (graph[cur].parent) {
    path.unshift(graph[cur].parent);
    fn = link(conversions[graph[cur].parent][cur], fn);
    cur = graph[cur].parent;
  }
  fn.conversion = path;
  return fn;
}
var route = function route2(fromModel) {
  var graph = deriveBFS(fromModel);
  var conversion = {};
  var models = Object.keys(graph);
  for (var len = models.length, i = 0; i < len; i++) {
    var toModel = models[i];
    var node = graph[toModel];
    if (node.parent === null) {
      continue;
    }
    conversion[toModel] = wrapConversion(toModel, graph);
  }
  return conversion;
};
const route$1 = /* @__PURE__ */ _commonjsHelpers.getDefaultExportFromCjs(route);
;
var __ignore = typeof __moduleExports === "undefined" ? 0 : 0;
globalThis.____forceExport = route;
exports.default = route$1;
exports.route = route;

})




// id: color-convert/conversions.js
// name: node_modules/color-convert/conversions
// facadeModuleId: /Users/z/Projects/vxrn/node_modules/color-convert/conversions.js
___modules___["color-convert/conversions.js"] = ((exports, module) => {
const require = createRequire("color-convert/conversions.js", {
  "../_virtual/_commonjsHelpers.js": "_virtual/_commonjsHelpers.js",
  "../_virtual/index.js": "_virtual/index.js",
  "../node_modules/color-name/index.js": "color-name/index.js"
})

"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const _commonjsHelpers = require("../../_virtual/_commonjsHelpers.js");
require("../../_virtual/index.js");
const index = require("../color-name/index.js");
function _array_like_to_array(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function _array_with_holes(arr) {
  if (Array.isArray(arr)) return arr;
}
function _iterable_to_array_limit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _s, _e;
  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }
  return _arr;
}
function _non_iterable_rest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _sliced_to_array(arr, i) {
  return _array_with_holes(arr) || _iterable_to_array_limit(arr, i) || _unsupported_iterable_to_array(arr, i) || _non_iterable_rest();
}
function _unsupported_iterable_to_array(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _array_like_to_array(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(n);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
}
var cssKeywords = index.colorName;
var reverseKeywords = {};
var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = void 0;
try {
  for (var _iterator = Object.keys(cssKeywords)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
    var key = _step.value;
    reverseKeywords[cssKeywords[key]] = key;
  }
} catch (err) {
  _didIteratorError = true;
  _iteratorError = err;
} finally {
  try {
    if (!_iteratorNormalCompletion && _iterator.return != null) {
      _iterator.return();
    }
  } finally {
    if (_didIteratorError) {
      throw _iteratorError;
    }
  }
}
var convert = {
  rgb: {
    channels: 3,
    labels: "rgb"
  },
  hsl: {
    channels: 3,
    labels: "hsl"
  },
  hsv: {
    channels: 3,
    labels: "hsv"
  },
  hwb: {
    channels: 3,
    labels: "hwb"
  },
  cmyk: {
    channels: 4,
    labels: "cmyk"
  },
  xyz: {
    channels: 3,
    labels: "xyz"
  },
  lab: {
    channels: 3,
    labels: "lab"
  },
  lch: {
    channels: 3,
    labels: "lch"
  },
  hex: {
    channels: 1,
    labels: [
      "hex"
    ]
  },
  keyword: {
    channels: 1,
    labels: [
      "keyword"
    ]
  },
  ansi16: {
    channels: 1,
    labels: [
      "ansi16"
    ]
  },
  ansi256: {
    channels: 1,
    labels: [
      "ansi256"
    ]
  },
  hcg: {
    channels: 3,
    labels: [
      "h",
      "c",
      "g"
    ]
  },
  apple: {
    channels: 3,
    labels: [
      "r16",
      "g16",
      "b16"
    ]
  },
  gray: {
    channels: 1,
    labels: [
      "gray"
    ]
  }
};
var conversions = convert;
var _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = void 0;
try {
  for (var _iterator1 = Object.keys(convert)[Symbol.iterator](), _step1; !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true) {
    var model = _step1.value;
    if (!("channels" in convert[model])) {
      throw new Error("missing channels property: " + model);
    }
    if (!("labels" in convert[model])) {
      throw new Error("missing channel labels property: " + model);
    }
    if (convert[model].labels.length !== convert[model].channels) {
      throw new Error("channel and label counts mismatch: " + model);
    }
    var _convert_model = convert[model], channels = _convert_model.channels, labels = _convert_model.labels;
    delete convert[model].channels;
    delete convert[model].labels;
    Object.defineProperty(convert[model], "channels", {
      value: channels
    });
    Object.defineProperty(convert[model], "labels", {
      value: labels
    });
  }
} catch (err) {
  _didIteratorError1 = true;
  _iteratorError1 = err;
} finally {
  try {
    if (!_iteratorNormalCompletion1 && _iterator1.return != null) {
      _iterator1.return();
    }
  } finally {
    if (_didIteratorError1) {
      throw _iteratorError1;
    }
  }
}
convert.rgb.hsl = function(rgb) {
  var r = rgb[0] / 255;
  var g = rgb[1] / 255;
  var b = rgb[2] / 255;
  var min = Math.min(r, g, b);
  var max = Math.max(r, g, b);
  var delta = max - min;
  var h;
  var s;
  if (max === min) {
    h = 0;
  } else if (r === max) {
    h = (g - b) / delta;
  } else if (g === max) {
    h = 2 + (b - r) / delta;
  } else if (b === max) {
    h = 4 + (r - g) / delta;
  }
  h = Math.min(h * 60, 360);
  if (h < 0) {
    h += 360;
  }
  var l = (min + max) / 2;
  if (max === min) {
    s = 0;
  } else if (l <= 0.5) {
    s = delta / (max + min);
  } else {
    s = delta / (2 - max - min);
  }
  return [
    h,
    s * 100,
    l * 100
  ];
};
convert.rgb.hsv = function(rgb) {
  var rdif;
  var gdif;
  var bdif;
  var h;
  var s;
  var r = rgb[0] / 255;
  var g = rgb[1] / 255;
  var b = rgb[2] / 255;
  var v = Math.max(r, g, b);
  var diff = v - Math.min(r, g, b);
  var diffc = function diffc2(c) {
    return (v - c) / 6 / diff + 1 / 2;
  };
  if (diff === 0) {
    h = 0;
    s = 0;
  } else {
    s = diff / v;
    rdif = diffc(r);
    gdif = diffc(g);
    bdif = diffc(b);
    if (r === v) {
      h = bdif - gdif;
    } else if (g === v) {
      h = 1 / 3 + rdif - bdif;
    } else if (b === v) {
      h = 2 / 3 + gdif - rdif;
    }
    if (h < 0) {
      h += 1;
    } else if (h > 1) {
      h -= 1;
    }
  }
  return [
    h * 360,
    s * 100,
    v * 100
  ];
};
convert.rgb.hwb = function(rgb) {
  var r = rgb[0];
  var g = rgb[1];
  var b = rgb[2];
  var h = convert.rgb.hsl(rgb)[0];
  var w = 1 / 255 * Math.min(r, Math.min(g, b));
  b = 1 - 1 / 255 * Math.max(r, Math.max(g, b));
  return [
    h,
    w * 100,
    b * 100
  ];
};
convert.rgb.cmyk = function(rgb) {
  var r = rgb[0] / 255;
  var g = rgb[1] / 255;
  var b = rgb[2] / 255;
  var k = Math.min(1 - r, 1 - g, 1 - b);
  var c = (1 - r - k) / (1 - k) || 0;
  var m = (1 - g - k) / (1 - k) || 0;
  var y = (1 - b - k) / (1 - k) || 0;
  return [
    c * 100,
    m * 100,
    y * 100,
    k * 100
  ];
};
function comparativeDistance(x, y) {
  return Math.pow(x[0] - y[0], 2) + Math.pow(x[1] - y[1], 2) + Math.pow(x[2] - y[2], 2);
}
convert.rgb.keyword = function(rgb) {
  var reversed = reverseKeywords[rgb];
  if (reversed) {
    return reversed;
  }
  var currentClosestDistance = Infinity;
  var currentClosestKeyword;
  var _iteratorNormalCompletion2 = true, _didIteratorError2 = false, _iteratorError2 = void 0;
  try {
    for (var _iterator = Object.keys(cssKeywords)[Symbol.iterator](), _step; !(_iteratorNormalCompletion2 = (_step = _iterator.next()).done); _iteratorNormalCompletion2 = true) {
      var keyword = _step.value;
      var value = cssKeywords[keyword];
      var distance = comparativeDistance(rgb, value);
      if (distance < currentClosestDistance) {
        currentClosestDistance = distance;
        currentClosestKeyword = keyword;
      }
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }
  return currentClosestKeyword;
};
convert.keyword.rgb = function(keyword) {
  return cssKeywords[keyword];
};
convert.rgb.xyz = function(rgb) {
  var r = rgb[0] / 255;
  var g = rgb[1] / 255;
  var b = rgb[2] / 255;
  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
  var x = r * 0.4124 + g * 0.3576 + b * 0.1805;
  var y = r * 0.2126 + g * 0.7152 + b * 0.0722;
  var z = r * 0.0193 + g * 0.1192 + b * 0.9505;
  return [
    x * 100,
    y * 100,
    z * 100
  ];
};
convert.rgb.lab = function(rgb) {
  var xyz = convert.rgb.xyz(rgb);
  var x = xyz[0];
  var y = xyz[1];
  var z = xyz[2];
  x /= 95.047;
  y /= 100;
  z /= 108.883;
  x = x > 8856e-6 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
  y = y > 8856e-6 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
  z = z > 8856e-6 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;
  var l = 116 * y - 16;
  var a = 500 * (x - y);
  var b = 200 * (y - z);
  return [
    l,
    a,
    b
  ];
};
convert.hsl.rgb = function(hsl) {
  var h = hsl[0] / 360;
  var s = hsl[1] / 100;
  var l = hsl[2] / 100;
  var t2;
  var t3;
  var val;
  if (s === 0) {
    val = l * 255;
    return [
      val,
      val,
      val
    ];
  }
  if (l < 0.5) {
    t2 = l * (1 + s);
  } else {
    t2 = l + s - l * s;
  }
  var t1 = 2 * l - t2;
  var rgb = [
    0,
    0,
    0
  ];
  for (var i = 0; i < 3; i++) {
    t3 = h + 1 / 3 * -(i - 1);
    if (t3 < 0) {
      t3++;
    }
    if (t3 > 1) {
      t3--;
    }
    if (6 * t3 < 1) {
      val = t1 + (t2 - t1) * 6 * t3;
    } else if (2 * t3 < 1) {
      val = t2;
    } else if (3 * t3 < 2) {
      val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
    } else {
      val = t1;
    }
    rgb[i] = val * 255;
  }
  return rgb;
};
convert.hsl.hsv = function(hsl) {
  var h = hsl[0];
  var s = hsl[1] / 100;
  var l = hsl[2] / 100;
  var smin = s;
  var lmin = Math.max(l, 0.01);
  l *= 2;
  s *= l <= 1 ? l : 2 - l;
  smin *= lmin <= 1 ? lmin : 2 - lmin;
  var v = (l + s) / 2;
  var sv = l === 0 ? 2 * smin / (lmin + smin) : 2 * s / (l + s);
  return [
    h,
    sv * 100,
    v * 100
  ];
};
convert.hsv.rgb = function(hsv) {
  var h = hsv[0] / 60;
  var s = hsv[1] / 100;
  var v = hsv[2] / 100;
  var hi = Math.floor(h) % 6;
  var f = h - Math.floor(h);
  var p = 255 * v * (1 - s);
  var q = 255 * v * (1 - s * f);
  var t = 255 * v * (1 - s * (1 - f));
  v *= 255;
  switch (hi) {
    case 0:
      return [
        v,
        t,
        p
      ];
    case 1:
      return [
        q,
        v,
        p
      ];
    case 2:
      return [
        p,
        v,
        t
      ];
    case 3:
      return [
        p,
        q,
        v
      ];
    case 4:
      return [
        t,
        p,
        v
      ];
    case 5:
      return [
        v,
        p,
        q
      ];
  }
};
convert.hsv.hsl = function(hsv) {
  var h = hsv[0];
  var s = hsv[1] / 100;
  var v = hsv[2] / 100;
  var vmin = Math.max(v, 0.01);
  var sl;
  var l;
  l = (2 - s) * v;
  var lmin = (2 - s) * vmin;
  sl = s * vmin;
  sl /= lmin <= 1 ? lmin : 2 - lmin;
  sl = sl || 0;
  l /= 2;
  return [
    h,
    sl * 100,
    l * 100
  ];
};
convert.hwb.rgb = function(hwb) {
  var h = hwb[0] / 360;
  var wh = hwb[1] / 100;
  var bl = hwb[2] / 100;
  var ratio = wh + bl;
  var f;
  if (ratio > 1) {
    wh /= ratio;
    bl /= ratio;
  }
  var i = Math.floor(6 * h);
  var v = 1 - bl;
  f = 6 * h - i;
  if ((i & 1) !== 0) {
    f = 1 - f;
  }
  var n = wh + f * (v - wh);
  var r;
  var g;
  var b;
  switch (i) {
    default:
    case 6:
    case 0:
      r = v;
      g = n;
      b = wh;
      break;
    case 1:
      r = n;
      g = v;
      b = wh;
      break;
    case 2:
      r = wh;
      g = v;
      b = n;
      break;
    case 3:
      r = wh;
      g = n;
      b = v;
      break;
    case 4:
      r = n;
      g = wh;
      b = v;
      break;
    case 5:
      r = v;
      g = wh;
      b = n;
      break;
  }
  return [
    r * 255,
    g * 255,
    b * 255
  ];
};
convert.cmyk.rgb = function(cmyk) {
  var c = cmyk[0] / 100;
  var m = cmyk[1] / 100;
  var y = cmyk[2] / 100;
  var k = cmyk[3] / 100;
  var r = 1 - Math.min(1, c * (1 - k) + k);
  var g = 1 - Math.min(1, m * (1 - k) + k);
  var b = 1 - Math.min(1, y * (1 - k) + k);
  return [
    r * 255,
    g * 255,
    b * 255
  ];
};
convert.xyz.rgb = function(xyz) {
  var x = xyz[0] / 100;
  var y = xyz[1] / 100;
  var z = xyz[2] / 100;
  var r;
  var g;
  var b;
  r = x * 3.2406 + y * -1.5372 + z * -0.4986;
  g = x * -0.9689 + y * 1.8758 + z * 0.0415;
  b = x * 0.0557 + y * -0.204 + z * 1.057;
  r = r > 31308e-7 ? 1.055 * Math.pow(r, 1 / 2.4) - 0.055 : r * 12.92;
  g = g > 31308e-7 ? 1.055 * Math.pow(g, 1 / 2.4) - 0.055 : g * 12.92;
  b = b > 31308e-7 ? 1.055 * Math.pow(b, 1 / 2.4) - 0.055 : b * 12.92;
  r = Math.min(Math.max(0, r), 1);
  g = Math.min(Math.max(0, g), 1);
  b = Math.min(Math.max(0, b), 1);
  return [
    r * 255,
    g * 255,
    b * 255
  ];
};
convert.xyz.lab = function(xyz) {
  var x = xyz[0];
  var y = xyz[1];
  var z = xyz[2];
  x /= 95.047;
  y /= 100;
  z /= 108.883;
  x = x > 8856e-6 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
  y = y > 8856e-6 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
  z = z > 8856e-6 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;
  var l = 116 * y - 16;
  var a = 500 * (x - y);
  var b = 200 * (y - z);
  return [
    l,
    a,
    b
  ];
};
convert.lab.xyz = function(lab) {
  var l = lab[0];
  var a = lab[1];
  var b = lab[2];
  var x;
  var y;
  var z;
  y = (l + 16) / 116;
  x = a / 500 + y;
  z = y - b / 200;
  var y2 = Math.pow(y, 3);
  var x2 = Math.pow(x, 3);
  var z2 = Math.pow(z, 3);
  y = y2 > 8856e-6 ? y2 : (y - 16 / 116) / 7.787;
  x = x2 > 8856e-6 ? x2 : (x - 16 / 116) / 7.787;
  z = z2 > 8856e-6 ? z2 : (z - 16 / 116) / 7.787;
  x *= 95.047;
  y *= 100;
  z *= 108.883;
  return [
    x,
    y,
    z
  ];
};
convert.lab.lch = function(lab) {
  var l = lab[0];
  var a = lab[1];
  var b = lab[2];
  var h;
  var hr = Math.atan2(b, a);
  h = hr * 360 / 2 / Math.PI;
  if (h < 0) {
    h += 360;
  }
  var c = Math.sqrt(a * a + b * b);
  return [
    l,
    c,
    h
  ];
};
convert.lch.lab = function(lch) {
  var l = lch[0];
  var c = lch[1];
  var h = lch[2];
  var hr = h / 360 * 2 * Math.PI;
  var a = c * Math.cos(hr);
  var b = c * Math.sin(hr);
  return [
    l,
    a,
    b
  ];
};
convert.rgb.ansi16 = function(args) {
  var saturation = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
  var _args = _sliced_to_array(args, 3), r = _args[0], g = _args[1], b = _args[2];
  var value = saturation === null ? convert.rgb.hsv(args)[2] : saturation;
  value = Math.round(value / 50);
  if (value === 0) {
    return 30;
  }
  var ansi = 30 + (Math.round(b / 255) << 2 | Math.round(g / 255) << 1 | Math.round(r / 255));
  if (value === 2) {
    ansi += 60;
  }
  return ansi;
};
convert.hsv.ansi16 = function(args) {
  return convert.rgb.ansi16(convert.hsv.rgb(args), args[2]);
};
convert.rgb.ansi256 = function(args) {
  var r = args[0];
  var g = args[1];
  var b = args[2];
  if (r === g && g === b) {
    if (r < 8) {
      return 16;
    }
    if (r > 248) {
      return 231;
    }
    return Math.round((r - 8) / 247 * 24) + 232;
  }
  var ansi = 16 + 36 * Math.round(r / 255 * 5) + 6 * Math.round(g / 255 * 5) + Math.round(b / 255 * 5);
  return ansi;
};
convert.ansi16.rgb = function(args) {
  var color = args % 10;
  if (color === 0 || color === 7) {
    if (args > 50) {
      color += 3.5;
    }
    color = color / 10.5 * 255;
    return [
      color,
      color,
      color
    ];
  }
  var mult = (~~(args > 50) + 1) * 0.5;
  var r = (color & 1) * mult * 255;
  var g = (color >> 1 & 1) * mult * 255;
  var b = (color >> 2 & 1) * mult * 255;
  return [
    r,
    g,
    b
  ];
};
convert.ansi256.rgb = function(args) {
  if (args >= 232) {
    var c = (args - 232) * 10 + 8;
    return [
      c,
      c,
      c
    ];
  }
  args -= 16;
  var rem;
  var r = Math.floor(args / 36) / 5 * 255;
  var g = Math.floor((rem = args % 36) / 6) / 5 * 255;
  var b = rem % 6 / 5 * 255;
  return [
    r,
    g,
    b
  ];
};
convert.rgb.hex = function(args) {
  var integer = ((Math.round(args[0]) & 255) << 16) + ((Math.round(args[1]) & 255) << 8) + (Math.round(args[2]) & 255);
  var string = integer.toString(16).toUpperCase();
  return "000000".substring(string.length) + string;
};
convert.hex.rgb = function(args) {
  var match = args.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
  if (!match) {
    return [
      0,
      0,
      0
    ];
  }
  var colorString = match[0];
  if (match[0].length === 3) {
    colorString = colorString.split("").map(function(char) {
      return char + char;
    }).join("");
  }
  var integer = parseInt(colorString, 16);
  var r = integer >> 16 & 255;
  var g = integer >> 8 & 255;
  var b = integer & 255;
  return [
    r,
    g,
    b
  ];
};
convert.rgb.hcg = function(rgb) {
  var r = rgb[0] / 255;
  var g = rgb[1] / 255;
  var b = rgb[2] / 255;
  var max = Math.max(Math.max(r, g), b);
  var min = Math.min(Math.min(r, g), b);
  var chroma = max - min;
  var grayscale;
  var hue;
  if (chroma < 1) {
    grayscale = min / (1 - chroma);
  } else {
    grayscale = 0;
  }
  if (chroma <= 0) {
    hue = 0;
  } else if (max === r) {
    hue = (g - b) / chroma % 6;
  } else if (max === g) {
    hue = 2 + (b - r) / chroma;
  } else {
    hue = 4 + (r - g) / chroma;
  }
  hue /= 6;
  hue %= 1;
  return [
    hue * 360,
    chroma * 100,
    grayscale * 100
  ];
};
convert.hsl.hcg = function(hsl) {
  var s = hsl[1] / 100;
  var l = hsl[2] / 100;
  var c = l < 0.5 ? 2 * s * l : 2 * s * (1 - l);
  var f = 0;
  if (c < 1) {
    f = (l - 0.5 * c) / (1 - c);
  }
  return [
    hsl[0],
    c * 100,
    f * 100
  ];
};
convert.hsv.hcg = function(hsv) {
  var s = hsv[1] / 100;
  var v = hsv[2] / 100;
  var c = s * v;
  var f = 0;
  if (c < 1) {
    f = (v - c) / (1 - c);
  }
  return [
    hsv[0],
    c * 100,
    f * 100
  ];
};
convert.hcg.rgb = function(hcg) {
  var h = hcg[0] / 360;
  var c = hcg[1] / 100;
  var g = hcg[2] / 100;
  if (c === 0) {
    return [
      g * 255,
      g * 255,
      g * 255
    ];
  }
  var pure = [
    0,
    0,
    0
  ];
  var hi = h % 1 * 6;
  var v = hi % 1;
  var w = 1 - v;
  var mg = 0;
  switch (Math.floor(hi)) {
    case 0:
      pure[0] = 1;
      pure[1] = v;
      pure[2] = 0;
      break;
    case 1:
      pure[0] = w;
      pure[1] = 1;
      pure[2] = 0;
      break;
    case 2:
      pure[0] = 0;
      pure[1] = 1;
      pure[2] = v;
      break;
    case 3:
      pure[0] = 0;
      pure[1] = w;
      pure[2] = 1;
      break;
    case 4:
      pure[0] = v;
      pure[1] = 0;
      pure[2] = 1;
      break;
    default:
      pure[0] = 1;
      pure[1] = 0;
      pure[2] = w;
  }
  mg = (1 - c) * g;
  return [
    (c * pure[0] + mg) * 255,
    (c * pure[1] + mg) * 255,
    (c * pure[2] + mg) * 255
  ];
};
convert.hcg.hsv = function(hcg) {
  var c = hcg[1] / 100;
  var g = hcg[2] / 100;
  var v = c + g * (1 - c);
  var f = 0;
  if (v > 0) {
    f = c / v;
  }
  return [
    hcg[0],
    f * 100,
    v * 100
  ];
};
convert.hcg.hsl = function(hcg) {
  var c = hcg[1] / 100;
  var g = hcg[2] / 100;
  var l = g * (1 - c) + 0.5 * c;
  var s = 0;
  if (l > 0 && l < 0.5) {
    s = c / (2 * l);
  } else if (l >= 0.5 && l < 1) {
    s = c / (2 * (1 - l));
  }
  return [
    hcg[0],
    s * 100,
    l * 100
  ];
};
convert.hcg.hwb = function(hcg) {
  var c = hcg[1] / 100;
  var g = hcg[2] / 100;
  var v = c + g * (1 - c);
  return [
    hcg[0],
    (v - c) * 100,
    (1 - v) * 100
  ];
};
convert.hwb.hcg = function(hwb) {
  var w = hwb[1] / 100;
  var b = hwb[2] / 100;
  var v = 1 - b;
  var c = v - w;
  var g = 0;
  if (c < 1) {
    g = (v - c) / (1 - c);
  }
  return [
    hwb[0],
    c * 100,
    g * 100
  ];
};
convert.apple.rgb = function(apple) {
  return [
    apple[0] / 65535 * 255,
    apple[1] / 65535 * 255,
    apple[2] / 65535 * 255
  ];
};
convert.rgb.apple = function(rgb) {
  return [
    rgb[0] / 255 * 65535,
    rgb[1] / 255 * 65535,
    rgb[2] / 255 * 65535
  ];
};
convert.gray.rgb = function(args) {
  return [
    args[0] / 100 * 255,
    args[0] / 100 * 255,
    args[0] / 100 * 255
  ];
};
convert.gray.hsl = function(args) {
  return [
    0,
    0,
    args[0]
  ];
};
convert.gray.hsv = convert.gray.hsl;
convert.gray.hwb = function(gray) {
  return [
    0,
    100,
    gray[0]
  ];
};
convert.gray.cmyk = function(gray) {
  return [
    0,
    0,
    0,
    gray[0]
  ];
};
convert.gray.lab = function(gray) {
  return [
    gray[0],
    0,
    0
  ];
};
convert.gray.hex = function(gray) {
  var val = Math.round(gray[0] / 100 * 255) & 255;
  var integer = (val << 16) + (val << 8) + val;
  var string = integer.toString(16).toUpperCase();
  return "000000".substring(string.length) + string;
};
convert.rgb.gray = function(rgb) {
  var val = (rgb[0] + rgb[1] + rgb[2]) / 3;
  return [
    val / 255 * 100
  ];
};
const conversions$1 = /* @__PURE__ */ _commonjsHelpers.getDefaultExportFromCjs(conversions);
;
var __ignore = typeof __moduleExports === "undefined" ? 0 : 0;
globalThis.____forceExport = conversions;
exports.conversions = conversions;
exports.default = conversions$1;

})




// id: _virtual/route.js
// name: _virtual/route
// facadeModuleId:  /Users/z/Projects/vxrn/node_modules/color-convert/route.js?commonjs-proxy
___modules___["_virtual/route.js"] = ((exports, module) => {
const require = createRequire("_virtual/route.js", {
  "../node_modules/color-convert/route.js": "color-convert/route.js"
})

"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const route = require("../node_modules/color-convert/route.js");
exports.default = route.route;

})




// id: _virtual/conversions.js
// name: _virtual/conversions
// facadeModuleId:  /Users/z/Projects/vxrn/node_modules/color-convert/conversions.js?commonjs-proxy
___modules___["_virtual/conversions.js"] = ((exports, module) => {
const require = createRequire("_virtual/conversions.js", {
  "../node_modules/color-convert/conversions.js": "color-convert/conversions.js"
})

"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const conversions = require("../node_modules/color-convert/conversions.js");
exports.default = conversions.conversions;

})




// id: _virtual/_commonjsHelpers.js
// name: _virtual/_commonjsHelpers
// facadeModuleId:  commonjsHelpers.js
___modules___["_virtual/_commonjsHelpers.js"] = ((exports, module) => {
const require = createRequire("_virtual/_commonjsHelpers.js", {})

"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
function _instanceof(left, right) {
  if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
    return !!right[Symbol.hasInstance](left);
  } else {
    return left instanceof right;
  }
}
function _instanceof1(left, right) {
  if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
    return !!right[Symbol.hasInstance](left);
  } else {
    return _instanceof(left, right);
  }
}
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
function getDefaultExportFromNamespaceIfPresent(n) {
  return n && Object.prototype.hasOwnProperty.call(n, "default") ? n["default"] : n;
}
function getDefaultExportFromNamespaceIfNotNamed(n) {
  return n && Object.prototype.hasOwnProperty.call(n, "default") && Object.keys(n).length === 1 ? n["default"] : n;
}
function getAugmentedNamespace(n) {
  if (n.__esModule) return n;
  var f = n.default;
  if (typeof f == "function") {
    var a = function a2() {
      if (_instanceof1(this, a2)) {
        return Reflect.construct(f, arguments, this.constructor);
      }
      return f.apply(this, arguments);
    };
    a.prototype = f.prototype;
  } else a = {};
  Object.defineProperty(a, "__esModule", {
    value: true
  });
  Object.keys(n).forEach(function(k) {
    var d = Object.getOwnPropertyDescriptor(n, k);
    Object.defineProperty(a, k, d.get ? d : {
      enumerable: true,
      get: function get() {
        return n[k];
      }
    });
  });
  return a;
}
globalThis.____forceExport = commonjsGlobal;
globalThis.____forceExport = getDefaultExportFromCjs;
globalThis.____forceExport = getDefaultExportFromNamespaceIfPresent;
globalThis.____forceExport = getDefaultExportFromNamespaceIfNotNamed;
globalThis.____forceExport = getAugmentedNamespace;
exports.commonjsGlobal = commonjsGlobal;
exports.getAugmentedNamespace = getAugmentedNamespace;
exports.getDefaultExportFromCjs = getDefaultExportFromCjs;
exports.getDefaultExportFromNamespaceIfNotNamed = getDefaultExportFromNamespaceIfNotNamed;
exports.getDefaultExportFromNamespaceIfPresent = getDefaultExportFromNamespaceIfPresent;

})




// id: color-convert/index.js
// name: node_modules/color-convert/index
// facadeModuleId: /Users/z/Projects/vxrn/node_modules/color-convert/index.js
___modules___["color-convert/index.js"] = ((exports, module) => {
const require = createRequire("color-convert/index.js", {
  "../_virtual/_commonjsHelpers.js": "_virtual/_commonjsHelpers.js",
  "../_virtual/conversions.js": "_virtual/conversions.js",
  "../_virtual/route.js": "_virtual/route.js",
  "../node_modules/color-convert/conversions.js": "color-convert/conversions.js",
  "../node_modules/color-convert/route.js": "color-convert/route.js"
})

"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const _commonjsHelpers = require("../../_virtual/_commonjsHelpers.js");
require("../../_virtual/conversions.js");
require("../../_virtual/route.js");
const conversions$1 = require("./conversions.js");
const route$1 = require("./route.js");
function _type_of(obj) {
  "@swc/helpers - typeof";
  return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
}
var conversions = conversions$1.conversions;
var route = route$1.route;
var convert = {};
var models = Object.keys(conversions);
function wrapRaw(fn) {
  var wrappedFn = function wrappedFn2() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    var arg0 = args[0];
    if (arg0 === void 0 || arg0 === null) {
      return arg0;
    }
    if (arg0.length > 1) {
      args = arg0;
    }
    return fn(args);
  };
  if ("conversion" in fn) {
    wrappedFn.conversion = fn.conversion;
  }
  return wrappedFn;
}
function wrapRounded(fn) {
  var wrappedFn = function wrappedFn2() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    var arg0 = args[0];
    if (arg0 === void 0 || arg0 === null) {
      return arg0;
    }
    if (arg0.length > 1) {
      args = arg0;
    }
    var result = fn(args);
    if ((typeof result === "undefined" ? "undefined" : _type_of(result)) === "object") {
      for (var len = result.length, i = 0; i < len; i++) {
        result[i] = Math.round(result[i]);
      }
    }
    return result;
  };
  if ("conversion" in fn) {
    wrappedFn.conversion = fn.conversion;
  }
  return wrappedFn;
}
models.forEach(function(fromModel) {
  convert[fromModel] = {};
  Object.defineProperty(convert[fromModel], "channels", {
    value: conversions[fromModel].channels
  });
  Object.defineProperty(convert[fromModel], "labels", {
    value: conversions[fromModel].labels
  });
  var routes = route(fromModel);
  var routeModels = Object.keys(routes);
  routeModels.forEach(function(toModel) {
    var fn = routes[toModel];
    convert[fromModel][toModel] = wrapRounded(fn);
    convert[fromModel][toModel].raw = wrapRaw(fn);
  });
});
var colorConvert = convert;
const index = /* @__PURE__ */ _commonjsHelpers.getDefaultExportFromCjs(colorConvert);
;
var __ignore = typeof __moduleExports === "undefined" ? 0 : 0;
globalThis.____forceExport = colorConvert;
exports.default = index;

})




// id: examples/require-test/src/entry-native.js
// name: examples/require-test/src/entry-native
// facadeModuleId: /Users/z/Projects/vxrn/examples/require-test/src/entry-native.tsx
___modules___["examples/require-test/src/entry-native.js"] = ((exports, module) => {
const require = createRequire("examples/require-test/src/entry-native.js", {
  "../../../node_modules/color-convert/index.js": "color-convert/index.js"
})

"use strict";
const index = require("../../../node_modules/color-convert/index.js");
console.log(index);

})


// run entry
const __require = createRequire(":root:", {})
// Commented out for testing in a Node.js environment
// __require("react-native")
__require("examples/require-test/src/entry-native.js")

