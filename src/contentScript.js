import { markdownWithLanguage } from './markdown_display.js';
import './contentScript.css';

// DETECT URL changes on the website.
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;

  if (url !== lastUrl) {
    lastUrl = url;

    window.location.reload(true);
  }
}).observe(document, { childList: true, subtree: true });

const targetNode = document.querySelector('#description');
let translated = false;

if (!!targetNode) {
  if (!translated && targetNode.innerText !== 'Loading description...') {
    translateKatas(targetNode);
  }

  new MutationObserver(() => {
    if (!translated && targetNode.innerText !== 'Loading description...') {
      translateKatas(targetNode);
    }
  }).observe(targetNode, { childList: true });
}

function translateKatas(descriptionDiv) {
  const websiteURL = window.location.toString().split('/');

  const kataIdIndex = websiteURL.findIndex((element) => element === 'kata') + 1;

  const kataId = websiteURL[kataIdIndex];
  const kataLanguage = websiteURL.at(-1);

  const encodedURIComponent =
    'where=' + encodeURIComponent(`{"id": "${kataId}"}`);

  const urlRequest = `https://api.sheetson.com/v2/sheets/katas?${encodedURIComponent}`;

  fetch(urlRequest, {
    headers: {
      'X-Spreadsheet-Id': '1wYaAuVO7Sidx8YOMFo5hQq6E1rdFkA-H133PB9Gq8sQ',
      Authorization:
        'Bearer 7piplesK5okpRzUaAIIvt9NBRBoVq5v1bWooOoZCoUIg4o5AsTjdy278KvvFVw',
    },
  })
    .then((response) => response.json())
    .then((response) => {
      if (!response.results.length) {
        throw 'fail';
      }
      if (response.results[0].description_translated === 'FALSE') {
        throw 'working';
      }

      const mdContent = response.results[0].translated_description;

      const htmlContent = markdownWithLanguage(mdContent, kataLanguage);

      descriptionDiv.innerHTML = htmlContent;

      descriptionDiv.style.overflowY = 'hidden';

      descriptionDiv.prepend(createHeader('success'));

      translated = true;
    })
    .catch((e) => {
      if (e === 'fail') {
        descriptionDiv.prepend(createHeader('fail'));
      } else if (e === 'working') {
        descriptionDiv.prepend(createHeader('working'));
      } else {
        descriptionDiv.prepend(createHeader('error'));
      }

      translated = true;
    });
}

function createHeader(type) {
  const div = document.createElement('div');
  const p = document.createElement('p');

  p.innerHTML =
    type === 'success'
      ? 'Esse kata foi traduzido para português! &#128077'
      : type === 'working'
      ? 'Esse kata está sendo traduzido! &#9881'
      : type === 'fail'
      ? 'Sem tradução disponível para esse kata! &#128078'
      : 'Um erro ocorreu ao traduzir esse kata! &#10060';

  div.classList.add('header', type);

  div.appendChild(p);

  return div;
}
