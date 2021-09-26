const menuBtn = document.getElementById("menu");
const contactContainer = document.getElementById("contact-container");
const addContactBtn = document.getElementById("add-contact-btn");
const addContainer = document.getElementById("add-container");
const contactCancelBtn = document.getElementById("add-cancel-btn");
const sendBtn = document.getElementById("send-btn");
const yourId = document.getElementById("your-id");
const addBtn = document.getElementById("add-btn");

let url = window.location.host;

const id = yourId.value;

if (id !== "") {
  if (localStorage.your_app_id !== id) {
    localStorage.clear();
    localStorage.setItem(`${id}_contacts`, []);
    localStorage.setItem("your_app_id", id);
  }
}

const userId = localStorage.your_app_id;
const contactsId = `${userId}_contacts`;

see();

const socket = io(url, { query: { id: userId } });

menuBtn.onclick = () => {
  contactContainer.classList.toggle("show");
};

addContactBtn.onclick = () => {
  addContainer.classList.add("show-add-modal");
};

contactCancelBtn.onclick = () => {
  closeModal();
};

sendBtn.addEventListener("click", () => {
  const newMessage = document.getElementById("new-mesg");
  const message = newMessage.value;
  if (message !== "") {
    if (localStorage.getItem("active")) {
      const room = localStorage.getItem("active");
      socket.emit("send_message", message, room);
      const classNameColorSend = "text-msg-wrapper-sended";
      const classNameFlex = "message-bubble-sended";
      addMessage(message, classNameColorSend, "you", classNameFlex);
    }
  }
  newMessage.value = "";
});

socket.on("receive_message", (msg, Name) => {
  const classNameColorReceive = "text-msg-wrapper-received";
  addMessage(msg, classNameColorReceive, Name);
});

function addMessage(msg, classNameColor, Name, classNameFlex) {
  const msgRoot = document.getElementById("add-message");
  const messageBubble = document.createElement("div");
  messageBubble.classList.add("message-bubble", classNameFlex);

  const textMsgWrapper = document.createElement("div");
  textMsgWrapper.classList.add("text-msg-wrapper", classNameColor);

  const textMessage = document.createElement("p");
  textMessage.classList.add("text-message");
  textMessage.innerHTML = msg;

  const senderName = document.createElement("span");
  senderName.classList.add("sender-name");
  senderName.innerHTML = Name;

  textMsgWrapper.appendChild(textMessage);
  textMsgWrapper.appendChild(senderName);
  messageBubble.appendChild(textMsgWrapper);
  msgRoot.appendChild(messageBubble);
  window.scrollTo(
    0,
    document.querySelector(".message-bubble-container").scrollHeight
  );
}

addBtn.addEventListener("click", () => {
  const newContact = document.getElementById("user-name");
  if (localStorage.getItem(contactsId)) {
    let getNewContact = newContact.value;
    const allContacts = JSON.parse(localStorage.getItem(contactsId));
    var toLocalstorage = [...allContacts, { id: getNewContact }];
    localStorage.setItem(contactsId, JSON.stringify(toLocalstorage));
  } else {
    localStorage.setItem(contactsId, JSON.stringify([{ id: newContact }]));
  }
  closeModal();
  see();
  newContact.value = "";
});

function see() {
  if (localStorage.getItem(contactsId)) {
    document.getElementById("contacts-hist").innerHTML = "";
    const allMyContact = JSON.parse(localStorage.getItem(contactsId));
    contactBody(allMyContact);
  } else {
    document.getElementById("contacts-hist").innerHTML = "";
  }
}

function contactBody(allMyContact) {
  allMyContact.map((contact, index) => {
    const contactHistry = document.getElementById("contacts-hist");

    //contBodyContainer.setAttribute("key", index);
    const contBodyContainer = document.createElement("div");
    contBodyContainer.classList.add("cont-body-container");
    contBodyContainer.setAttribute("id", index);

    const userName = document.createElement("p");
    userName.classList.add("user-name-text");
    userName.innerHTML = contact.id;

    //const userUUID = document.createElement("span");
    //userUUID.classList.add("user-ID");
    //userUUID.innerHTML = uUUID;

    contBodyContainer.appendChild(userName);
    //contBodyContainer.appendChild(userUUID);
    contactHistry.appendChild(contBodyContainer);
  });
  const allContDiv = document.getElementsByClassName("cont-body-container");
  for (i = 0; i < allContDiv.length; ++i) {
    allContDiv[i].addEventListener("click", function (e) {
      const current = document.getElementsByClassName("active");
      if (current.length > 0) {
        current[0].className = current[0].classNameColor =
          "cont-body-container";
      }
      this.className += " active";
      localStorage.setItem("active", e.target.innerText);
    });
  }
}

function closeModal() {
  addContainer.classList.remove("show-add-modal");
}
