import 'toastify-js/src/toastify.css';
import Toastify from 'toastify-js';

import 'animate.css';
import tippy, { roundArrow } from 'tippy.js';

import { BASE_URL, API_KEY } from './env.js';
import { mouseOverEventCallback } from './mouseover.js';
import { statusUpdated } from './controllers.js';
import {
  toastErrorConfig,
  toastInfoConfig,
  toastSuccessConfig,
} from './toast.js';

import './tooltip.css'; // Tooltip theme (for Tippy)

export async function updateKataStatusFromList(
  kataNameANodeList,
  kataDivNodeList
) {
  const infoToast = Toastify({
    ...toastInfoConfig,
    text: 'Obtendo status das traduções...',
  });
  infoToast.showToast();

  try {
    const kataIds = [...kataNameANodeList].map(({ href }) => {
      const kataURL = href.split('/');
      const kataIdIndex =
        kataURL.findIndex((element) => element === 'kata') + 1;
      return kataURL[kataIdIndex];
    });

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
          const kataURL = kataNameA.href.split('/');
          const kataIdIndex =
            kataURL.findIndex((element) => element === 'kata') + 1;
          const kataId = kataURL[kataIdIndex];

          const kataData = response.find(({ kata_id }) => kata_id === kataId);

          kataNameA.setAttribute('checked', true);
          kataNameA.innerHTML = kataNameA.innerText;

          if (!kataData || !kataIds.includes(kataId)) {
            return kataNameA.append(createStatus('fail'));
          }
          if (!kataData.translated_description) {
            return kataNameA.append(createStatus('working'));
          }

          kataNameA.append(createStatus('success'));
        });
      })
      .catch((error) => {
        throw new Error(error);
      });

    infoToast.hideToast();

    Toastify({
      ...toastSuccessConfig,
      text: 'Status das traduções obtidos com sucesso!',
    }).showToast();

    statusUpdated = false;
  } catch (error) {
    infoToast.hideToast();

    Toastify({
      ...toastErrorConfig,
      text: error,
    }).showToast();

    console.error(error);
  }
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
  span.classList.add(
    'pill',
    statusType,
    'animate__animated',
    'animate__jackInTheBox'
  );

  span.addEventListener('animationend', () => {
    span.classList.remove('animate__jackInTheBox');

    span.addEventListener('mouseover', () =>
      mouseOverEventCallback(span, 'animate__rubberBand')
    );
  });

  return span;
}
