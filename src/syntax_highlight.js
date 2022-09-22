import CodeMirror from './codemirror';
import { codeMirrorMode, codeMirrorTabSize } from './codemirror';

export const highlightCode = function (code, language) {
  try {
    const mode = shouldSkip(code) ? 'text/plain' : codeMirrorMode(language);
    const tmp = document.createElement('div');
    CodeMirror.runMode(code, mode, tmp, {
      tabSize: codeMirrorTabSize(language),
    });
    return tmp.innerHTML;
  } catch (ex) {
    console.warn(`Failed to highlight: ${ex.message}`);
    console.warn(ex);
  }
};

export const highlightEscapedCode = function (code, language) {
  const tmp = document.createElement('div');
  tmp.innerHTML = code;
  return highlightCode(tmp.textContent, language);
};

const shouldSkip = (code) => {
  const lines = code.split('\n');
  return lines.length > 2000 || lines.some((x) => x.length > 500);
};
