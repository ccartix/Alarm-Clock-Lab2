class AlarmModel {
    constructor() {
      this.users = JSON.parse(localStorage.getItem('users')) || [];
      this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
      this.alarms = JSON.parse(localStorage.getItem(`alarms_${this.currentUser?.email}`)) || [];
    }
  
    // Реєстрація з перевіркою email
    registerUser(user) {
      if (this.users.some(u => u.email === user.email)) {
        throw new Error('Email already exists');
      }
      this.users.push(user);
      localStorage.setItem('users', JSON.stringify(this.users));
    }
  
    loginUser(email, password) {
      const user = this.users.find(u => u.email === email && u.password === password);
      if (user) {
        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.alarms = JSON.parse(localStorage.getItem(`alarms_${email}`)) || [];
        return true;
      }
      return false;
    }
  
    logoutUser() {
      this.currentUser = null;
      localStorage.removeItem('currentUser');
    }
  
    addAlarm(alarm) {
      if (this.currentUser) {
        this.alarms.push(alarm);
        localStorage.setItem(`alarms_${this.currentUser.email}`, JSON.stringify(this.alarms));
      }
    }
  
    deleteAlarm(index) {
      if (this.currentUser) {
        this.alarms.splice(index, 1);
        localStorage.setItem(`alarms_${this.currentUser.email}`, JSON.stringify(this.alarms));
      }
    }
  
    getCurrentUser() {
      return this.currentUser;
    }
  
    getAlarms() {
      return this.alarms;
    }
  
    // Перевірка часу будильників із точним збігом
    checkAlarms(callback, view) {
        setInterval(() => {
          if (this.currentUser) {
            const now = new Date();
            this.alarms.forEach((alarm, index) => {
              const alarmDateTime = new Date(`${alarm.date}T${alarm.time}:00`);
              const timeDiff = Math.abs(now - alarmDateTime);
              if (timeDiff < 1000 && !alarm.triggered) {
                callback(`Alarm: ${alarm.time} on ${alarm.date}`);
                alarm.triggered = true; // Позначаємо як спрацьований
                localStorage.setItem(`alarms_${this.currentUser.email}`, JSON.stringify(this.alarms));
                view.renderAlarms(this.alarms); // Оновлюємо відображення одразу
              }
            });
          }
        }, 1000);
      }
  }
  
  export default AlarmModel;