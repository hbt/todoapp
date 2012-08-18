// TODO(hbt): test on both firefox + chrome
function clickElement(elem, opt) {
  opt = opt || {};
  var new_tab = opt['meta'] || opt['ctrl'];

  // Define method length, then we thought it is an Array
  if (elem.length) {
    for (var i = 0; i < elem.length; i++) {
      if (i > 0) opt['ctrl'] = true;
      clickElement(elem[i], opt);
    }
    return;
  }

  var old_target = null;

  if (!new_tab) {
    old_target = elem.getAttribute('target');
    elem.removeAttribute('target');
  }

  var event = document.createEvent("MouseEvents");
  event.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, !! opt.ctrl, !! opt.alt, !! opt.shift, !! opt.meta, 0, null);
  elem.dispatchEvent(event);

  if (old_target) elem.setAttribute('target', old_target);
}

// click login link
function googleLogin()
{
    clickElement(document.getElementsByClassName('googleLogin')[0])
    // Note(hbt): doesn't seem to be working. find out why
    //$('.googleLogin').trigger('click')
}


function loginUser(url)
{
    // redirect to main app with googleLogin
    window.location.href = url
}