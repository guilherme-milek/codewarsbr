import 'toastify-js/src/toastify.css';
import Toastify from 'toastify-js';

import { BASE_URL, API_KEY } from './env.js';
import { markdownWithLanguage } from './markdown_display.js';
import { languageSelectorDropdown } from './selectors.js';
import { translated } from './controllers.js';
import {
  toastErrorConfig,
  toastInfoConfig,
  toastSuccessConfig,
} from './toast.js';

export async function translateKatas(kataDescriptionDiv) {
  const infoToast = Toastify({
    ...toastInfoConfig,
    text: 'Obtendo a tradução desse kata...',
  });
  infoToast.showToast();

  try {
    const websiteURL = window.location.toString().split('/');
    const kataIdIndex =
      websiteURL.findIndex((element) => element === 'kata') + 1;
    const kataId = websiteURL[kataIdIndex];

    const languageSelectorContent = document
      .querySelector(languageSelectorDropdown)
      .innerText.toLowerCase();

    const kataLanguage =
      !!websiteURL.at(-1) && websiteURL.at(-1) !== kataId
        ? websiteURL.at(-1)
        : languageSelectorContent;

    const encodedURIComponent =
      'q=' + encodeURIComponent(`{"kata_id": "${kataId}"}`);

    const urlRequest = `${BASE_URL}/rest/katas?${encodedURIComponent}`;

    await fetch(urlRequest, {
      headers: {
        'cache-control': 'no-cache',
        'x-apikey': API_KEY,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        if (!response.length) {
          return kataDescriptionDiv.parentElement.prepend(createHeader('fail'));
        }
        if (!response[0].translated_description) {
          return kataDescriptionDiv.parentElement.prepend(
            createHeader('working')
          );
        }

        const kataTranslatedMarkdown = response[0].translated_description;

        const htmlContent = markdownWithLanguage(
          kataTranslatedMarkdown,
          kataLanguage
        );

        kataDescriptionDiv.innerHTML = htmlContent;
        kataDescriptionDiv.classList.add('fix-scroll');
        kataDescriptionDiv.parentElement.prepend(createHeader('success'));
      })
      .catch((error) => {
        throw new Error(error);
      });

    infoToast.hideToast();

    Toastify({
      ...toastSuccessConfig,
      text: 'Tradução obtida com sucesso!',
    }).showToast();

    translated = true;
  } catch (error) {
    infoToast.hideToast();

    Toastify({
      ...toastErrorConfig,
      text: error,
    }).showToast();

    console.error(error);
  }
}

function createHeader(headerType = 'error') {
  const div = document.createElement('div');
  const p = document.createElement('p');

  let headerMessage = 'Um erro ocorreu ao traduzir esse kata! &#10060';

  switch (headerType) {
    case 'success':
      headerMessage = 'Esse kata foi traduzido para português! &#128077';
      break;
    case 'working':
      headerMessage = 'Esse kata está sendo traduzido! &#9881';
      break;
    case 'fail':
      headerMessage = 'Sem tradução disponível para esse kata! &#128078';
      break;
  }

  p.innerHTML = headerMessage;

  div.classList.add(
    'header',
    headerType,
    'animate__animated',
    'animate__flipInX'
  );

  div.addEventListener('animationend', () => {
    div.classList.remove('animate__flipInX');
  });

  div.appendChild(p);

  return div;
}
