const menuBtn = document.getElementById("menu");
const contactContainer = document.getElementById("contact-container");

menuBtn.onclick = () => {
    contactContainer.classList.toggle('show')
};
