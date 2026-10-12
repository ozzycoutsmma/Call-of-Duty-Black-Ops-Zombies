export const BASE = new URL('./', import.meta.url).pathname;

export const MAP_LIST = [
  { zone: 'zombie_pentagon', slug: 'five', name: 'Five', horde: true },
  { zone: 'zombie_theater', slug: 'kino', name: 'Kino der Toten', horde: true, engineS: 20 },
  { zone: 'zombie_cod5_factory', slug: 'riese', name: 'Der Riese', horde: true },
  { zone: 'zombie_cod5_prototype', slug: 'nacht', name: 'Nacht der Untoten', horde: true },
  { zone: 'zombie_cod5_asylum', slug: 'verruckt', name: 'Verrückt', horde: true },
  { zone: 'zombie_cod5_sumpf', slug: 'shinonuma', name: 'Shi No Numa', horde: true },
  { zone: 'zombie_cosmodrome', slug: 'ascension', name: 'Ascension' },
  { zone: 'zombie_coast', slug: 'cotd', name: 'Call of the Dead' },
  { zone: 'zombie_temple', slug: 'shangrila', name: 'Shangri-La' },
  { zone: 'zombie_moon', slug: 'moon', name: 'Moon' },
];
const FIRST = 'zombie_pentagon';
export const MAPS = Object.fromEntries(MAP_LIST.map(m => [m.zone, { ...m,
  root: m.zone === FIRST ? BASE : BASE + m.slug + '/', opfs: m.zone === FIRST ? 'pack' : 'pack-' + m.slug,
  programs: BASE + 'artifacts/' + m.slug + '-programs.json', art: BASE + 'art/loadscreen_' + m.zone + '.webp',
  settings: m.slug + '-settings' }]));
const requested = globalThis.document?.documentElement?.dataset.map ??
  new URLSearchParams(globalThis.location?.search ?? '').get('map');
export const mapId = Object.hasOwn(MAPS, requested ?? '') ? requested : FIRST;
export const map = MAPS[mapId];

const query = new URLSearchParams(globalThis.location?.search ?? '');
const requestedMode = globalThis.document?.documentElement?.dataset.mode ?? query.get('mode') ??
  (query.get('horde') === '1' ? 'horde' : null);
export const horde = requestedMode === 'horde' && !!map.horde;
export const packBase = map.root + 'pack/';
export const manifestUrl = horde ? packBase + 'web-manifest-horde.json' : map.root + 'manifest.json';

export const PACK_ORIGIN = 'https://cdn.vel.gg';
const PACK_ORIGIN_FOR = 'https://vel.gg';
const loopback = ['127.0.0.1', 'localhost', '[::1]'].includes(globalThis.location?.hostname);
const packOrigin = query.get('packOrigin') === '0' ? ''
  : loopback ? query.get('packOrigin') || ''
  : globalThis.location?.origin === PACK_ORIGIN_FOR ? PACK_ORIGIN : '';

export const packCdn = map.slug === 'kino' 
  ? 'https://corsproxy.io/?https://github.com/ozzycoutsmma/Call-of-Duty-Black-Ops-Zombies/releases/download/v7.0/' 
  : (packOrigin ? packOrigin.replace(/\/+$/, '') + '/packs/' + map.slug + '/' : '');

export const opfsRoot = '/opfs/' + map.opfs + '/files';

export const workerUrl = url => {
  const query = [mapId === FIRST ? '' : 'map=' + mapId, horde ? 'mode=horde' : '',
    packOrigin !== PACK_ORIGIN ? 'packOrigin=' + encodeURIComponent(packOrigin || '0') : ''].filter(Boolean).join('&');
  return query ? url + '?' + query : url;
};
