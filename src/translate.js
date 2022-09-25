import { BASE_URL, API_KEY } from './env.js';
import { markdownWithLanguage } from './markdown_display.js';
import { translated } from './controllers.js';
import { languageSelectorDropdown } from './selectors.js';

export async function translateKatas(kataDescriptionDiv) {
  const websiteURL = window.location.toString().split('/');
  const kataIdIndex = websiteURL.findIndex((element) => element === 'kata') + 1;
  const kataId = websiteURL[kataIdIndex];

  const languageSelectorContent = document
    .querySelector(languageSelectorDropdown)
    .innerText.toLowerCase();

  const kataLanguage = !!websiteURL.at(-1)
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
      try {
        if (!response.length) {
          throw 'fail';
        }
        if (!response[0].translated_description) {
          throw 'working';
        }

        const kataTranslatedMarkdown = response[0].translated_description;

        const htmlContent = markdownWithLanguage(
          kataTranslatedMarkdown,
          kataLanguage
        );

        kataDescriptionDiv.innerHTML = htmlContent;
        kataDescriptionDiv.prepend(createHeader('success'));
      } catch (headerType) {
        if (['fail', 'working', 'error'].includes(headerType)) {
          kataDescriptionDiv.prepend(createHeader(headerType));
        } else {
          console.error(headerType);
        }
      }
      kataDescriptionDiv.style.overflowY = 'hidden';
    })
    .catch((error) => console.error(error));

  translated = true;
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

  div.classList.add('header', headerType);

  div.appendChild(p);

  return div;
}
