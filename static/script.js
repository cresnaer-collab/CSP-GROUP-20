document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.nav-links a');
  
  window.addEventListener('scroll', () => {
    let fromTop = window.scrollY + 100;
    navLinks.forEach(link => {
      let section = document.querySelector(link.hash);
      if (section && section.offsetTop <= fromTop && section.offsetTop + section.offsetHeight > fromTop) {
        link.style.color = '#B80F50';
      } else {
        link.style.color = '#63525A';
      }
    });
  });
});
