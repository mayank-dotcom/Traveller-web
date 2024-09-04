const search = () => {
  const searchbox = document.getElementById("search_box").value.toUpperCase(); // Get the search value
  const products = document.querySelectorAll('#chitr'); // Select all elements with id 'chitr'
  const items = document.querySelectorAll('#h_ct'); // Select all elements with id 'h_ct'

  for (let i = 0; i < items.length; i++) {
      let match = items[i]; // Get the current h_ct element
      if (match) {
          let textvalue = match.textContent || match.innerHTML; // Get the text content
          if (textvalue.toUpperCase().indexOf(searchbox) > -1) { // Compare it with searchbox value
              products[i].style.display = ""; // Show the product if it matches
          } else {
              products[i].style.display = "none"; // Hide if it doesn't match
          }
      }
  }
}
