// ! Global constants
// *  General
const root = document.documentElement;
const rootStyles = getComputedStyle(root);
const mobile = /Mobi|Android/i.test(navigator.userAgent);
// *  HTML elements by ID
const gridContainer = document.getElementById("grid");
const pageContainer = document.getElementById("page-container");
// *  Grid
const bgColour = rootStyles.getPropertyValue('--bg-colour');
const gridW = parseInt(rootStyles.getPropertyValue('--grid-w'));
const gridH = parseInt(rootStyles.getPropertyValue('--grid-h'));
// *  Footer and header
const defaultMargin = rootStyles.getPropertyValue('--hf-margin');
const defaultColour = rootStyles.getPropertyValue('--hf-colour');
const defaultSize = rootStyles.getPropertyValue('--hf-size');
// *  Pages
const homePageColour = 'bisque';
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
   const sound = new Audio('audio/bubble click.wav');
   sound.volume = 0.5;
   sound.play();
}

function hoverSound() {
   const sound = new Audio('audio/pop.mp3');
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
   // * Updates the styling of the footer by changing its CSS variables
   document.documentElement.style.setProperty('--hf-colour', colour);
   if (preview) {
      document.documentElement.style.setProperty('--hf-margin', '6%');
      document.documentElement.style.setProperty('--hf-size', '90%');
   } else {
      document.documentElement.style.setProperty('--hf-margin', defaultMargin);
      document.documentElement.style.setProperty('--hf-size', defaultSize);
   }
}

function previewPage(page, colour, focusColour, preview=true) {
   // * Changes the class of a page to .preview
   try {
      if (preview) {
         page.classList.remove("hidden");
         page.classList.add('preview');
         updateHeaderFooter(colour, preview)
      } else {
         page.classList.add("hidden");
         page.classList.remove('preview');
         updateHeaderFooter(focusColour)
      }
   } catch (error) {
      console.log(`Page is not created yet`);
   }
}

function updateHighlight(colour) {
   var css = `::selection {color: ${bgColour}; background-color: ${colour};}`;
   head = document.head || document.getElementsByTagName('head')[0];
   style = document.createElement('style');

   style.type = 'text/css';
   if (style.styleSheet){
      // This is required for IE8 and below.
      style.styleSheet.cssText = css;
   } else {
      style.appendChild(document.createTextNode(css));
   }

   head.appendChild(style);
}

function focusPage(page, focusColour, focus=true) {
   // * Changes the class of a page to .focus
   if (focus) {
      // Change the classes and update hf
      page.classList.remove("preview");
      page.classList.remove("hidden");
      page.classList.add('focus');
      updateHeaderFooter(focusColour, false);

      // Update styles
      updateHighlight(focusColour);
      updateBgColour(focusColour);
   } else {
      homePage();  // Focus home page
      if (mobile) {
         // Do not preview the page when unclicked on mobile, simply hide it
         page.classList.add('hidden');
         updateHeaderFooter(defaultColour);
      } else {
         previewPage(page, focusColour, focusColour);
      }
      page.classList.remove('focus');
      // Focuses the main page
      mainPage.classList.add('focus');
      mainPage.classList.remove('hidden');
   }
}

function getContrastingGray(originalColor) {
   return bgColour;
}

function updateBgColour(focusColour) {
   // * Sets the BG to the most contrast of the focus colour
   root.style.setProperty('--bg-colour', getContrastingGray(focusColour));
}

function homePage() {
   // * Focus on the home page
   updateHighlight(homePageColour);  // Original highlight
   updateBgColour(homePageColour);
}

function gridItemsEvents(gridItem, page, pageColour) {
   // * Event listeners for each grid item
   focusColour = homePageColour;  // Initialize focus colour to home page colour
   // Clicks
   gridItem.addEventListener('click', function() {
      clickSound();
      if (!gridItem.classList.contains('clicked')) {
         // * If home
         if (page.classList.contains('home')) {
            location.reload();
         }


         // * CLICK targeted cube
         clearAllClickedCubes();
         hideAllPages();
         gridItem.classList.add('clicked');
         focusPage(page, pageColour);  // Focus on clicked page
         focusColour = pageColour;  // HF to matching page colour
         
      } else {
         // * UNCLICK targeted cube
         clearAllClickedCubes();
         focusPage(page, pageColour, false);  // Unfocus the current page
         focusColour = homePageColour;  // HF to home page colour
      }
   });

   // * Hover targeted cube
   gridItem.addEventListener('mouseenter', function() {
      if (!gridItem.classList.contains('clicked')) {
         previewPage(page, pageColour, focusColour);
         hoverSound();
      }
   });

   // * Hover ends targeted cube
   gridItem.addEventListener('mouseleave', function() {
      if (!gridItem.classList.contains('clicked')) {
         previewPage(page, pageColour, focusColour, false);
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
         let shade = 10;
         let ci = i + 2;
         let cj = j + 1;
         // 20, 9, 30
         let r = 20 * cj * ci;
         let g = 9 * cj * ci;
         let b = 30 * ci;
         const pageColour = `rgb(${r}, ${g}, ${b})`;
         gridItem.style.zIndex = -i+j;
         gridItem.style.backgroundColor = pageColour;
         gridItemTop.style.backgroundColor = `rgb(${r - shade}, ${g - shade}, ${b - shade})`;
         gridItemSide.style.backgroundColor = `rgb(${r + shade}, ${g + shade}, ${b + shade})`;
         text.style.color = 'black';
         try {
            page.style.color = pageColour;
         } catch (error) {
            console.log(`Page ${i}${j} is not created yet`);
         }

         // Set class
         gridItem.classList.add("grid-item");
         gridItemTop.classList.add("top-box");
         gridItemSide.classList.add("side-box");

         // * Add event listeners
         gridItemsEvents(gridItem, page, pageColour)

         // * Assign to parent
         gridItem.appendChild(gridItemTop);
         gridItem.appendChild(gridItemSide);
         // gridItem.appendChild(text);
         gridContainer.appendChild(gridItem);
      }
   }
}

function main() {
   // randomPages();
   createGridItems();
   updateHighlight(homePageColour);

}
main()