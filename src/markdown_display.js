import { highlightCode } from './syntax_highlight.js';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
// import katex from 'katex';

export class CustomRenderer extends marked.Renderer {
  constructor(options = {}) {
    let language = '';
    if (options.language) {
      language = options.language;
      delete options.language;
    }
    super(options);
    this._language = language;
  }

  codespan(code) {
    if (code && code.length > 2 && code.startsWith('$') && code.endsWith('$')) {
      const math = processKaTeX(code.slice(1, -1));
      if (math) return math;
    }
    return super.codespan(code);
  }

  code(code, infostring, escaped) {
    if (infostring) {
      // handle if/if-not blocks
      if (/^if:/.test(infostring)) {
        return matchIfBlockLanguage(infostring, this._language)
          ? marked(code, Object.assign({}, this.options, { renderer: this }))
          : '';
      }

      if (/^if-not:/.test(infostring)) {
        return matchIfBlockLanguage(infostring, this._language)
          ? ''
          : marked(code, Object.assign({}, this.options, { renderer: this }));
      }

      // Handle special % prefixed UI/alert blocks.
      // These blocks wrap the contents inside of a div.
      // Useful for info, warn, default, etc.
      if (infostring[0] === '%') {
        return (
          `<div class="block block--${infostring.substr(1)}">` +
          marked(code, Object.assign({}, this.options, { renderer: this })) +
          `</div>`
        );
      }

      // Render Math type setting with KaTex.
      // If KaTex is not loaded, it's highlighted as LaTex
      if (infostring === 'math') {
        const math = processKaTeX(code);
        if (math) return `<div>${math}</div>`;
      }
    }

    try {
      return super.code(code, infostring, escaped);
    } catch (ex) {
      console.warn('Failed to highlight markdown code block', ex.message);
      return `<pre><code>${code}</code></pre>`;
    }
  }
}

const markedOptions = {
  // Use GFM. Default: true
  gfm: true,
  // Add <br> on single line break. Requires `gfm`. Default: false
  breaks: false,
  // Use smarter list behavior than those found in markdown.pl. Default: false
  smartLists: true,
  // Returns HTML to be inserted inside `<pre><code class="language-LANG"></code></pre>`
  highlight: (code, lang) => highlightCode(code, lang),
};

const matchIfBlockLanguage = (text, language) =>
  text
    .replace(/^if(-not)?:/, '')
    .split(',')
    .includes(language);

// const processKaTeX = (code) =>
//   katex.renderToString(code, { throwOnError: false });

export const markdownWithLanguage = (markdown, language) => {
  const html = DOMPurify.sanitize(
    marked(
      markdown,
      Object.assign({}, markedOptions, {
        renderer: new CustomRenderer({ language }),
      })
    )
  );

  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  // Disable Turbolinks so `:target` selector works when linked to comments
  for (const link of tmp.querySelectorAll('a')) {
    link.setAttribute('data-turbolinks', 'false');
  }
  const examples = [];
  const languages = [];
  for (const pre of tmp.querySelectorAll('pre')) {
    // loop through each pre that is paired with another pre.
    // this way if there is only one pre or they don't immediately follow each other
    // then we will ignore them
    if (
      pre.nextElementSibling?.tagName?.toUpperCase() === 'PRE' ||
      pre.previousElementSibling?.tagName?.toUpperCase() === 'PRE'
    ) {
      const code = pre.querySelector('code[class^=language-]');
      if (code) {
        const lang = code.className.replace(/language-/, '');
        languages.push(lang);
        examples.push([lang, pre]);
      }
    }
  }
  if (languages.length === 0) return tmp.innerHTML;

  const fallbackLanguage = languages[0];
  const hasExample = languages.includes(language);
  for (const [lang, pre] of examples) {
    if (lang === language) continue;
    // if the language being filtered for isn't actually including in the list of examples, then
    // we will use the fallback
    // otherwise if the language is available in the list of possible languages, we will filter it out if its not current
    if (hasExample || lang !== fallbackLanguage) pre.style.display = 'none';
  }
  return tmp.innerHTML;
};
