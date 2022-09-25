import 'toastify-js/src/toastify.css';
import Toastify from 'toastify-js';

import './contentScript.css';

import { updateKataStatusFromList } from './dashboard.js';
import { translateKatas } from './translate.js';
import {
  allNonCheckedKatasDivSelector,
  kataDivsSelector,
  kataNameAsSelector,
  kataDescriptionDivSelector,
} from './selectors.js';
import { translated, statusUpdated } from './controllers.js';

// DETECT URL changes on the website.
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;

  if (url !== lastUrl) {
    lastUrl = url;

    window.location.reload(true);
  }
}).observe(document, { childList: true, subtree: true });

const allNonCheckedKatasDiv = document.querySelector(
  allNonCheckedKatasDivSelector
);
let kataDivNodeList = document.querySelectorAll(kataDivsSelector);
let kataNameANodeList = document.querySelectorAll(kataNameAsSelector);

const kataDescriptionDiv = document.querySelector(kataDescriptionDivSelector);

const toastConfig = {
  duration: 2500,
  close: false,
  gravity: 'top', // `top` or `bottom`
  position: 'center', // `left`, `center` or `right`
  stopOnFocus: true, // Prevents dismissing of toast on hover
  className: 'toast',
  style: {
    background: '#6795de',
  },
};

if (!!allNonCheckedKatasDiv && !!kataNameANodeList.length) {
  checkStatusObserver();

  new MutationObserver(async () => {
    return await checkStatusObserver();
  }).observe(allNonCheckedKatasDiv, {
    childList: true,
    subtree: true,
  });
} else if (!!kataDescriptionDiv) {
  translateKataObserver();

  new MutationObserver(async () => {
    return await translateKataObserver();
  }).observe(kataDescriptionDiv, {
    childList: true,
  });
}

async function translateKataObserver() {
  if (
    !translated &&
    kataDescriptionDiv.innerText !== 'Loading description...'
  ) {
    Toastify({
      ...toastConfig,
      text: 'Obtendo informações da tradução...',
    }).showToast();

    translated = true;

    await translateKatas(kataDescriptionDiv);
  }
}

const kataDivNodeListGetter = () => {
  kataDivNodeList = document.querySelectorAll(kataDivsSelector);
};
const kataNameANodeListGetter = () => {
  kataNameANodeList = document.querySelectorAll(kataNameAsSelector);
};

async function checkStatusObserver() {
  kataDivNodeListGetter();
  kataNameANodeListGetter();

  if (!statusUpdated && !!kataNameANodeList.length) {
    Toastify({
      ...toastConfig,
      text: 'Obtendo informações das traduções...',
    }).showToast();

    statusUpdated = true;

    await updateKataStatusFromList(kataDivNodeList, kataNameANodeList);
  }
}
