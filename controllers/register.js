let username = document.querySelector("#name");
let email = document.querySelector("#email");
let password = document.querySelector("#password");
let confirmPassword = document.querySelector("#password-confirm");
let phone = document.querySelector("#phone");
let form = document.querySelector("form");

function showError(input, message) {
  let parent = input.parentElement;
  let small = parent.querySelector("small");
  parent.classList.add("error");
  small.innerText = message;
}
function showSuccess(input) {
  let parent = input.parentElement;
  let small = parent.querySelector("small");
  parent.classList.remove("error");
  small.innerText = "";
}

function checkEmailError(input) {
  const regexEmail =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  input.value = input.value.trim();

  let isEmailError = !regexEmail.test(input.value);
  if (regexEmail.test(input.value)) {
    showSuccess(input);
  } else {
    showError(input, "Email Invalid");
  }
  return isEmailError;
}

function checkPassword(input) {
  const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
  input.value = input.value.trim();
  let isPasswordError = !regexPassword.test(input.value);
  if (regexPassword.test(input.value)) {
    showSuccess(input);
  } else {
    showError(
      input,
      " Mật khẩu bao gồm ít nhất một số và bao gồm cả chữ thường và chữ in hoa và ký tự đặc biệt"
    );
  }
  return isPasswordError;
}
function checkLengthError(input, min, max) {
  input.value = input.value.trim();

  if (input.value.length < min) {
    showError(input, `Phải có ít nhất ${min} ký tự`);
    return true;
  }
  if (input.value.length > max) {
    showError(input, `Không được vượt quá ${max} ký tự`);
    return true;
  }

  return false;
}

function checkMathchPasswordError(passWordInput, cfPasswordInput) {
  if (passWordInput.value !== cfPasswordInput.value) {
    showError(cfPasswordInput, "Mật khẩu không trùng khớp");
    return true;
  }
  showSuccess(cfPasswordInput, "");
  return false;
}

function checkPhoneError(input) {
  const regexPhone = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
  input.value = input.value.trim();

  let isPhoneError = !regexPhone.test(input.value);
  if (regexPhone.test(input.value)) {
    showSuccess(input);
  } else {
    showError(input, "Phone Invalid");
  }
  return isPhoneError;
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  let isEmailError = checkEmailError(email);
  let isPasswordLengthError = checkLengthError(password, 6, 12);
  let isPasswordError = checkPassword(password);
  let isCheckMathError = checkMathchPasswordError(password, confirmPassword);
  let isNameLengthError = checkLengthError(username, 3, 30);
  let isCheckPhoneError = checkPhoneError(phone);

  if (
    isEmailError ||
    isNameLengthError ||
    isPasswordLengthError ||
    isPasswordError ||
    isCheckMathError ||
    isCheckPhoneError
  ) {
  } else {
    document.querySelector("#btnClick").onclick = function () {
      let thongTin = new UserRegister();
      let arrInput = document.querySelectorAll(
        "#form-input .form-control .input "
      );
      for (let input of arrInput) {
        let { id, value } = input;
        thongTin[id] = value;
      }
      let radios = document.getElementsByName("value-radio");
      for (let radio of radios) {
        if (radio.checked) {
          if (radio.value === "false") {
            thongTin.gender = false;
          } else {
            thongTin.gender = true;
          }
        }
      }
      console.log(thongTin);
      var promise = axios({
        url: "https://shop.cyberlearn.vn/api/Users/signup",
        method: "POST",
        data: thongTin,
      });
      promise.then(function (res) {
        console.log("ket qua", res.data);
        document.getElementById("complete").innerHTML =
          "Đăng kí tài khoản thành công";
      });
      promise.catch(function (err) {
        console.log(err.response.data);
        document.getElementById("email-error").innerHTML =
          "Email đã được sử dụng";
        document.getElementById("complete").innerHTML = "";
      });
    };
  }
});
