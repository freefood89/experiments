const rollup = require('rollup');
const handler = require('serve-handler');
const http = require('http');
const watcher = rollup.watch({
  input: 'src/index.js',
  output: {
    file: 'public/index.js',
    format: 'umd'
  },
});

// const server = http.createServer((request, response) => {
//   // You pass two more arguments for config and middleware
//   // More details here: https://github.com/zeit/serve-handler#options
//   return handler(request, response, {
//     "public": "public"
//   });
// })

// server.listen(3000, () => {
//   console.log('Running at http://localhost:3000');
// });

function getResetScreen(clearScreen) {
  if (clearScreen) {
    return (heading) => stderr(CLEAR_SCREEN + heading);
  }
  let firstRun = true;
  return (heading) => {
    if (firstRun) {
      stderr(heading);
      firstRun = false;
    }
  };
}

const tc = {
  enabled: process.env.FORCE_COLOR ||
      process.platform === "win32" ||
      (process.stdout.isTTY && process.env.TERM && process.env.TERM !== "dumb")
};
const Styles = (tc.Styles = {});
const defineProp = Object.defineProperty;
const init = (style, open, close, re) => {
  let i, len = 1, seq = [(Styles[style] = { open, close, re })];
  const fn = s => {
      if (tc.enabled) {
          for (i = 0, s += ""; i < len; i++) {
              style = seq[i];
              s =
                  (open = style.open) +
                      (~s.indexOf((close = style.close), 4) // skip first \x1b[
                          ? s.replace(style.re, open)
                          : s) +
                      close;
          }
          len = 1;
      }
      return s;
  };
  defineProp(tc, style, {
      get: () => {
          for (let k in Styles)
              defineProp(fn, k, {
                  get: () => ((seq[len++] = Styles[k]), fn)
              });
          delete tc[style];
          return (tc[style] = fn);
      },
      configurable: true
  });
};
init("reset", "\x1b[0m", "\x1b[0m", /\x1b\[0m/g);
init("bold", "\x1b[1m", "\x1b[22m", /\x1b\[22m/g);
init("dim", "\x1b[2m", "\x1b[22m", /\x1b\[22m/g);
init("italic", "\x1b[3m", "\x1b[23m", /\x1b\[23m/g);
init("underline", "\x1b[4m", "\x1b[24m", /\x1b\[24m/g);
init("inverse", "\x1b[7m", "\x1b[27m", /\x1b\[27m/g);
init("hidden", "\x1b[8m", "\x1b[28m", /\x1b\[28m/g);
init("strikethrough", "\x1b[9m", "\x1b[29m", /\x1b\[29m/g);
init("black", "\x1b[30m", "\x1b[39m", /\x1b\[39m/g);
init("red", "\x1b[31m", "\x1b[39m", /\x1b\[39m/g);
init("green", "\x1b[32m", "\x1b[39m", /\x1b\[39m/g);
init("yellow", "\x1b[33m", "\x1b[39m", /\x1b\[39m/g);
init("blue", "\x1b[34m", "\x1b[39m", /\x1b\[39m/g);
init("magenta", "\x1b[35m", "\x1b[39m", /\x1b\[39m/g);
init("cyan", "\x1b[36m", "\x1b[39m", /\x1b\[39m/g);
init("white", "\x1b[37m", "\x1b[39m", /\x1b\[39m/g);
init("gray", "\x1b[90m", "\x1b[39m", /\x1b\[39m/g);
init("bgBlack", "\x1b[40m", "\x1b[49m", /\x1b\[49m/g);
init("bgRed", "\x1b[41m", "\x1b[49m", /\x1b\[49m/g);
init("bgGreen", "\x1b[42m", "\x1b[49m", /\x1b\[49m/g);
init("bgYellow", "\x1b[43m", "\x1b[49m", /\x1b\[49m/g);
init("bgBlue", "\x1b[44m", "\x1b[49m", /\x1b\[49m/g);
init("bgMagenta", "\x1b[45m", "\x1b[49m", /\x1b\[49m/g);
init("bgCyan", "\x1b[46m", "\x1b[49m", /\x1b\[49m/g);
init("bgWhite", "\x1b[47m", "\x1b[49m", /\x1b\[49m/g);
var turbocolor = tc;

// log to stderr to keep `rollup main.js > bundle.js` from breaking
const stderr = console.error.bind(console);
function handleError(err, recover = false) {
  let description = err.message || err;
  if (err.name)
      description = `${err.name}: ${description}`;
  const message = (err.plugin
      ? `(plugin ${err.plugin}) ${description}`
      : description) || err;
  stderr(turbocolor.bold.red(`[!] ${turbocolor.bold(message.toString())}`));
  if (err.url) {
      stderr(turbocolor.cyan(err.url));
  }
  if (err.loc) {
      stderr(`${index.relativeId((err.loc.file || err.id))} (${err.loc.line}:${err.loc.column})`);
  }
  else if (err.id) {
      stderr(index.relativeId(err.id));
  }
  if (err.frame) {
      stderr(turbocolor.dim(err.frame));
  }
  if (err.stack) {
      stderr(turbocolor.dim(err.stack));
  }
  stderr('');
  if (!recover)
      process.exit(1);
}

function batchWarnings() {
  let allWarnings = new Map();
  let count = 0;
  return {
      get count() {
          return count;
      },
      add: (warning) => {
          if (typeof warning === 'string') {
              warning = { code: 'UNKNOWN', message: warning };
          }
          if (warning.code in immediateHandlers) {
              immediateHandlers[warning.code](warning);
              return;
          }
          if (!allWarnings.has(warning.code))
              allWarnings.set(warning.code, []);
          allWarnings.get(warning.code).push(warning);
          count += 1;
      },
      flush: () => {
          if (count === 0)
              return;
          const codes = Array.from(allWarnings.keys()).sort((a, b) => {
              if (deferredHandlers[a] && deferredHandlers[b]) {
                  return deferredHandlers[a].priority - deferredHandlers[b].priority;
              }
              if (deferredHandlers[a])
                  return -1;
              if (deferredHandlers[b])
                  return 1;
              return (allWarnings.get(b).length -
                  allWarnings.get(a).length);
          });
          codes.forEach(code => {
              const handler = deferredHandlers[code];
              const warnings = allWarnings.get(code);
              if (handler) {
                  handler.fn(warnings);
              }
              else {
                  warnings.forEach(warning => {
                      title(warning.message);
                      if (warning.url)
                          info(warning.url);
                      const id = (warning.loc && warning.loc.file) || warning.id;
                      if (id) {
                          const loc = warning.loc
                              ? `${index.relativeId(id)}: (${warning.loc.line}:${warning.loc.column})`
                              : index.relativeId(id);
                          stderr(turbocolor.bold(index.relativeId(loc)));
                      }
                      if (warning.frame)
                          info(warning.frame);
                  });
              }
          });
          allWarnings = new Map();
          count = 0;
      }
  };
}
const silent = false
const isTTY = Boolean(process.stderr.isTTY);
const warnings = batchWarnings();
const clearScreen = true // initialConfigs.every(config => config.watch.clearScreen !== false);
const resetScreen = getResetScreen(isTTY && clearScreen);

watcher.on('event', (event) => {
  switch (event.code) {
    case 'FATAL':
      handleError(event.error, true);
      process.exit(1);
      break;
    case 'ERROR':
      warnings.flush();
      handleError(event.error, true);
      break;
    case 'START':
      if (!silent) {
        // resetScreen(turbocolor.underline(`rollup v${index.version}`));
      }
      break;
    case 'BUNDLE_START':
      if (!silent) {
        let input = event.input;
        if (typeof input !== 'string') {
          input = Array.isArray(input)
          ? input.join(', ')
          : Object.keys(input)
          .map(key => input[key])
          .join(', ');
        }
        stderr(turbocolor.cyan(`bundles ${turbocolor.bold(input)} → ${turbocolor.bold(event.output.map(index.relativeId).join(', '))}...`));
      }
      break;
    case 'BUNDLE_END':
      warnings.flush();
      if (!silent)
        stderr(turbocolor.green(`created ${turbocolor.bold(event.output.map(index.relativeId).join(', '))} in ${turbocolor.bold(prettyMs(event.duration))}`));
      if (event.result && event.result.getTimings) {
        printTimings(event.result.getTimings());
      }
      break;
    case 'END':
      if (!silent && isTTY) {
        stderr(`\n[${dateTime_1()}] waiting for changes...`);
      }
  }
});

// // stop watching
// watcher.close();
