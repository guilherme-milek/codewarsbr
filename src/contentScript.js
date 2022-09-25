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
    statusUpdated = true;

    await updateKataStatusFromList(kataDivNodeList, kataNameANodeList);
  }
}
