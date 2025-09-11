#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');
const { mergeFilesFor } = require(path.join(__dirname, '..', 'angularFiles.js'));
const pkg = require(path.join(__dirname, '..', 'package.json'));

function replaceVersionPlaceholders(src) {
  const branch = pkg.branchVersion || '0.0.0';
  const match = branch.match(/(\d+)\.(\d+)\.(\d+)/) || ['', '0', '0', '0'];
  const NG_VERSION = {
    full: `${match[1]}.${match[2]}.${match[3]}`,
    major: match[1],
    minor: match[2],
    patch: match[3],
    cdn: `${match[1]}.${match[2]}.${match[3]}`,
    codeName: 'snapshot'
  };
  return src
    .replace(/(["'])NG_VERSION_FULL\1/g, NG_VERSION.full)
    .replace(/(["'])NG_VERSION_MAJOR\1/, NG_VERSION.major)
    .replace(/(["'])NG_VERSION_MINOR\1/, NG_VERSION.minor)
    .replace(/(["'])NG_VERSION_DOT\1/, NG_VERSION.patch)
    .replace(/(["'])NG_VERSION_CDN\1/, NG_VERSION.cdn)
    .replace(/(["'])NG_VERSION_CODENAME\1/g, NG_VERSION.codeName);
}

async function buildAngular(outputFolder) {
  const rootDir = path.resolve(__dirname, '..');
  const outDir = outputFolder || path.join(rootDir, 'build');
  fs.mkdirSync(outDir, { recursive: true });

  const modules = [
    { name: 'angular', group: 'angularSrc', prefix: 'src/angular.prefix', suffix: 'src/angular.suffix' },
    { name: 'angular-loader', group: 'angularLoader', prefix: 'src/loader.prefix', suffix: 'src/loader.suffix' },
    {
      name: 'angular-resource',
      group: 'angularSrcModuleNgResource',
      prefix: 'src/module.prefix',
      suffix: 'src/module.suffix'
    },
    {
      name: 'angular-route',
      group: 'angularSrcModuleNgRoute',
      prefix: 'src/module.prefix',
      suffix: 'src/module.suffix'
    },
    {
      name: 'angular-cookies',
      group: 'angularSrcModuleNgCookies',
      prefix: 'src/module.prefix',
      suffix: 'src/module.suffix'
    },
    {
      name: 'angular-sanitize',
      group: 'angularSrcModuleNgSanitize',
      prefix: 'src/module.prefix',
      suffix: 'src/module.suffix'
    },
    {
      name: 'angular-touch',
      group: 'angularSrcModuleNgTouch',
      prefix: 'src/module.prefix',
      suffix: 'src/module.suffix'
    },
    { name: 'angular-aria', group: 'angularSrcModuleNgAria', prefix: 'src/module.prefix', suffix: 'src/module.suffix' },
    {
      name: 'angular-message-format',
      group: 'angularSrcModuleNgMessageFormat',
      prefix: 'src/module.prefix',
      suffix: 'src/module.suffix'
    },
    {
      name: 'angular-messages',
      group: 'angularSrcModuleNgMessages',
      prefix: 'src/module.prefix',
      suffix: 'src/module.suffix'
    },
    {
      name: 'angular-animate',
      group: 'angularSrcModuleNgAnimate',
      prefix: 'src/module.prefix',
      suffix: 'src/module.suffix'
    },
    {
      name: 'angular-mocks',
      files: ['src/ngMock/angular-mocks.js', 'src/ngMock/browserTrigger.js'],
      prefix: 'src/module.prefix',
      suffix: 'src/module.suffix'
    }
  ];

  for (const mod of modules) {
    const files = mod.files || mergeFilesFor(mod.group);
    const parts = [
      fs.readFileSync(path.join(rootDir, mod.prefix), 'utf8'),
      ...files.map(f => fs.readFileSync(path.join(rootDir, f), 'utf8')),
      fs.readFileSync(path.join(rootDir, mod.suffix), 'utf8')
    ];
    const code = replaceVersionPlaceholders(parts.join('\n'));
    const base = path.join(outDir, mod.name);
    fs.writeFileSync(`${base}.js`, code);
    const result = await esbuild.transform(code, {
      minify: true,
      sourcemap: true,
      sourcefile: `${mod.name}.js`
    });
    fs.writeFileSync(`${base}.min.js`, result.code);
    fs.writeFileSync(`${base}.min.js.map`, result.map);
  }

  const testBundles = [
    'angular-aria',
    'angular-cookies',
    'angular-message-format',
    'angular-messages',
    'angular-resource',
    'angular-route',
    'angular-sanitize',
    'angular-touch'
  ];
  const testBundlesDir = path.join(outDir, 'test-bundles');
  fs.mkdirSync(testBundlesDir, { recursive: true });
  for (const bundle of testBundles) {
    fs.copyFileSync(path.join(outDir, `${bundle}.js`), path.join(testBundlesDir, `${bundle}.js`));
  }
}

if (require.main === module) {
  buildAngular().catch(err => {
    console.error(err);
    process.exit(1);
  });
} else {
  module.exports = buildAngular;
}
