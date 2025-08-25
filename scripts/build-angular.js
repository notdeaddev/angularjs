#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');
const {mergeFilesFor} = require(path.join(__dirname, '..', 'angularFiles.js'));

async function buildAngular(outputFolder) {
  const rootDir = path.resolve(__dirname, '..');
  const outDir = outputFolder || path.join(rootDir, 'build');
  fs.mkdirSync(outDir, {recursive: true});

  const modules = [
    {name: 'angular', group: 'angularSrc', prefix: 'src/angular.prefix', suffix: 'src/angular.suffix'},
    {name: 'angular-resource', group: 'angularSrcModuleNgResource', prefix: 'src/module.prefix', suffix: 'src/module.suffix'},
    {name: 'angular-route', group: 'angularSrcModuleNgRoute', prefix: 'src/module.prefix', suffix: 'src/module.suffix'},
    {name: 'angular-cookies', group: 'angularSrcModuleNgCookies', prefix: 'src/module.prefix', suffix: 'src/module.suffix'},
    {name: 'angular-sanitize', group: 'angularSrcModuleNgSanitize', prefix: 'src/module.prefix', suffix: 'src/module.suffix'},
    {name: 'angular-touch', group: 'angularSrcModuleNgTouch', prefix: 'src/module.prefix', suffix: 'src/module.suffix'},
    {name: 'angular-animate', group: 'angularSrcModuleNgAnimate', prefix: 'src/module.prefix', suffix: 'src/module.suffix'},
    {
      name: 'angular-mocks',
      files: [
        'src/ngMock/angular-mocks.js',
        'src/ngMock/browserTrigger.js'
      ],
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
    const code = parts.join('\n');
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
}

if (require.main === module) {
  buildAngular().catch(err => {
    console.error(err);
    process.exit(1);
  });
} else {
  module.exports = buildAngular;
}
