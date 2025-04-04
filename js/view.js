class AlarmView {
    renderProfile(user) {
      document.querySelector('#profile-username').textContent = user.name;
      document.querySelector('#profile-email').textContent = user.email;
      document.querySelector('#profile-dob').textContent = user.dob;
      document.querySelector('#profile-gender').textContent = user.gender;
    }
  
    renderAlarms(alarms) {
      const alarmList = document.querySelector('.list-group');
      alarmList.innerHTML = '';
      alarms.forEach((alarm, index) => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `${alarm.triggered ? '🔕' : '🔔'} ${alarm.time} - ${alarm.date} <button class="btn btn-danger btn-sm" data-index="${index}">Delete</button>`;
        alarmList.appendChild(li);
      });
    }
  
    showError(message) {
      alert(message);
    }
  
    showAlarmNotification(message) {
      alert(message);
    }
  }
  
  export default AlarmView;