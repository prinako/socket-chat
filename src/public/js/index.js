const menuBtn = document.getElementById("menu");
const contactContainer = document.getElementById("contact-container");
const addContactBtn = document.getElementById("add-contact-btn");
const addContainer = document.getElementById("add-container");
const contactCancelBtn = document.getElementById("add-cancel-btn");
const sendBtn = document.getElementById("send-btn");
const addBtn = document.getElementById("add-btn");
const callContainer = document.querySelector(".call-container");
const allMsg = document.querySelector(".all-msg");
const allGroups = document.querySelector(".all-groups");
const msgRoot = document.getElementById("add-message");
// ** LOG IN **
const loginDisplay = document.getElementById("login-display");
const loginForm = document.getElementById("login-form");
const yourId = document.getElementById("your-id");
const loginFormBtn = document.getElementById("login-form-btn");
//** NOTIFIY **
const notifiyErr = document.getElementById("notifiy-err");
const notifiyInfo = document.querySelector(".notifiy-info");
const notifiyErrContainer = document.getElementById("notifiy-err-container");

let url = window.location.host;

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const id = yourId.value;
  const your_app_id = `${id}your_app_id`;
  yourId.value = "";

  if (id !== "") {
    if (localStorage.getItem(your_app_id) !== id) {
      localStorage.setItem(`${id}_contacts`, []);
      localStorage.setItem(your_app_id, id);
      mainApp(your_app_id);
    } else {
      if (localStorage.getItem(your_app_id) == id) {
        mainApp(your_app_id);
      }
    }
    loginDisplay.classList.remove("show-login-display");
    notifiyErrContainer.classList.remove("notifiy-container");
  } else {
    notifiyErrContainer.classList.add("notifiy-container");
    notifiyErr.classList.add("notifiy-err-color-red");
    notifiyInfo.innerHTML =
      "Place choose User name Or if you already have an account user the same User name to connect";
  }
});

//**RUN AFTER USER NAME IS SET **/
function mainApp(your_app_id) {
  const userId = localStorage.getItem(your_app_id);
  const contactsId = `${userId}_contacts`;
  console.log(contactsId);

  see();

  const socket = io(url, { query: { id: userId } });

  allGroups.addEventListener("click", () => {
    allMsg.classList.remove("selected");
    allGroups.classList.add("selected");
  });

  allMsg.addEventListener("click", () => {
    allGroups.classList.remove("selected");
    allMsg.classList.add("selected");
  });

  menuBtn.onclick = () => {
    contactContainer.classList.add("show");
    menuBtn.classList.remove("show-menu");
    callContainer.classList.remove("show-call-container");
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
        addmessageToLocalStore(message, localStorage.active, "you");
        const classNameColorSend = "text-msg-wrapper-sended";
        const classNameFlex = "message-bubble-sended";
        addMessage(message, classNameColorSend, "you", classNameFlex);
      }
    }
    newMessage.value = "";
  });

  socket.on("receive_message", (msg, Name) => {
    if (localStorage.active == Name) {
      addmessageToLocalStore(msg, Name);
      const classNameColorReceive = "text-msg-wrapper-received";
      addMessage(msg, classNameColorReceive, Name);
    } else {
      addmessageToLocalStore(msg, Name);
    }
  });

  function addmessageToLocalStore(msg, Name, you) {
    const messagObj = { name: you ? "you" : Name, message: msg };

    const messageName = `${Name}_messages`;

    if (localStorage.getItem(messageName)) {
      const allMsg = JSON.parse(localStorage.getItem(messageName));
      const addNewMsg = JSON.stringify([...allMsg, messagObj]);
      localStorage.setItem(messageName, addNewMsg);
    } else {
      localStorage.setItem(messageName, JSON.stringify([messagObj]));
    }
  }

  function addMessage(msg, classNameColor, Name, classNameFlex) {
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
    let getNewContact = newContact.value;
    if (localStorage.getItem(contactsId)) {
      const allContacts = JSON.parse(localStorage.getItem(contactsId));
      var toLocalstorage = [...allContacts, { id: getNewContact }];
      localStorage.setItem(contactsId, JSON.stringify(toLocalstorage));
    } else {
      localStorage.setItem(contactsId, JSON.stringify([{ id: getNewContact }]));
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
        menuBtn.classList.add("show-menu");
        contactContainer.classList.remove("show");
        msgRoot.innerHTML = "";
        if (current.length > 0) {
          current[0].className = current[0].classNameColor =
            "cont-body-container";
        }
        this.className += " active";
        localStorage.setItem("active", e.target.innerText);
        const chatingWith = document.getElementById("chating-with-name");
        chatingWith.innerHTML = `chating with ${e.target.innerText} ...`;
        callContainer.classList.add("show-call-container");
        findAllMessage();
      });
    }
  }
  if (localStorage.active) {
    findAllMessage();
  }
  function findAllMessage() {
    if (localStorage.active) {
      const msgOfThisUser = `${localStorage.active}_messages`;

      if (localStorage.getItem(msgOfThisUser)) {
        const messages = JSON.parse(localStorage.getItem(msgOfThisUser));

        messages.map((msg) => {
          if (msg.name == localStorage.active) {
            const classNameColorReceive = "text-msg-wrapper-received";
            addMessage(msg.message, classNameColorReceive, msg.name);
          } else {
            const classNameColorSend = "text-msg-wrapper-sended";
            const classNameFlex = "message-bubble-sended";
            addMessage(
              msg.message,
              classNameColorSend,
              msg.name,
              classNameFlex
            );
          }
        });
      }
    }
  }
  function closeModal() {
    addContainer.classList.remove("show-add-modal");
  }
}
