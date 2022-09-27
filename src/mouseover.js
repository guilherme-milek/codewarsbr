export function mouseOverEventCallback(element, animation) {
  element.classList.add(animation);

  element.addEventListener('animationend', () => {
    element.classList.remove(animation);
  });
}
