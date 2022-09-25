import tippy, { roundArrow } from 'tippy.js';

import { BASE_URL, API_KEY } from './env.js';
import { statusUpdated } from './controllers.js';

import './tooltip.css'; // Tooltip theme (for Tippy)

export async function updateKataStatusFromList(
  kataDivNodeList,
  kataNameANodeList
) {
  const kataIds = [...kataDivNodeList].map(({ id }) => id);

  const encodedURIComponent =
    'q=' +
    encodeURIComponent(`{"kata_id": {"$in": ${JSON.stringify(kataIds)}}}`);

  const urlRequest = `${BASE_URL}/rest/katas?${encodedURIComponent}`;

  await fetch(urlRequest, {
    headers: {
      'cache-control': 'no-cache',
      'x-apikey': API_KEY,
    },
  })
    .then((response) => response.json())
    .then((response) => {
      kataNameANodeList.forEach((kataNameA) => {
        try {
          const kataURL = kataNameA.href.split('/');
          const kataIdIndex =
            kataURL.findIndex((element) => element === 'kata') + 1;
          const kataId = kataURL[kataIdIndex];

          const kataData = response.find(({ kata_id }) => kata_id === kataId);

          if (!kataData || !kataIds.includes(kataId)) {
            throw 'fail';
          }
          if (!kataData.translated_description) {
            throw 'working';
          }

          kataNameA.innerHTML = kataNameA.innerText;
          kataNameA.append(createStatus('success'));
        } catch (statusType) {
          if (['fail', 'working', 'error'].includes(statusType)) {
            kataNameA.innerHTML = kataNameA.innerText;
            kataNameA.append(createStatus(statusType));
          } else {
            console.error(statusType);
          }
        }
        kataNameA.setAttribute('checked', true);
      });
    })
    .catch((error) => console.error(error));

  statusUpdated = false;
}

function createStatus(statusType = 'error') {
  const span = document.createElement('span');

  // Default is 'Error'
  let emoji = '&#10060';
  let tooltipMessage = 'Um erro ocorreu ao obter o status desse kata!';

  switch (statusType) {
    case 'success':
      emoji = '&#128077';
      tooltipMessage = 'Esse kata tem tradução para português!';
      break;
    case 'working':
      emoji = '&#9881';
      tooltipMessage = 'Esse kata está sendo traduzido!';
      break;
    case 'fail':
      emoji = '&#128078';
      tooltipMessage = 'Sem tradução disponível para esse kata!';
      break;
  }

  tippy(span, {
    content: tooltipMessage,
    delay: [400, 0],
    theme: 'codewars',
    arrow: roundArrow,
  });

  span.innerHTML = emoji;
  span.classList.add('pill', statusType);

  return span;
}
