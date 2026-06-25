// Close mobile menu when a nav link is clicked
document.querySelectorAll('#mobile-menu a').forEach(function (link) {
  link.addEventListener('click', function () {
    document.getElementById('mobile-menu').classList.add('hidden');
  });
});
