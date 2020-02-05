function isIE() {
  var ua = navigator.userAgent;
  /* MSIE used to detect old browsers and Trident used to newer ones*/
  var is_ie = ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1;

  if (is_ie) {
    require("./polyfills/Promise.prototype.finally.js");
    require("./polyfills/Array.prototype.includes.js");
    require("./polyfills/Array.prototype.find.js");
    require("./polyfills/Object.prototype.assign.js");
  }
}

export default {
  isIE,
};