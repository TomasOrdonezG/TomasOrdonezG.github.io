// ! Global constants
// *  General
const root = document.documentElement;
const rootStyles = getComputedStyle(root);
const mobile = /Mobi|Android/i.test(navigator.userAgent);
// *  HTML elements by ID
const gridContainer = document.getElementById("grid");
const pageContainer = document.getElementById("page-container");
// *  Grid
const gridW = parseInt(rootStyles.getPropertyValue('--grid-w'));
const gridH = parseInt(rootStyles.getPropertyValue('--grid-h'));
// *  Footer and header
const defaultMargin = rootStyles.getPropertyValue('--hf-margin');
const defaultColour = rootStyles.getPropertyValue('--hf-colour');
const defaultSize = rootStyles.getPropertyValue('--hf-size');
// *  Pages
const mainPage = document.getElementById('main-page');

function randomPages() {
   // * Creates random pages for HTML
   const lorem = 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Neque quas optio unde adipisci doloremque natus exercitationem reiciendis quia porro consectetur? Est impedit officia deserunt consequatur molestiae nam libero itaque doloremque.'
   for (let i = 1; i <= gridH; i++) {
      for (let j = 1; j <= gridW; j++) {
         const div = document.createElement('div');
         div.id = `${i}${j}`;
         div.classList.add('pages');
         div.classList.add('hidden');

         const text = document.createElement('p');
         text.textContent = lorem;
         text.classList.add('description');

         const h2 = document.createElement('h2');
         h2.textContent = "LOREM IPSUM";
         h2.classList.add('title');

         div.appendChild(h2);
         div.appendChild(text);
         pageContainer.appendChild(div);
      }
   }
}

function clickSound() {
   const sound = new Audio('audio/typewriter soft.wav');
   sound.volume = 0.5;
   sound.play();
}

function hoverSound() {
   const sound = new Audio('audio/bubble click.wav');
   sound.volume = 0.1;
   sound.play();
}

function clearAllClickedCubes() {
   // * Removes the clicked class from all cubes
   const gridItems = document.querySelectorAll(".grid-item");
   gridItems.forEach(function(gridItem) {
      gridItem.classList.remove("clicked");
   });
}

function hideAllPages() {
   // * Removes the focus class from all pages and hides them
   const pages = document.querySelectorAll(".focus");
   pages.forEach(function(page) {
      page.classList.remove("focus");
      page.classList.add("hidden");
   });
}

function updateHeaderFooter(colour, preview=false) {
   // * U[dates the styling of the footer by changing its CSS variables
   document.documentElement.style.setProperty('--hf-colour', colour);
   if (preview) {
      document.documentElement.style.setProperty('--hf-margin', '6%');
      document.documentElement.style.setProperty('--hf-size', '90%');
   } else {
      document.documentElement.style.setProperty('--hf-margin', defaultMargin);
      document.documentElement.style.setProperty('--hf-size', defaultSize);
   }
}

function previewPage(page, colour, preview=true) {
   // * Changes the class of a page to .preview
   try {
      if (preview) {
         page.classList.remove("hidden");
         page.classList.add('preview');
         updateHeaderFooter(colour, preview)
      } else {
         page.classList.add("hidden");
         page.classList.remove('preview');
         updateHeaderFooter(defaultColour)
      }
   } catch (error) {
      console.log(`Page is not created yet`);
   }
}

function focusPage(page, colour, click=true) {
   // * Changes the class of a page to .focus
   try {
      if (click) {
         page.classList.remove("preview");
         page.classList.remove("hidden");
         page.classList.add('focus');
         updateHeaderFooter(colour, false);
      } else {
         if (mobile) {
            // Do not preview the page when unclicked on mobile, simply hide it
            page.classList.add('hidden');
            updateHeaderFooter(defaultColour);
         } else {
            previewPage(page, colour);
         }
         page.classList.remove('focus');
         // Focuses the main page
         mainPage.classList.add('focus');
         mainPage.classList.remove('hidden');
      }
   } catch (error) {
      console.log(error.message);
   }
}

function gridItemsEvents(gridItem, page, mainColour) {
   // * Event listeners for each grid item
   // Click
   gridItem.addEventListener('click', function() {
      clickSound();
      if (!gridItem.classList.contains('clicked')) {
         // * CLICK
         clearAllClickedCubes();
         hideAllPages();
         gridItem.classList.add('clicked');
         focusPage(page, mainColour)
         
      } else {
         // * UNCLICK
         clearAllClickedCubes();
         gridItem.classList.remove('clicked');
         focusPage(page, mainColour, false)
      }
      console.log(document.querySelectorAll('.focus').length);
   });

   // Hover
   gridItem.addEventListener('mouseenter', function() {
      if (!gridItem.classList.contains('clicked')) {
         previewPage(page, mainColour);
         hoverSound();
      }
   });

   // Hover ends
   gridItem.addEventListener('mouseleave', function() {
      if (!gridItem.classList.contains('clicked')) {
         previewPage(page, mainColour, false);
      }
   });
}

function createGridItems() {
   // Create grid items
   for (let i = 1; i <= gridH; i++) {
      for (let j = 1; j <= gridW; j++) {
         // Create initial div elements
         const gridItem = document.createElement("div");
         const gridItemTop = document.createElement("div");
         const gridItemSide = document.createElement("div");
         const text = document.createElement("p");
         text.textContent = "About";
         
         // Set ID
         gridItem.id = `${i}${j}`;
         const page = document.getElementById(`${i}${j}`);

         // * Style
         // Set a background colour to the cells
         // 15, 10, 30
         let shade = 10;
         let ci = i + 2;
         let cj = j + 1;
         let r = 20 * cj * ci;
         let g = 9 * cj * ci;
         let b = 30 * ci;
         const mainColour = `rgb(${r}, ${g}, ${b})`;
         gridItem.style.zIndex = -i+j;
         gridItem.style.backgroundColor = mainColour;
         gridItemTop.style.backgroundColor = `rgb(${r - shade}, ${g - shade}, ${b - shade})`;
         gridItemSide.style.backgroundColor = `rgb(${r + shade}, ${g + shade}, ${b + shade})`;
         text.style.color = 'black';
         try {
            page.style.color = mainColour;
         } catch (error) {
            console.log(`Page ${i}${j} is not created yet`);
         }

         // Set class
         gridItem.classList.add("grid-item");
         gridItemTop.classList.add("top-box");
         gridItemSide.classList.add("side-box");

         // * Add event listeners
         gridItemsEvents(gridItem, page, mainColour)

         // * Assign to parent
         gridItem.appendChild(gridItemTop);
         gridItem.appendChild(gridItemSide);
         // gridItem.appendChild(text);
         gridContainer.appendChild(gridItem);
      }
   }
}

function main() {
   randomPages();
   createGridItems();
}
main()