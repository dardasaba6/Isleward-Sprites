// ==UserScript==
// @name         Crimson Seas for Isleward
// @version      1.0
// @description  Changes all water in the game to blood + plus some extra things like blood fish
// @author       Base addon by Hazel, variant by Dardasaba
// @match        *://play.isleward.com/*
// @match        *://ptr.isleward.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

/// DISCLAIMER: This addon was modified by Dardasaba with the Crimson Seas sprites, but the base addon with 99% of the stuff here was made by Hazel!

window.texturepackOverrides = {
  'images/tiles.png': 'https://raw.githubusercontent.com/dardasaba6/Isleward-Sprites/main/Crimson%20Seas/WaterToBloodNewNew.png', //Blood water
  'server/mods/iwd-fjolgard/images/tiles.png': 'https://raw.githubusercontent.com/dardasaba6/Isleward-Sprites/main/Crimson%20Seas/WaterToBloodTownNew.png', //Blood water part 2
  'images/bigObjects.png': 'https://raw.githubusercontent.com/dardasaba6/Isleward-Sprites/main/Crimson%20Seas/BloodSewage.png', //Blood sewage
  'images/walls.png': 'https://raw.githubusercontent.com/dardasaba6/Isleward-Sprites/main/Crimson%20Seas/BloodWalls.png', //Blood sewer walls
  'images/materials.png': 'https://raw.githubusercontent.com/dardasaba6/Isleward-Sprites/main/Crimson%20Seas/BloodFish.png', //Blood fish
}

// Set to `true` to get a list of possible keys for `texturepackOverrides` used by the renderer.
// Images used in the UI won't be listed here (items, ability icons, portraits, etc).
window.texturepackDebug = false;

/// IMPLEMENTATION

// The URL to replace Isleward's `src/client/js/resources.js` with. It should have the `.js` extension removed since requirejs will append one.
//
// The CORS issue described above also applies here.
// This time we can't use the GitLab API workaround because we will end up requesting `raw.js` (because of requirejs behavior mentioned above).
// Instead we are using raw.githack.com to proxy the file. Githack didn't seem to work for me for images but seems to work for the script which is strange.
//
// By default, this is pointing to a specific revision to improve security.
// If you're concerned about dynamically loading untrusted code, you can review the code and host your own copy of the file somewhere else.
const RESOURCES_JS_URL = 'https://gl.githack.com/Isleward-Modding/addons/texturepack/-/raw/556bd5562ed96e632dfad25e1c0136583e0e0d07/resources';

// Configure requirejs to replace `resources.js` with our modified version in order to override the images loaded by the renderer.
// You should see a console log if this works.
// If you don't, this userscript might be running too late, so the original script has already loaded.
// In that case, you can try replacing `https://play.isleward.com/js/resources.js` using a different method.
// A browser extension like Requestly or a program like Fiddler might work.
if (typeof require !== 'undefined') {
  require.config({ paths: { 'js/resources': RESOURCES_JS_URL } });
} else {
  require = { paths: { 'js/resources': RESOURCES_JS_URL } };
}

// Checks inline styles on `target` and replaces the background image URL if it matches a configured override.
const overrideStyle = (target) => {
  if (target.style['background-image']) {
    const imageUrl = target.style['background-image'].trim().slice(5, -2).replace("../../../", "");
    if (window.texturepackOverrides[imageUrl]) {
      target.style['background-image'] = 'url("' + window.texturepackOverrides[imageUrl] + '")';
    }
  }
}

// Sets up MutationObservers for replacing UI images.
const trySetup = () => {
  // Wait for the ui-container div to exist so we can observe it
  const uiContainer = document.getElementsByClassName('ui-container')[0];
  if (!uiContainer) {
    setTimeout(() => trySetup(), 100);
    return;
  }

  // Create a MutationObserver that calls overrideStyle when a style attribute changes in uiContainer's subtree
  const styleObserver = new MutationObserver((records) => {
    records.forEach((record) => {
      overrideStyle(record.target);
    });
  });
  styleObserver.observe(uiContainer, { subtree: true, attributes: true, attributeFilter: ['style'] });

  // Create a MutationObserver that calls overrideStyle when a node is added to uiContainer's subtree
  const addedObserver = new MutationObserver((records) => {
    records.forEach((record) => {
      record.addedNodes.forEach((node) => {
        if (node.style) {
          setTimeout(() => overrideStyle(node), 0);
        }
      });
    });
  });
  addedObserver.observe(uiContainer, { subtree: true, childList: true });
}
trySetup();

