export const toastDefaultConfig = {
  duration: 3000,
  stopOnFocus: true, // Prevents dismissing of toast on hover
  close: false,
  gravity: 'top', // `top` or `bottom`
  position: 'center', // `left`, `center` or `right`
  stopOnFocus: true, // Prevents dismissing of toast on hover
};

export const toastInfoConfig = {
  ...toastDefaultConfig,
  duration: -1,
  stopOnFocus: false, // Prevents dismissing of toast on hover
  className: 'toast info',
};

export const toastErrorConfig = {
  ...toastDefaultConfig,
  className: 'toast error',
};

export const toastSuccessConfig = {
  ...toastDefaultConfig,
  className: 'toast success',
};
