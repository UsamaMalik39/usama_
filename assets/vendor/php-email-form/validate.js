// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, getDocs, collection, addDoc, FieldValue } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDVg4Ldl6S3WgVHWZ7-AX06DQSqaUgDizs",
  authDomain: "my-portfolio-92c88.firebaseapp.com",
  projectId: "my-portfolio-92c88",
  storageBucket: "my-portfolio-92c88.appspot.com",
  messagingSenderId: "262490060139",
  appId: "1:262490060139:web:2de049cfc695f0fe1c882e",
  measurementId: "G-ZCDPGPN2T8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

(function () {
  "use strict";
  let forms = document.querySelectorAll('.php-email-form');
  debugger;
  forms.forEach(function (e) {
    e.addEventListener('submit', function (event) {
      event.preventDefault();
      let thisForm = this;
      let action = thisForm.getAttribute('action');
      let recaptcha = thisForm.getAttribute('data-recaptcha-site-key');
      if (!action) {
        displayError(thisForm, 'The form action property is not set!')
        return;
      }
      thisForm.querySelector('.loading').classList.add('d-block');
      thisForm.querySelector('.error-message').classList.remove('d-block');
      thisForm.querySelector('.sent-message').classList.remove('d-block');
      let formData = new FormData(thisForm);
      if (recaptcha) {
        if (typeof grecaptcha !== "undefined") {
          grecaptcha.ready(function () {
            try {
              grecaptcha.execute(recaptcha, { action: 'php_email_form_submit' })
                .then(token => {
                  formData.set('recaptcha-response', token);
                  php_email_form_submit(thisForm, action, formData);
                })
            } catch (error) {
              displayError(thisForm, error)
            }
          });
        } else {
          displayError(thisForm, 'The reCaptcha javascript API url is not loaded!')
        }
      } else {
        let payload = { name: thisForm[0].value, email: thisForm[1].value, subject: thisForm[2].value, message: thisForm[3].value }
        php_email_form_submit(thisForm, action, formData, payload);
      }
    });
  });
  function php_email_form_submit(thisForm, action, formData, payload) {
    debugger;
    thisForm.querySelector('.loading').classList.add('d-block');
    addDoc(collection(db, "messages"), { ...payload }).then((data) => {
      console.log(data);
      thisForm.querySelector('.loading').classList.remove('d-block');
      thisForm.querySelector('.sent-message').classList.add('d-block');
      thisForm.reset();
      setTimeout(() => {
        thisForm.querySelector('.sent-message').classList.remove('d-block');
      }, 500);
    }).catch(err => {
      displayError(thisForm, err);
    });
  }
  function displayError(thisForm, error) {
    thisForm.querySelector('.loading').classList.remove('d-block');
    thisForm.querySelector('.error-message').innerHTML = error.message;
    thisForm.querySelector('.error-message').classList.add('d-block');
  }
})();