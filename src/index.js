import './index.html';
import './global.sass';
import Fuse from 'fuse.js';

const { stores } = require('./stores.json');
const container = document.querySelector('.am-stores-content-container');

const storeCardTemplate = element =>
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
    </div>`;

const storesByZonesTemplate = data => {
  let north = data.north || [];
  let central = data.central || [];
  let south = data.south || [];

  return `<div>
        ${
          north === undefined || north.length < 1
            ? ''
            : `<h2 class="am-store-zone-title">Zona Norte</h2>
              <div class="am-stores">
                ${north.map(item => storeCardTemplate(item)).join('')}
              </div>`
        }
        ${
          central !== undefined && central.length > 0
            ? `<h2 class="am-store-zone-title">Zona Central</h2>
              <div class="am-stores">
                ${central.map(item => storeCardTemplate(item)).join('')}
              </div>`
            : ''
        }
        ${
          south !== undefined && south.length > 0
            ? `<h2 class="am-store-zone-title">Zona Sur</h2>
              <div class="am-stores">
                ${south.map(item => storeCardTemplate(item)).join('')}
              </div>`
            : ''
        }
      </div>`;
};

const createZones = data => {
  const zonesObject = {
    north: [],
    central: [],
    south: [],
  };

  data.forEach(item => {
    const region = item.reg_num;

    if (region === 'RM' || (region >= 5 && region <= 7)) {
      zonesObject['central'].push(item);
    } else if (region >= 1 && region <= 4) {
      zonesObject['north'].push(item);
    } else {
      zonesObject['south'].push(item);
    }
  });

  return zonesObject;
};

const renderData = data => {
  container.innerHTML = '';
  container.insertAdjacentHTML('beforeend', storesByZonesTemplate(data));
};
renderData(createZones(stores));

const input = document.querySelector('.am-stores-search-input');
const fuseOptions = {
  shouldSort: true,
  tokenize: true,
  matchAllTokens: true,
  findAllMatches: true,
  threshold: 0.2,
  location: 3,
  distance: 50,
  maxPatternLength: 32,
  minMatchCharLength: 2,
  keys: ['address', 'name', 'region'],
};
const fuse = new Fuse(stores, fuseOptions);

input.addEventListener('input', e => {
  let searchValue = e.target.value;
  let response = fuse.search(searchValue);
  let filteredStores = createZones(response);

  if (searchValue === '') {
    renderData(createZones(stores));
  } else if (response.length <= 0) {
    container.innerHTML =
      '<h2><strong>No se encontró ningun resultado.</strong></h2>';
  } else {
    renderData(filteredStores);
  }
});
