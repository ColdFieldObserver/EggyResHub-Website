function isOldBrowser() {
  var ua = window.navigator.userAgent;
  if (ua.indexOf('MSIE') > 0 || ua.indexOf('Trident') > 0) {
    return true;
  }

  var chromeMatch = ua.match(/(Chrome|Edg)\/(\d+)/);
  if (chromeMatch) {
    var majorVersion = parseInt(chromeMatch[2], 10);
    if (majorVersion < 105) {
      return true;
    }
  }

  var firefoxMatch = ua.match(/Firefox\/(\d+)/);
  if (firefoxMatch) {
    var ffVersion = parseInt(firefoxMatch[1], 10);
    if (ffVersion < 110) {
      return true;
    }
  }

  if (!chromeMatch && !firefoxMatch && ua.indexOf('Safari') > -1 && ua.indexOf('Version') > -1) {
    var safariMatch = ua.match(/Version\/(\d+)(?:\.(\d+))?/);
    if (safariMatch) {
      var safariMajor = parseInt(safariMatch[1], 10);
      var safariMinor = safariMatch[2] ? parseInt(safariMatch[2], 10) : 0;
      if (safariMajor < 15 || (safariMajor === 15 && safariMinor < 4)) {
        return true;
      }
    }
  }
}

if (isOldBrowser()) {
  window.location.replace('/_support/index.htm');
}