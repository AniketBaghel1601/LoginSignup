let signbtn = document.getElementById("signbtn");

signbtn.addEventListener("click", (e) => {
  handleRegister();
});
const handleRegister = () => {
  fetch("https://coinsquare.onrender.com/user/register", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      name: document.getElementById("username").value,
      password: document.getElementById("pass").value,
      email: document.getElementById("email").value,
    }),
  }) // fetch yhn khtm
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      let reg = document.getElementById("reg");
      reg.textContent = "successful register";
    })
    .catch((err) => console.log(err));
};
let loginbtn = document.getElementById("loginbtn");

loginbtn.addEventListener("click", (e) => {
  handleLogin();
});

const handleLogin = () => {
  fetch("https://coinsquare.onrender.com/user/login", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      password: document.getElementById("passl").value,
      email: document.getElementById("emaill").value,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.access_token) {
        let logged = document.getElementById("logged");
        logged.textContent = "Log in Successful";
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("id", data.user._id);

        localStorage.setItem("money", data.user.balance);
        if (data.user.email) {
          localStorage.setItem("email", JSON.stringify(data.user.email));
        } else {
          console.error("Email not found in the user object:", data.user);
        }
        if (data.user.name) {
          localStorage.setItem("name", JSON.stringify(data.user.name));
        } else {
          console.error("Name not found in the user object:", data.user);
        }
        setTimeout(() => {
          window.location.href = "./userDashboard/dashboard.html";
        }, 0);
      } else {
        console.log("user is not reg");
        let error = document.getElementById("error-message")
        error.innerText = "Incorrect Credentials"
      }
    })
    .catch((err) => console.log(err));
};