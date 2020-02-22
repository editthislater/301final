'use strict';

let slides = ['/assets/maps.jpeg', '/assets/pins.jpeg', '/assets/vintageglobe.jpeg', '/assets/globe-background.jpeg'];
let imageIndex = 0;

setInterval(() => {
  let background = $('body');
  background.animate({opacity: 1}, 250);
  background.css('background-image', `url('${slides[imageIndex]}')`);
  setTimeout(() => {
    background.animate({opacity: 0.95}, 250);
  }, 2750);
  imageIndex++;
  if (imageIndex === slides.length) {imageIndex = 0;}
}, 3000);

