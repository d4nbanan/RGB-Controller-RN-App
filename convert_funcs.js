function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}
function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
function hsv2rgb(h, s, v){
  const f = (n,k=(n+h/60)%6) => v - v*s*Math.max( Math.min(k,4-k,1), 0);
  return [f(5)*255,f(3)*255,f(1)*255];
}

export {hsv2rgb, componentToHex, rgbToHex};