'use strict';

// let slides = ['/assets/maps.jpeg', '/assets/pins.jpeg', '/assets/vintageglobe.jpeg', '/assets/globe-background.jpeg'];
// let imageIndex = 0;

// setInterval(() => {
//   let background = $('body');
//   background.animate({opacity: 1}, 250);
//   background.css('background-image', `url('${slides[imageIndex]}')`);
//   setTimeout(() => {
//     background.animate({opacity: 0.95}, 250);
//   }, 2750);
//   imageIndex++;
//   if (imageIndex === slides.length) {imageIndex = 0;}
// }, 3000);


//show hide drop-downs based on region selection
$(document).ready(function() {
  $('select.subregion').hide();
  $('select.language').hide();
  $('#regionform').hide();
  $('select#region').on('change', function() {
    if ($(this).val() === 'africa') {
      $('select.subregion').hide();
      $('select#subregion-dummy').hide();
      $('select.language').hide();
      $('select#language-dummy').hide();
      $('select#subregion-africa').show();
      $('select#language-africa').show();
    }
    if ($(this).val() === 'americas') {
      $('select.subregion').hide();
      $('select#subregion-dummy').hide();
      $('select.language').hide();
      $('select#language-dummy').hide();
      $('select#subregion-americas').show();
      $('select#language-americas').show();
    }
    if ($(this).val() === 'asia') {
      $('select.subregion').hide();
      $('select#subregion-dummy').hide();
      $('select.language').hide();
      $('select#language-dummy').hide();
      $('select#subregion-asia').show();
      $('select#language-asia').show();
    }
    if ($(this).val() === 'europe') {
      $('select.subregion').hide();
      $('select#subregion-dummy').hide();
      $('select.language').hide();
      $('select#language-dummy').hide();
      $('select#subregion-europe').show();
      $('select#language-europe').show();
    }
    if ($(this).val() === 'oceania') {
      $('select.subregion').hide();
      $('select#subregion-dummy').hide();
      $('select.language').hide();
      $('select#language-dummy').hide();
      $('select#subregion-oceania').show();
      $('select#language-oceania').show();
    }
  });
});

// search option buttons toggle display of forms
$('#country_search').on('click', function() {
  $('#newsearch').show();
  $('#regionform').hide();
});

$('#region_search').on('click', function() {
  $('#newsearch').hide();
  $('#regionform').show();
});
