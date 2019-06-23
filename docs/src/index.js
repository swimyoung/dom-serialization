import { serialize, deserialize } from '../../src/index';

window.addEventListener('DOMContentLoaded', () => {
  const [elemButtonGroup] = document.getElementsByClassName('btn-group');
  const [elemContent] = document.getElementsByClassName('content');

  elemButtonGroup.addEventListener('click', ({ target }) => {
    const action = target.getAttribute('data-action');
    action === 'serialize'
      ? (elemContent.textContent = serialize(elemContent))
      : (elemContent.innerHTML = deserialize(
          elemContent.textContent,
        ).innerHTML);
  });
});
