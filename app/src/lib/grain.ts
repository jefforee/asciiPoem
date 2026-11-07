const GRAIN =
  "<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'>" +
  "<filter id='n'>" +
  "<feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/>" +
  "<feColorMatrix values='0 0 0 0 .36 0 0 0 0 .26 0 0 0 0 .15 0 0 0 .2 0'/>" +
  "</filter>" +
  "<rect width='100%' height='100%' filter='url(#n)'/>" +
  "</svg>";

export function installGrain() {
  const url = `url("data:image/svg+xml,${encodeURIComponent(GRAIN)}")`;
  document.documentElement.style.setProperty("--grain", url);
}
