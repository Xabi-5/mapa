'use strict';
// import './css/style.css';
// import 'bootstrap/dist/css/bootstrap.min.css';

//Tonto se les esto

function onMapClick(e) {
  let popup = L.popup();
  popup.setLatLng(e.latlng).setContent(createForm(e.latlng)).openOn(map);
  const description = document.querySelector('#description');
  description.focus();
}
// const alameda = JSON.parse(localStorage.getItem('Alameda'));
// console.log(alameda);

function createForm(latlng) {
  const form = document.createElement('form');
  const input = document.createElement('input');
  form.innerHTML = '<label for="description">Descripción:</label><br><br>';
  input.type = Text;
  input.id = 'description';
  input.dataset.lat = latlng.lat.toFixed(6);
  input.dataset.lng = latlng.lng.toFixed(6);
  input.addEventListener('keypress', addPoint);
  form.append(input);
  return form;
}

function addPoint(e) {
  const target = e.target;

  if (e.key === 'Enter') {
    e.preventDefault();

    const pin = {
      description: target.value,
      lat: target.dataset.lat,
      lng: target.dataset.lng,
    };
    createMarker(pin);
    listMarker(pin);

    localStorage.setItem(pin.description, JSON.stringify(pin));
    map.closePopup();
  }
}

function createMarker(pin) {
  let marker = L.marker([pin.lat, pin.lng]).addTo(map);
  const div = document.createElement('div');
  div.classList.add('text-center');
  div.innerHTML =
    '<h4>' +
    pin.description +
    '</h4>' +
    '<b>' +
    pin.lat +
    ' , ' +
    pin.lng +
    '</b>' +
    '<br><br>';
  const btn = document.createElement('button');
  btn.innerText = 'Eliminar';
  btn.addEventListener('click', function () {
    map.removeLayer(tempMarker);
    tempMarker = null;
    localStorage.removeItem(pin.description);
    removeFromList(pin.description);
  });
  div.append(btn);
  marker.bindPopup(div);
  //   marker.bindTooltip(pin.description, {
  //     permanent: true,
  //     direction: 'right',
  //   });

  marker.on('popupopen', onPopUpOpen);

  markers.push({ description: pin.description, mark: marker });
}

function listMarker(pin) {
  const list = document.getElementById('markers');
  let div = document.createElement('ul');
  let p = document.createElement('li');
  p.innerText = pin.description;
  div.classList.add('list-group');
  p.classList.add('list-group-item');
  div.append(p);
  div.addEventListener('click', selectMarker);
  list.append(div);
}

const map = L.map('map', { center: [42.87876, -8.547238], zoom: 17 });
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

function onPopUpOpen() {
  tempMarker = this;
}

function removeFromList(nome) {
  const list = document.querySelector('#markers').children;
  for (let ul of list) {
    if (ul.firstElementChild.innerText === nome) {
      ul.remove();
    }
  }
}

function initialize() {
  var keys = Object.values(localStorage);
  let marcadores = [];
  for (let key of keys) {
    marcadores.push(JSON.parse(key));
  }
  for (let marcador of marcadores) {
    createMarker(marcador);
    listMarker(marcador);
  }
}

function selectMarker(e) {
  const target = e.target;
  console.log(target);

  const value = target.innerText;

  for (let marker of markers) {
    if (marker.description === value) {
      const markerObject = marker.mark;
      map.setView(markerObject.getLatLng(), 10);
      markerObject.openPopup();
    }
  }
}

async function testApi() {
  let datos = await fetch(
    'https://my-server.tld/v1/ecmwf?latitude=52.52&longitude=13.41&hourly=temperature_2m'
  );
  console.log(await datos);

  //   let promises = [];
  //   for (let nome of arrayNomes) {
  //     promises.push(
  //       await octokit.request('GET /users/{username}', {
  //         username: nome,
  //         headers: {
  //           'X-GitHub-Api-Version': '2022-11-28',
  //         },
  //       })
  //     );
  //     console.log(await Promise.all(promises));
  //   }
}

map.on('click', onMapClick);

testApi();

const markers = [];

let tempMarker = null;
initialize();
console.log(markers);
