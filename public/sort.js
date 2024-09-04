let sortButtons = document.querySelectorAll('.sort');

sortButtons.forEach(button => {
  button.addEventListener('click', function() {
    const state = this.getAttribute('data-category');
    window.location.href = `/home?state=${encodeURIComponent(state)}`;
  });
});