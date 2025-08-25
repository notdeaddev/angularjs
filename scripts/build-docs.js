#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const esbuild = require('esbuild');
const Dgeni = require('dgeni');
const {spawnSync} = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const docsDir = path.join(rootDir, 'docs');
const outputFolder = path.join(rootDir, 'build', 'docs');

function ensureDir(dir) {
  fs.mkdirSync(dir, {recursive: true});
}

function normalizePattern(p) {
  return p.startsWith('/') ? p.slice(1) : p;
}

function copyFile(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

function copyDir(src, dest) {
  fs.cpSync(src, dest, {recursive: true});
}

function copyAngular() {
  const buildDir = path.join(rootDir, 'build');
  const modules = [
    'angular',
    'angular-resource',
    'angular-route',
    'angular-cookies',
    'angular-sanitize',
    'angular-touch',
    'angular-animate',
    'angular-mocks'
  ];

  for (const mod of modules) {
    copyFile(path.join(buildDir, `${mod}.js`), path.join(outputFolder, `${mod}.js`));
    copyFile(path.join(buildDir, `${mod}.min.js`), path.join(outputFolder, `${mod}.min.js`));
    copyFile(path.join(buildDir, `${mod}.min.js.map`), path.join(outputFolder, `${mod}.min.js.map`));
  }
}

async function buildApp() {
  const files = glob.sync(path.join(docsDir, 'app/src/**/*.js'), {
    ignore: path.join(docsDir, 'app/src/angular.bind.js')
  }).sort();
  const code = files.map(f => fs.readFileSync(f, 'utf8')).join('\n');
  const jsOutDir = path.join(outputFolder, 'js');
  ensureDir(jsOutDir);
  fs.writeFileSync(path.join(jsOutDir, 'docs.js'), code);
  const result = await esbuild.transform(code, {
    minify: true,
    sourcemap: true,
    sourcefile: 'docs.js'
  });
  fs.writeFileSync(path.join(jsOutDir, 'docs.min.js'), result.code);
  fs.writeFileSync(path.join(jsOutDir, 'docs.min.js.map'), result.map);
}

async function minifyAsset(source, target) {
  const code = fs.readFileSync(source, 'utf8');
  const result = await esbuild.transform(code, {
    minify: true,
    sourcemap: true,
    sourcefile: path.basename(source)
  });
  fs.writeFileSync(target, result.code);
  fs.writeFileSync(target + '.map', result.map);
}

function copyComponent(component, pattern='/**/*', base='', sourceFolder='node_modules', packageFile='package.json') {
  const srcRoot = path.join(rootDir, sourceFolder, component);
  const version = JSON.parse(fs.readFileSync(path.join(srcRoot, packageFile), 'utf8')).version;
  const destRoot = path.join(outputFolder, 'components', `${component}-${version}`);
  const files = glob.sync(path.join(srcRoot, normalizePattern(pattern)), {nodir: true});
  for (const file of files) {
    const rel = path.relative(path.join(srcRoot, base), file);
    copyFile(file, path.join(destRoot, rel));
  }
}

async function assets() {
  copyDir(path.join(docsDir, 'img'), path.join(outputFolder, 'img'));
  copyDir(path.join(docsDir, 'app/assets'), outputFolder);

  const jsAssets = glob.sync(path.join(docsDir, 'app/assets/**/*.js'));
  for (const file of jsAssets) {
    const rel = path.relative(path.join(docsDir, 'app/assets'), file);
    const dest = path.join(outputFolder, rel.replace(/\.js$/, '.min.js'));
    await minifyAsset(file, dest);
  }

  copyComponent('bootstrap', '/dist/css/bootstrap?(.min).css', 'dist');
  copyComponent('bootstrap', '/dist/fonts/*', 'dist');
  copyComponent('open-sans-fontface', '/fonts/{Regular,Semibold,Bold}/*');
  copyComponent('lunr', '/lunr?(.min).js');
  copyComponent('google-code-prettify', '/**/{lang-css,prettify}.js');
  copyComponent('jquery', '/dist/jquery.js', 'dist');
  copyComponent('marked', '/lib/marked.js');
  copyComponent('marked', '/marked.min.js');
}

async function docGen() {
  const dgeni = new Dgeni([require(path.join(docsDir, 'config'))]);
  await dgeni.generate();
}

function runDocsTests() {
  const result = spawnSync(
    'npm',
    ['run', 'karma', '--', 'start', path.join(rootDir, 'karma-docs.conf.js'), '--single-run'],
    {stdio: 'inherit'}
  );
  if (result.status !== 0) {
    throw new Error('Docs tests failed');
  }
}

async function main() {
  copyAngular();
  await docGen();
  await buildApp();
  await assets();
  runDocsTests();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
