import AlarmModel from './model.js';
import AlarmView from './view.js';

class AlarmController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.init();
  }

  init() {
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'register.html') {
      this.handleRegister();
    } else if (currentPage === 'login.html') {
      this.handleLogin();
    } else if (currentPage === 'alarm.html') {
      this.handleAlarm();
      this.model.checkAlarms((message) => this.view.showAlarmNotification(message), this.view);
    } else if (currentPage === 'profile.html') {
      this.handleProfile();
      this.handleLogout();
      this.model.checkAlarms((message) => this.view.showAlarmNotification(message), this.view);
    }
  }

  handleRegister() {
    const form = document.querySelector('#register-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = {
          name: form.querySelector('#name').value,
          email: form.querySelector('#email').value,
          gender: form.querySelector('#gender').value,
          dob: form.querySelector('#dob').value,
          password: form.querySelector('#password').value,
        };
        try {
          this.model.registerUser(user);
          window.location.href = 'login.html';
        } catch (error) {
          this.view.showError(error.message);
        }
      });
    }
  }

  handleLogin() {
    const form = document.querySelector('#login-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = form.querySelector('#email').value;
        const password = form.querySelector('#password').value;
        if (this.model.loginUser(email, password)) {
          window.location.href = 'profile.html';
        } else {
          this.view.showError('Invalid email or password');
        }
      });
    }
  }

  handleAlarm() {
    if (!this.model.getCurrentUser()) {
      window.location.href = 'login.html';
      return;
    }
    const form = document.querySelector('#alarm-form');
    const alarmList = document.querySelector('.list-group');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const alarm = {
          time: form.querySelector('#alarmTime').value,
          date: form.querySelector('#alarmDate').value,
          triggered: false,
        };
        this.model.addAlarm(alarm);
        this.view.renderAlarms(this.model.getAlarms());
        form.reset();
      });
    }
    if (alarmList) {
      alarmList.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
          const index = e.target.dataset.index;
          this.model.deleteAlarm(index);
          this.view.renderAlarms(this.model.getAlarms());
        }
      });
      this.view.renderAlarms(this.model.getAlarms());
    }
  }

  handleProfile() {
    if (!this.model.getCurrentUser()) {
      window.location.href = 'login.html';
      return;
    }
    if (document.querySelector('#profile-username')) {
      const user = this.model.getCurrentUser();
      this.view.renderProfile(user);
    }
  }

  handleLogout() {
    const logoutBtn = document.querySelector('#logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        this.model.logoutUser();
        window.location.href = 'login.html';
      });
    }
  }
}

const model = new AlarmModel();
const view = new AlarmView();
const controller = new AlarmController(model, view);