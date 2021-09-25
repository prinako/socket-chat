const socket = io();
const menuBtn = document.getElementById("menu");
const contactContainer = document.getElementById("contact-container");
const addContactBtn = document.getElementById("add-contact-btn");
const addContainer = document.getElementById("add-container");
const contactCancelBtn = document.getElementById("add-cancel-btn");
const sendBtn = document.getElementById("send-btn");


menuBtn.onclick = () => {
  contactContainer.classList.toggle("show");
};

addContactBtn.onclick = () => {
  addContainer.classList.add("show-add-modal");
};

contactCancelBtn.onclick = () => {
  addContainer.classList.remove("show-add-modal");
};

sendBtn.onclick = () => {
  const newMessage = document.getElementById("new-mesg");
  const message = newMessage.value;
  newMessage.value = "";
  console.log(message);
};
