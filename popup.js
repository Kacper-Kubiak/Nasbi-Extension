'use strict'

let newBody = '';

const scriptCode =
  `(function() {
      let images = document.querySelectorAll('img');
      let srcArray =
           Array.from(images).map(function(image) {
             return image.currentSrc;
           });
      return srcArray
    })();`;

const getPage = 
`(function() {
      let x = document.getElementsByClassName("flowpaper_lblTotalPages flowpaper_tblabel");
      for (let i = 0; i < x.length; i++) {
        let strony = x[i].innerText;
        return strony.substring(1);
      }
    })();`;

const clearBody = 
  `(function() {
      document.head.innerHTML = '<style>img { width: 210mm; height: 297mm; }</style>';      
      document.body.innerHTML = '';
    })();`;

let imageDiv = document.getElementById('image_div');
function setUp(array) {
    for (let src of array) {
      let newImage = document.createElement('img');
      let lineBreak = document.createElement('br');
      newImage.src = src;
      console.log(newImage)
      if (newImage.src.match(/index.*/)) {
        chrome.tabs.executeScript({code: clearBody}, function(result) { });
        newBody = newImage.src;
        let newScript = createBody(newBody);
        chrome.tabs.executeScript({code: newScript}, function(result) { });
        break;
      }
    };
    alert("Poczekaj aż wczytają się wszystkie zdjęcia!\nNastępnie kliknij 'Ctrl + P' i zapisz jako PDF");
};

function createBody(page) {
  let pos = page.indexOf("page=");
  let newpage = page.substring(0, pos+5);
  let text = '';
  for (let i = 1; i <= numpage; i++) 
  { 
    text += '<img src="' + newpage + i + '">';
  }
  return `(function() {    
      document.body.innerHTML = '` + text + `';
    })();`;
}

let numpage = 0;
chrome.tabs.executeScript({code: getPage}, function(result) { numpage = result[0] });

chrome.tabs.executeScript({code: scriptCode}, function(result) {
  setUp(result[0]);
});
