const hamburguer = document.querySelector('.traillermenu');
const navMenu = document.querySelector('.mrnufilm');
 
hamburguer.addEventListener('click', () => {
    hamburguer.classList.toggle('active');
    navMenu.classList.toggle('active');
});