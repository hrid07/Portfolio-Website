
document.addEventListener('DOMContentLoaded', () => {
  const menuIcon = document.querySelector('#menu-icon');
  const nav = document.querySelector('nav');

  if (menuIcon && nav) {
    menuIcon.addEventListener('click', () => {
      nav.classList.toggle('active');
      menuIcon.classList.toggle('open');
    });
  }
});
