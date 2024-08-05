// ==UserScript==
// @name         Names of Blood
// @namespace    Isleward.Addon
// @version      1.0.0
// @description  Updates some object's names to blood related things
// @author       Siege, modified by dardasaba for the Crimson Seas retexture
// @match        https://play.isleward.com/*
// @match        https://ptr.isleward.com/*
// @grant        none
// ==/UserScript==

function defer(method) {
    if (window.jQuery) {
        method();
    } else {
        setTimeout(function() { defer(method) }, 50);
    }
}

function generateRandomString(length, characters) {
    const shuffledCharacters = characters.split('').sort(() => Math.random() - 0.5);
    let result = '';
    for (let i = 0; i < length; i++) {
        result += shuffledCharacters[i];
    }
    return result;
}

let herm_name = generateRandomString(6, 'hermit');
let vik_name = generateRandomString(5, 'vikar');

defer(function() {
    addons.register({
        init: function(events) {
            events.on('onGetObject', this.onGetObject.bind(this));
        },
        onGetObject: function(obj) {
            if (!obj || !obj.components) {
                return;
            }
          if (obj.name == "well") {
                obj.name = 'Blood Well';
            }
          if (obj.name == "Sun Carp") {
                obj.name = 'Blood Carp';
            }
          if (obj.name == "Stinktooth") {
                obj.name = 'Bloodtooth';
            }
        }
    });
});
