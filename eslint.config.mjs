import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import promise from 'eslint-plugin-promise';
import prettier from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig([
  globalIgnores([
    'build/**/*',
    'docs/app/assets/js/angular-bootstrap/**/*',
    'docs/config/templates/**/*',
    'node_modules/**/*',
    'lib/htmlparser/**/*',
    'src/angular.bind.js',
    'src/ngParseExt/ucd.js',
    'i18n/closure/**/*',
    'tmp/**/*',
    'vendor/**/*',
    'eslint.config.mjs'
  ]),
  {
    rules: {
      // Rules are divided into sections from http://eslint.org/docs/rules/

      // Possible errors
      'comma-dangle': ['error', 'never'],
      'no-cond-assign': ['error', 'except-parens'],
      'no-constant-condition': ['error', { checkLoops: false }],
      'no-control-regex': 'error',
      'no-debugger': 'error',
      'no-dupe-args': 'error',
      'no-dupe-keys': 'error',
      'no-duplicate-case': 'error',
      'no-empty-character-class': 'error',
      'no-empty': 'error',
      'no-ex-assign': 'error',
      'no-extra-boolean-cast': 'error',
      'no-extra-semi': 'error',
      'no-func-assign': 'error',
      'no-inner-declarations': 'error',
      'no-invalid-regexp': 'error',
      'no-irregular-whitespace': 'error',
      'no-negated-in-lhs': 'error',
      'no-obj-calls': 'error',
      'no-regex-spaces': 'error',
      'no-sparse-arrays': 'error',
      'no-unreachable': 'error',
      'use-isnan': 'error',
      'no-unsafe-finally': 'error',
      'valid-typeof': 'error',
      'no-unexpected-multiline': 'error',

      // Best practices
      'accessor-pairs': 'error',
      'array-callback-return': 'error',
      eqeqeq: ['error', 'allow-null'],
      'no-alert': 'error',
      'no-caller': 'error',
      'no-case-declarations': 'error',
      'no-eval': 'error',
      'no-extend-native': 'error',
      'no-extra-bind': 'error',
      'no-extra-label': 'error',
      'no-fallthrough': 'error',
      'no-floating-decimal': 'error',
      'no-implied-eval': 'error',
      'no-invalid-this': 'error',
      'no-iterator': 'error',
      'no-multi-str': 'error',
      'no-new-func': 'error',
      'no-new-wrappers': 'error',
      'no-new': 'error',
      'no-octal-escape': 'error',
      'no-octal': 'error',
      'no-proto': 'error',
      'no-redeclare': 'error',
      'no-return-assign': 'error',
      'no-script-url': 'error',
      'no-self-assign': 'error',
      'no-self-compare': 'error',
      'no-sequences': 'error',
      'no-throw-literal': 'error',
      'no-unmodified-loop-condition': 'error',
      'no-unused-expressions': 'error',
      'no-unused-labels': 'error',
      'no-useless-call': 'error',
      'no-useless-concat': 'error',
      'no-useless-escape': 'error',
      'no-void': 'error',
      'no-with': 'error',
      radix: 'error',
      'wrap-iife': ['error', 'inside'],

      // Strict mode
      strict: ['error', 'global'],

      // Variables
      'no-delete-var': 'error',
      'no-label-var': 'error',
      'no-restricted-globals': ['error', 'event'],
      'no-shadow-restricted-names': 'error',
      'no-undef-init': 'error',
      'no-undef': 'error',
      'no-unused-vars': ['error', { vars: 'local', args: 'none', caughtErrors: 'none' }],

      // Node.js
      'handle-callback-err': 'error',

      // Stylistic issues
      'array-bracket-spacing': ['error', 'never'],
      'brace-style': ['error', '1tbs', { allowSingleLine: true }],
      'comma-style': ['error', 'last'],
      'eol-last': 'error',
      'keyword-spacing': 'error',
      'linebreak-style': ['error', 'unix'],
      'max-len': ['error', { code: 200, ignoreComments: true, ignoreUrls: true }],
      'new-cap': 'error',
      'new-parens': 'error',
      'no-array-constructor': 'error',
      'no-bitwise': 'error',
      'no-mixed-spaces-and-tabs': 'error',
      'no-multiple-empty-lines': ['error', { max: 3, maxEOF: 1 }],
      'no-whitespace-before-property': 'error',
      'no-spaced-func': 'error',
      'no-trailing-spaces': 'error',
      'no-unneeded-ternary': 'error',
      quotes: ['error', 'single'],
      'semi-spacing': 'error',
      semi: 'error',
      'space-before-blocks': ['error', 'always'],
      'space-before-function-paren': [
        'error',
        {
          anonymous: 'always',
          named: 'never',
          asyncArrow: 'always'
        }
      ],
      'space-in-parens': ['error', 'never'],
      'space-infix-ops': 'error',
      'space-unary-ops': ['error', { words: true, nonwords: false }],
      'unicode-bom': ['error', 'never'],
      'prettier/prettier': 'error' // ESLint enforces Prettier rules
    },
    languageOptions: {
      sourceType: 'script',
      ecmaVersion: 2017
    },
    plugins: { prettier }
  },

  // ROOT
  {
    files: ['*.js'],
    languageOptions: {
      sourceType: 'script',
      globals: {
        ...globals.node
      }
    }
  },

  // SRC
  {
    files: ['src/**/*.js'],
    languageOptions: {
      sourceType: 'script',
      globals: {
        ...globals.browser,
        createInjector: false,
        angular: false,
        msie: false,
        jqLite: false,
        jQuery: false,
        slice: false,
        splice: false,
        push: false,
        toString: false,
        minErrConfig: false,
        errorHandlingConfig: false,
        isValidObjectMaxDepth: false,
        ngMinErr: false,
        _angular: false,
        angularModule: false,
        nodeName_: false,
        uid: false,
        toDebugString: false,
        REGEX_STRING_REGEXP: false,
        lowercase: false,
        uppercase: false,
        isArrayLike: false,
        forEach: false,
        forEachSorted: false,
        reverseParams: false,
        nextUid: false,
        setHashKey: false,
        extend: false,
        toInt: false,
        inherit: false,
        merge: false,
        noop: false,
        identity: false,
        valueFn: false,
        isUndefined: false,
        isDefined: false,
        isObject: false,
        isString: false,
        isNumber: false,
        isNumberNaN: false,
        isDate: false,
        isError: false,
        isArray: false,
        isFunction: false,
        isRegExp: false,
        isWindow: false,
        isScope: false,
        isFile: false,
        isFormData: false,
        isBlob: false,
        isBoolean: false,
        isPromiseLike: false,
        hasCustomToString: false,
        trim: false,
        escapeForRegexp: false,
        isElement: false,
        makeMap: false,
        includes: false,
        arrayRemove: false,
        copy: false,
        shallowCopy: false,
        simpleCompare: false,
        equals: false,
        csp: false,
        concat: false,
        sliceArgs: false,
        bind: false,
        toJsonReplacer: false,
        toJson: false,
        fromJson: false,
        addDateMinutes: false,
        convertTimezoneToLocal: false,
        timezoneToOffset: false,
        startingTag: false,
        tryDecodeURIComponent: false,
        parseKeyValue: false,
        toKeyValue: false,
        encodeUriSegment: false,
        encodeUriQuery: false,
        angularInit: false,
        bootstrap: false,
        getTestability: false,
        snake_case: false,
        bindJQuery: false,
        assertArg: false,
        assertArgFn: false,
        assertNotHasOwnProperty: false,
        getter: false,
        getBlockNodes: false,
        createMap: false,
        VALIDITY_STATE_PROPERTY: false,
        reloadWithDebugInfo: false,
        stringify: false,
        UNSAFE_restoreLegacyJqLiteXHTMLReplacement: false,
        NODE_TYPE_ELEMENT: false,
        NODE_TYPE_ATTRIBUTE: false,
        NODE_TYPE_TEXT: false,
        NODE_TYPE_COMMENT: false,
        NODE_TYPE_DOCUMENT: false,
        NODE_TYPE_DOCUMENT_FRAGMENT: false,
        defaultHttpResponseTransform: false,
        getFirstThursdayOfYear: false,
        version: false,
        publishExternalAPI: false,
        minErr: false,
        setupModuleLoader: false,
        BOOLEAN_ATTR: false,
        ALIASED_ATTR: false,
        jqNextId: false,
        fnCamelCaseReplace: false,
        jqLitePatchJQueryRemove: false,
        JQLite: false,
        jqLiteClone: false,
        jqLiteDealoc: false,
        jqLiteOff: false,
        jqLiteRemoveData: false,
        jqLiteExpandoStore: false,
        jqLiteData: false,
        jqLiteHasClass: false,
        jqLiteRemoveClass: false,
        jqLiteAddClass: false,
        jqLiteAddNodes: false,
        jqLiteController: false,
        jqLiteInheritedData: false,
        jqLiteBuildFragment: false,
        jqLiteParseHTML: false,
        jqLiteWrapNode: false,
        getBooleanAttrName: false,
        getAliasedAttrName: false,
        createEventHandler: false,
        JQLitePrototype: false,
        jqLiteIsTextNode: false,
        jqLiteDocumentLoaded: false,
        hashKey: false,
        NgMap: false,
        urlResolve: false,
        urlIsSameOrigin: false,
        urlIsSameOriginAsBaseUrl: false,
        urlIsAllowedOriginFactory: false,
        identifierForController: false,
        directiveNormalize: false,
        markQExceptionHandled: false,
        SCE_CONTEXTS: false,
        ngDirective: false,
        createEventDirective: false,
        VALID_CLASS: false,
        INVALID_CLASS: false,
        PRISTINE_CLASS: false,
        DIRTY_CLASS: false,
        nullFormCtrl: false
      }
    },

    rules: {
      'no-redeclare': [
        'error',
        {
          builtinGlobals: false
        }
      ]
    }
  },

  {
    files: ['src/ngAnimate/**/*.js'],
    languageOptions: {
      globals: {
        copy: true,
        extend: true,
        forEach: true,
        isArray: true,
        isDefined: true,
        isElement: true,
        isFunction: true,
        isObject: true,
        isString: true,
        isUndefined: true,
        jqLite: true,
        noop: true,
        COMMENT_NODE: true,
        ELEMENT_NODE: true,
        NG_ANIMATE_CLASSNAME: true,
        NG_ANIMATE_CHILDREN_DATA: true,
        ADD_CLASS_SUFFIX: true,
        REMOVE_CLASS_SUFFIX: true,
        EVENT_CLASS_PREFIX: true,
        ACTIVE_CLASS_SUFFIX: true,
        PREPARE_CLASS_SUFFIX: true,
        ANIMATION_DELAY_PROP: true,
        ANIMATION_DURATION_PROP: true,
        ANIMATION_ITERATION_COUNT_KEY: true,
        ANIMATION_PROP: true,
        ANIMATIONEND_EVENT: true,
        DELAY_KEY: true,
        DURATION_KEY: true,
        PROPERTY_KEY: true,
        SAFE_FAST_FORWARD_DURATION_VALUE: true,
        TIMING_KEY: true,
        TRANSITION_DELAY_PROP: true,
        TRANSITION_DURATION_PROP: true,
        TRANSITION_PROP: true,
        TRANSITIONEND_EVENT: true,
        applyAnimationClassesFactory: false,
        applyAnimationFromStyles: false,
        applyAnimationStyles: false,
        applyAnimationToStyles: false,
        applyGeneratedPreparationClasses: false,
        applyInlineStyle: false,
        assertArg: false,
        blockKeyframeAnimations: false,
        clearGeneratedClasses: false,
        concatWithSpace: false,
        extractElementNode: false,
        getDomNode: false,
        helpers: false,
        mergeAnimationDetails: false,
        mergeClasses: false,
        packageStyles: false,
        pendClasses: false,
        prepareAnimationOptions: false,
        removeFromArray: false,
        stripCommentsFromElement: false,
        ngAnimateSwapDirective: true,
        $$rAFSchedulerFactory: true,
        $$AnimateCacheProvider: true,
        $$AnimateChildrenDirective: true,
        $$AnimateQueueProvider: true,
        $$AnimationProvider: true,
        $AnimateCssProvider: true,
        $$AnimateCssDriverProvider: true,
        $$AnimateJsProvider: true,
        $$AnimateJsDriverProvider: true
      }
    },
    rules: {
      maxlen: 'off',
      'new-cap': 'off'
    }
  },

  {
    files: ['src/ngLocale/**/*.js'],
    rules: {
      'block-spacing': 'off',
      eqeqeq: 'off',
      'max-len': 'off',
      'no-bitwise': 'off',
      'no-multi-spaces': 'off',
      quotes: 'off'
    }
  },

  {
    files: ['src/ngMessageFormat/**/*.js'],
    languageOptions: {
      globals: {
        goog: false
      }
    }
  },

  {
    files: ['src/ngMock/**/*.js'],
    languageOptions: {
      globals: {
        expect: false,
        jQuery: false
      }
    }
  },

  {
    files: ['src/ngRoute/**/*.js'],
    languageOptions: {
      globals: {
        ngRouteModule: false
      }
    }
  },

  {
    files: ['src/ngSanitize/**/*.js'],
    languageOptions: {
      globals: {
        sanitizeText: false
      }
    }
  },

  {
    files: ['src/ngTouch/**/*.js'],
    languageOptions: {
      globals: {
        ngTouch: false
      }
    }
  },

  // BENCHMARKS
  {
    files: ['benchmarks/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
        benchmarkSteps: false,
        console: false,
        angular: false,
        module: false
      }
    }
  },

  // DOCS
  {
    files: ['docs/protractor*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
        require: false,
        exports: false
      }
    }
  },

  {
    files: ['docs/app/e2e/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jasmine,
        ...globals.protractor,
        angular: false,
        inject: false,
        module: false,
        dealoc: false,
        _jQuery: false,
        _jqLiteMode: false,
        sortedHtml: false,
        childrenTagsOf: false,
        assertHidden: false,
        assertVisible: false,
        provideLog: false,
        spyOnlyCallsWithArgs: false,
        createMockStyleSheet: false,
        browserTrigger: false,
        jqLiteCacheSize: false
      }
    }
  },

  {
    files: ['docs/app/src/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
        lunr: false,
        angular: false
      }
    }
  },

  {
    files: ['docs/app/assets/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
        angular: false,
        importScripts: false
      }
    }
  },

  {
    files: ['docs/app/test/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jasmine,
        module: false,
        inject: true,
        angular: false
      }
    },
    rules: {
      'no-invalid-this': 'off',
      'no-throw-literal': 'off',
      'no-unused-vars': 'off'
    }
  },

  {
    files: ['docs/config/**/*.js'],
    languageOptions: {
      sourceType: 'script',
      globals: {
        ...globals.node
      }
    }
  },

  // I18N
  {
    files: ['i18n/e2e/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jasmine,
        ...globals.protractor,
        binding: false,
        input: false
      }
    }
  },

  {
    files: ['i18n/spec/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jasmine
      }
    }
  },

  {
    files: ['i18n/src/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jasmine
      }
    }
  },

  {
    files: ['i18n/ucd/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jasmine
      }
    }
  },

  {
    files: ['i18n/ucd/spec/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.jasmine
      }
    },
    rules: {
      'no-multi-str': 'off'
    }
  },

  // LIB
  {
    files: ['lib/**/*.js'],
    languageOptions: {
      sourceType: 'script',
      globals: {
        ...globals.node
      }
    }
  },

  // SCRIPTS
  {
    files: ['scripts/**/*.js'],
    languageOptions: {
      sourceType: 'script',
      globals: {
        ...globals.node
      }
    }
  },

  // TESTS
  {
    files: ['test/**/*.js'],
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...globals.jasmine,
        ...globals.browser,
        ArrayBuffer: false,
        Uint8Array: false,
        createInjector: false,
        angular: false,
        minErrConfig: false,
        errorHandlingConfig: false,
        msie: true,
        jqLite: false,
        jQuery: true,
        slice: false,
        push: false,
        toString: false,
        ngMinErr: false,
        _angular: false,
        angularModule: false,
        nodeName_: false,
        uid: true,
        toDebugString: false,
        serializeObject: false,
        lowercase: false,
        uppercase: false,
        isArrayLike: false,
        forEach: false,
        reverseParams: false,
        nextUid: false,
        setHashKey: false,
        extend: false,
        merge: false,
        toInt: false,
        inherit: false,
        noop: false,
        identity: false,
        valueFn: false,
        isUndefined: false,
        isDefined: false,
        isObject: false,
        isString: false,
        isNumber: false,
        isNumberNaN: false,
        isDate: false,
        isError: false,
        isArray: false,
        isFunction: false,
        isRegExp: false,
        isWindow: false,
        isScope: false,
        isFile: false,
        isBlob: false,
        isBoolean: false,
        trim: false,
        isElement: false,
        isPromiseLike: false,
        makeMap: false,
        map: false,
        includes: false,
        arrayRemove: false,
        copy: false,
        shallowCopy: false,
        equals: false,
        csp: false,
        jq: false,
        concat: false,
        sliceArgs: false,
        bind: false,
        toJsonReplacer: false,
        toJson: false,
        fromJson: false,
        startingTag: false,
        tryDecodeURIComponent: false,
        parseKeyValue: false,
        toKeyValue: false,
        encodeUriSegment: false,
        encodeUriQuery: false,
        angularInit: false,
        bootstrap: false,
        snake_case: false,
        bindJQuery: false,
        assertArg: false,
        assertArgFn: false,
        assertNotHasOwnProperty: false,
        getter: false,
        getBlockNodes: false,
        createMap: false,
        VALIDITY_STATE_PROPERTY: true,
        allowAutoBootstrap: false,
        isAutoBootstrapAllowed: false,
        version: false,
        publishExternalAPI: false,
        minErr: false,
        setupModuleLoader: false,
        BOOLEAN_ATTR: false,
        jqNextId: false,
        kebabToCamel: false,
        fnCamelCaseReplace: false,
        jqLitePatchJQueryRemove: false,
        JQLite: false,
        jqLiteClone: false,
        jqLiteDealoc: false,
        jqLiteOff: false,
        jqLiteRemoveData: false,
        jqLiteExpandoStore: false,
        jqLiteData: false,
        jqLiteHasClass: false,
        jqLiteRemoveClass: false,
        jqLiteAddClass: false,
        jqLiteAddNodes: false,
        jqLiteController: false,
        jqLiteInheritedData: false,
        getBooleanAttrName: false,
        createEventHandler: false,
        JQLitePrototype: false,
        jqLiteDocumentLoaded: false,
        hashKey: false,
        NgMapShim: false,
        urlResolve: false,
        urlIsSameOrigin: false,
        urlIsSameOriginAsBaseUrl: false,
        urlIsAllowedOriginFactory: false,
        dump: false,
        they: false,
        fthey: false,
        xthey: true,
        assertCompareNodes: true,
        inject: true,
        module: true,
        dealoc: true,
        _jQuery: true,
        _jqLiteMode: true,
        sortedHtml: true,
        childrenTagsOf: true,
        assertHidden: true,
        assertVisible: true,
        provideLog: true,
        spyOnlyCallsWithArgs: true,
        createMockStyleSheet: true,
        browserSupportsCssAnimations: true,
        browserTrigger: true,
        jqLiteCacheSize: true,
        createAsync: true,
        support: true,
        pending: true
      }
    },
    rules: {
      'no-invalid-this': 'off',
      'no-throw-literal': 'off',
      'no-unused-vars': 'off',
      'no-proto': 'off',
      'no-redeclare': [
        'error',
        {
          builtinGlobals: false
        }
      ]
    }
  },

  {
    files: ['test/ngAnimate/**/*.js'],
    languageOptions: {
      globals: {
        getDomNode: false,
        helpers: false,
        mergeAnimationDetails: false,
        prepareAnimationOptions: false,
        applyAnimationStyles: false,
        applyAnimationFromStyles: false,
        applyAnimationToStyles: false,
        applyAnimationClassesFactory: false,
        TRANSITIONEND_EVENT: false,
        TRANSITION_PROP: false,
        ANIMATION_PROP: false,
        ANIMATIONEND_EVENT: false,
        ANIMATE_TIMER_KEY: false
      }
    },
    rules: {
      'new-cap': 'off'
    }
  },

  {
    files: ['test/e2e/**/*.js'],
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...globals.node,
        jQuery: false,
        $: false
      }
    },
    plugins: {
      promise: promise
    }
  },

  {
    files: ['test/e2e/fixtures/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
        jQuery: false,
        $: false
      }
    }
  },

  {
    files: ['test/e2e/tests/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jasmine,
        ...globals.protractor,
        loadFixture: false
      }
    },
    plugins: {
      promise: promise
    }
  },

  {
    files: ['test/e2e/tools/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node
      }
    },
    plugins: {
      promise: promise
    }
  },

  eslintConfigPrettier // disables ESLint formatting rules that clash with Prettier
]);
