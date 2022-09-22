import './codemirror-styles.css';

import CodeMirror from 'codemirror';

import 'codemirror/addon/runmode/runmode.js';

import 'codemirror/addon/edit/closebrackets.js';
import 'codemirror/addon/edit/matchbrackets.js';

import 'codemirror/addon/fold/foldcode.js';
import 'codemirror/addon/fold/foldgutter.js';
import 'codemirror/addon/fold/brace-fold.js';
import 'codemirror/addon/fold/comment-fold.js';

import 'codemirror/addon/search/search.js';
import 'codemirror/addon/search/searchcursor.js';

import 'codemirror/addon/dialog/dialog.js';

import 'codemirror/addon/selection/active-line.js';

import 'codemirror/addon/comment/comment.js';
import 'codemirror/addon/comment/continuecomment.js';

import 'codemirror/addon/mode/simple.js';

import 'codemirror/addon/hint/show-hint.js';

import 'codemirror/mode/diff/diff.js';
import 'codemirror/mode/xml/xml.js';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/mode/brainfuck/brainfuck.js';
import 'codemirror/mode/clike/clike.js';
import 'codemirror/mode/clojure/clojure.js';
import 'codemirror/mode/cobol/cobol.js';
import 'codemirror/mode/coffeescript/coffeescript.js';
import 'codemirror/mode/commonlisp/commonlisp.js';
import 'codemirror/mode/crystal/crystal.js';
import 'codemirror/mode/d/d.js';
import 'codemirror/mode/dart/dart.js';
import 'codemirror/mode/erlang/erlang.js';
import 'codemirror/mode/factor/factor.js';
import 'codemirror/mode/forth/forth.js';
import 'codemirror/mode/fortran/fortran.js';
import 'codemirror/mode/go/go.js';
import 'codemirror/mode/groovy/groovy.js';
import 'codemirror/mode/haskell/haskell.js';
import 'codemirror/mode/haxe/haxe.js';
import 'codemirror/mode/htmlmixed/htmlmixed.js';
import 'codemirror/mode/julia/julia.js';
import 'codemirror/mode/lua/lua.js';
import 'codemirror/mode/mllike/mllike.js';
import 'codemirror/mode/pascal/pascal.js';
import 'codemirror/mode/perl/perl.js';
import 'codemirror/mode/php/php.js';
import 'codemirror/mode/python/python.js';
import 'codemirror/mode/powershell/powershell.js';
import 'codemirror/mode/ruby/ruby.js';
import 'codemirror/mode/r/r.js';
import 'codemirror/mode/rust/rust.js';
import 'codemirror/mode/css/css.js';
import 'codemirror/mode/sass/sass.js';
import 'codemirror/mode/scheme/scheme.js';
import 'codemirror/mode/sql/sql.js';
import 'codemirror/mode/shell/shell.js';
import 'codemirror/mode/swift/swift.js';
import 'codemirror/mode/markdown/markdown.js';
import 'codemirror/mode/elm/elm.js';
import 'codemirror/mode/vb/vb.js';
import 'codemirror/mode/stex/stex.js';

import 'codemirror/keymap/sublime.js';
import 'codemirror/keymap/vim.js';
import 'codemirror/keymap/emacs.js';

import 'codemirror-mode-elixir';
import 'codemirror-solidity';
import {
  defineMode as defineAgdaMode,
  UNICODE_HELPER_PAIRS as AGDA_UNICODE_PAIRS,
} from '@codewars/codemirror-agda';
import {
  unicodeHelper,
  unicodeHelperWith,
} from '@codewars/codemirror-unicode-helper';
import { defineMode as defineLambdacalcMode } from '@codewars/codemirror-lambda-calculus';
import { defineMode as defineRiscvMode } from '@codewars/codemirror-riscv';
import NimCodeMirrorMode from 'nim-codemirror-mode';

NimCodeMirrorMode.register(CodeMirror);
defineAgdaMode(CodeMirror);
defineLambdacalcMode(CodeMirror);
defineRiscvMode(CodeMirror);
CodeMirror.registerGlobalHelper(
  'hint',
  'agda-input',
  // only enable in agda mode
  (mode, cm) => mode && mode.name === 'agda',
  unicodeHelperWith(AGDA_UNICODE_PAIRS)
);
CodeMirror.registerGlobalHelper(
  'hint',
  'julia-helper',
  // only enable in julia mode
  (mode, cm) => mode && mode.name === 'julia',
  unicodeHelper
);

export default CodeMirror;

export const codeMirrorMode = (mode) => {
  if (!mode || /^if(?:-not)?:/.test(mode)) return 'text/plain';

  switch (mode) {
    case 'bash':
    case 'shell':
      return 'shell';

    case 'bf':
      return 'text/x-brainfuck';
    case 'c':
      return 'text/x-c';
    case 'cpp':
      return 'text/x-c++src';
    case 'cfml':
      return 'javascript';
    case 'csharp':
      return 'text/x-csharp';

    case 'sql':
      return 'text/x-pgsql';

    case 'solidity':
      return 'text/x-solidity';
    case 'typescript':
      return 'application/typescript';

    case 'php':
      return 'text/x-php';
    case 'scala':
      return 'text/x-scala';
    case 'java':
      return 'text/x-java';
    case 'objc':
      return 'text/x-objectivec';
    case 'kotlin':
      return 'text/x-kotlin';
    case 'racket':
      return 'scheme';
    case 'lisp':
    case 'commonlisp':
      return 'text/x-common-lisp';

    case 'ocaml':
      return 'text/x-ocaml';
    case 'fsharp':
      return 'text/x-fsharp';
    case 'nim':
      return 'text/x-nim';
    case 'python':
    case 'python3':
      return 'python';
    case 'purescript':
    case 'idris':
      return 'text/x-haskell';
    case 'elm':
      return 'text/x-elm';
    case 'perl6':
    case 'raku':
      return 'text/x-perl6';
    case 'd':
      return 'text/x-d';
    case 'factor':
      return 'text/x-factor';
    case 'forth':
      return 'text/x-forth';
    case 'coq':
      return 'text/x-coq';
    case 'vb':
      return 'text/x-vb';
    case 'prolog':
      return 'text/x-prolog';
    case 'lean':
      return 'agda';
    case 'math':
    case 'latex':
      return 'text/x-latex';
    case 'cobol':
      return 'text/x-cobol';
    case 'haxe':
      return 'text/x-haxe';
    case 'json':
      return 'application/json';
    default:
      return mode;
  }
};

export const codeMirrorTabSize = (mode) => {
  switch (mode) {
    case 'kotlin':
    case 'python':
    case 'python3':
    case 'rust':
    case 'vb':
    case 'cfml':
    case 'raku':
    case 'perl':
    case 'd':
      return 4;
    default:
      return 2;
  }
};
