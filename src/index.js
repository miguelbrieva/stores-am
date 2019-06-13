import './index.html';
import './global.sass';
import Fuse from 'fuse.js';

const { stores } = require('./stores.json');
const container = document.querySelector('.am-stores');

const options = {
  tokenize: true,
  matchAllTokens: true,
  findAllMatches: true,
  threshold: 0.2,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 2,
  keys: ['address', 'name'],
};

const render = data => {
  data.forEach(element => {
    container.insertAdjacentHTML(
      'beforeend',
      `<div class="am-store-box">
        <h3>Audiomusica ${element.name}</h3>
        <div class="am-store-section">
          <p>Dirección:</p>
          <p>${element.address}</p>
        </div>
        <div class="am-store-section am-store-section-phone">
          <p>Teléfono/s:</p>
          <div>
            ${element.phone
              .map(item => {
                return `<p>${item}</p>`;
              })
              .join('')}
          </div>
        </div>
        <div class="am-store-section">
          <p>Horario:</p>
          ${element.hours
            .map(item => {
              return `<p>${item}</p>`;
            })
            .join('')}
        </div>
      <div>`
    );
  });
};

render(stores);

const fuse = new Fuse(stores, options);
// const result = fuse.search('');
const input = document.querySelector('.am-stores-search-input');

input.addEventListener('input', e => {
  container.innerHTML = '';
  let searchValue = e.target.value;
  let response = fuse.search(searchValue);

  if (!searchValue) {
    render(stores);
  }

  if (searchValue && response.length <= 0) {
    container.innerHTML = '<h2>No se encontró ningun resultado.</h2>';
  } else {
    render(fuse.search(searchValue));
  }
});
