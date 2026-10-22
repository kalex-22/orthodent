/* Angelica C. Edralin Dental Clinic school-project prototype.
   localStorage is not secure production storage. */

const K = {
  users: 'orthodent_users_v1',
  appointments: 'orthodent_appointments_v1',
  session: 'orthodent_session_v1'
};

const PH_HOLIDAYS = {
  '2026-01-01': ['New Year’s Day', 'Regular holiday'],
  '2026-02-17': ['Chinese New Year', 'Special non-working day'],
  '2026-02-25': ['EDSA People Power Revolution Anniversary', 'Special working day'],
  '2026-03-20': ['Eid’l Fitr', 'Regular holiday'],
  '2026-04-02': ['Maundy Thursday', 'Regular holiday'],
  '2026-04-03': ['Good Friday', 'Regular holiday'],
  '2026-04-04': ['Black Saturday', 'Special non-working day'],
  '2026-04-09': ['Araw ng Kagitingan', 'Regular holiday'],
  '2026-05-01': ['Labor Day', 'Regular holiday'],
  '2026-05-27': ['Eid’l Adha', 'Regular holiday'],
  '2026-06-12': ['Independence Day', 'Regular holiday'],
  '2026-08-21': ['Ninoy Aquino Day', 'Special non-working day'],
  '2026-08-31': ['National Heroes Day', 'Regular holiday'],
  '2026-11-01': ['All Saints’ Day', 'Special non-working day'],
  '2026-11-02': ['All Souls’ Day', 'Special non-working day'],
  '2026-11-30': ['Bonifacio Day', 'Regular holiday'],
  '2026-12-08': ['Feast of the Immaculate Conception of Mary', 'Special non-working day'],
  '2026-12-24': ['Christmas Eve', 'Special non-working day'],
  '2026-12-25': ['Christmas Day', 'Regular holiday'],
  '2026-12-30': ['Rizal Day', 'Regular holiday'],
  '2026-12-31': ['Last Day of the Year', 'Special non-working day'],
  '2027-01-01': ['New Year’s Day', 'Regular holiday'],
  '2027-02-06': ['Chinese New Year', 'Special non-working day'],
  '2027-02-25': ['EDSA People Power Revolution Anniversary', 'Special working day'],
  '2027-03-25': ['Maundy Thursday', 'Regular holiday'],
  '2027-03-26': ['Good Friday', 'Regular holiday'],
  '2027-03-27': ['Black Saturday', 'Special non-working day'],
  '2027-04-09': ['Araw ng Kagitingan', 'Regular holiday'],
  '2027-05-01': ['Labor Day', 'Regular holiday'],
  '2027-06-12': ['Independence Day', 'Regular holiday'],
  '2027-08-21': ['Ninoy Aquino Day', 'Special non-working day'],
  '2027-08-30': ['National Heroes Day', 'Regular holiday'],
  '2027-11-01': ['All Saints’ Day', 'Special non-working day'],
  '2027-11-02': ['All Souls’ Day', 'Special non-working day'],
  '2027-11-30': ['Bonifacio Day', 'Regular holiday'],
  '2027-12-08': ['Feast of the Immaculate Conception of Mary', 'Special non-working day'],
  '2027-12-24': ['Christmas Eve', 'Special non-working day'],
  '2027-12-25': ['Christmas Day', 'Regular holiday'],
  '2027-12-30': ['Rizal Day', 'Regular holiday'],
  '2027-12-31': ['Last Day of the Year', 'Special non-working day']
};

const dateKey = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const read = (k, d = []) => {
  try {
    return JSON.parse(localStorage.getItem(k)) ?? d;
  } catch {
    return d;
  }
};

const write = (k, v) =>
  localStorage.setItem(k, JSON.stringify(v));

const esc = v =>
  String(v ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[c]));

const appts = () => read(K.appointments, []);
const users = () => read(K.users, []);
const session = () => read(K.session, null);

const msg = (id, text, error = false) => {
  let e = document.getElementById(id);
  if (e) {
    e.textContent = text;
    e.classList.toggle('error', error);
  }
};

const sclass = s => 'status-' + String(s).toLowerCase();

const pclass = s =>
  s === 'Verified'
    ? 'payment-verified'
    : s === 'Pending verification'
      ? 'payment-pending'
      : 'payment-unpaid';

const dateText = d =>
  d
    ? new Date(d + 'T00:00:00').toLocaleDateString(
        undefined,
        { month: 'short', day: 'numeric', year: 'numeric' }
      )
    : '—';

function guard(role) {
  let s = session();

  if (!s || s.role !== role) {
    location.href =
      role === 'admin' ? 'admin-login.html' : 'index.html';
    return null;
  }

  return s;
}

function setSession(s) {
  write(K.session, s);
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();

  if (!localStorage.getItem(K.users)) write(K.users, []);
  if (!localStorage.getItem(K.appointments)) write(K.appointments, []);

  const login = document.getElementById('patientLogin');

  if (login) {
    document.getElementById('showRegister').onclick = () => {
      let f = document.getElementById('registerForm');
      f.classList.toggle('hidden');

      document.getElementById('showRegister').textContent =
        f.classList.contains('hidden')
          ? 'Create patient account'
          : 'Hide registration';
    };

    login.onsubmit = e => {
      e.preventDefault();

      let email = document
        .getElementById('patientEmail')
        .value.trim().toLowerCase();

      let pw = document.getElementById('patientPassword').value;

      let u = users().find(
        x =>
          x.email.toLowerCase() === email &&
          x.password === pw &&
          x.role === 'patient'
      );

      if (!u) {
        return msg(
          'loginMessage',
          'Account not found or password is incorrect. Create an account first.',
          true
        );
      }

      setSession({
        role: 'patient',
        userId: u.id,
        name: u.name,
        email: u.email
      });

      location.href = 'patient-dashboard.html';
    };

    document.getElementById('registerForm').onsubmit = e => {
      e.preventDefault();

      let name = document
        .getElementById('registerName')
        .value.trim();

      let email = document
        .getElementById('registerEmail')
        .value.trim().toLowerCase();

      let pw = document.getElementById('registerPassword').value;

      if (users().some(u => u.email.toLowerCase() === email)) {
        return msg(
          'loginMessage',
          'An account with this email already exists.',
          true
        );
      }

      let u = {
        id: 'u' + Date.now(),
        name,
        email,
        password: pw,
        role: 'patient',
        createdAt: new Date().toISOString()
      };

      write(K.users, [...users(), u]);

      setSession({
        role: 'patient',
        userId: u.id,
        name,
        email
      });

      location.href = 'patient-dashboard.html';
    };
  }

  const adminLogin = document.getElementById('adminLogin');

  if (adminLogin) {
    adminLogin.onsubmit = e => {
      e.preventDefault();

      if (
        document.getElementById('adminUsername').value.trim() === 'admin' &&
        document.getElementById('adminPassword').value === 'admin123'
      ) {
        setSession({
          role: 'admin',
          name: 'Clinic Administrator'
        });

        location.href = 'admin-dashboard.html';
      } else {
        msg(
          'adminMessage',
          'Invalid administrator username or password.',
          true
        );
      }
    };
  }

  if (document.getElementById('bookingForm')) {
    initPatient();
    initPatientNavigation();
  }
  if (document.getElementById('adminAppointments')) {
    initAdmin();
    initAdminNavigation();
  }

  document.querySelectorAll('[data-logout]').forEach(b => {
    b.onclick = () => {
      localStorage.removeItem(K.session);
      location.href = 'index.html';
    };
  });
});

function initAdminNavigation() {
  let links = [...document.querySelectorAll('.admin-dashboard .sidebar a.nav-item[href^="#"]')];
  let sections = links
    .map(link => document.getElementById(link.hash.slice(1)))
    .filter(Boolean);
  let heading = document.querySelector('.admin-dashboard .dash-top h1');
  let eyebrow = document.querySelector('.admin-dashboard .dash-top .eyebrow');
  let pageTitles = {
    overview: ['Clinic dashboard', 'ADMIN CONSOLE / OVERVIEW'],
    'manage-appointments': ['Appointment requests', 'ADMIN CONSOLE / APPOINTMENTS'],
    schedule: ['Appointment schedule', 'ADMIN CONSOLE / SCHEDULE'],
    payments: ['Payment records', 'ADMIN CONSOLE / PAYMENTS'],
    analytics: ['Clinic activity', 'ADMIN CONSOLE / ANALYTICS']
  };

  function showSection(id) {
    if (!sections.some(section => section.id === id)) id = 'overview';

    sections.forEach(section => {
      section.hidden = section.id !== id;
    });

    links.forEach(link => {
      let active = link.hash === `#${id}`;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });

    let [title, label] = pageTitles[id];
    heading.textContent = title;
    eyebrow.textContent = label;
  }

  links.forEach(link => {
    link.onclick = event => {
      event.preventDefault();
      history.pushState(null, '', link.hash);
      showSection(link.hash.slice(1));
    };
  });

  window.addEventListener('popstate', () => showSection(location.hash.slice(1)));
  showSection(location.hash.slice(1) || 'overview');
}

function initTheme() {
  let savedTheme = localStorage.getItem('clinic_theme') || 'light';
  let themeButtons = document.querySelectorAll('[data-theme-toggle]');

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    themeButtons.forEach(button => {
      let dark = theme === 'dark';
      button.textContent = dark ? 'Light mode' : 'Dark mode';
      button.setAttribute('aria-pressed', String(dark));
      button.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} mode`);
    });
  }

  applyTheme(savedTheme);

  themeButtons.forEach(button => {
    button.onclick = () => {
      let nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('clinic_theme', nextTheme);
      applyTheme(nextTheme);
    };
  });
}

function initPatientNavigation() {
  let links = [...document.querySelectorAll('.dashboard-page .sidebar a.nav-item[href^="#"]')];
  let pages = ['overview', 'appointments', 'payments']
    .map(id => document.getElementById(id)).filter(Boolean);
  let heading = document.getElementById('patientGreeting');
  let eyebrow = document.getElementById('patientPageEyebrow');
  let description = document.getElementById('patientPageDescription');
  let greeting = heading.textContent;
  let titles = {
    overview: [greeting, 'PATIENT PORTAL / OVERVIEW', 'Here is your dental care at a glance.'],
    appointments: ['My appointments', 'PATIENT PORTAL / APPOINTMENTS', 'Review your appointment requests and clinic updates.'],
    payments: ['Payment information', 'PATIENT PORTAL / PAYMENTS', 'Review payment guidance for your appointment requests.']
  };

  function showPage(id) {
    if (!titles[id]) id = 'overview';
    pages.forEach(page => { page.hidden = page.id !== id; });
    links.forEach(link => {
      let active = link.hash === `#${id}`;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    let [title, label, copy] = titles[id];
    heading.textContent = title;
    eyebrow.textContent = label;
    description.textContent = copy;
    window.scrollTo(0, 0);
  }

  links.forEach(link => {
    link.onclick = event => {
      event.preventDefault();
      if (link.hash === '#book') {
        history.pushState(null, '', link.hash);
        showPage('overview');
        openPatientBooking();
        return;
      }
      history.pushState(null, '', link.hash);
      showPage(link.hash.slice(1));
    };
  });
  let syncPage = () => {
    let id = location.hash.slice(1) || 'overview';
    if (id === 'book') {
      showPage('overview');
      openPatientBooking();
    } else {
      let dialog = document.getElementById('bookingDialog');
      if (dialog?.open) dialog.close();
      showPage(id);
    }
  };
  window.addEventListener('popstate', syncPage);
  window.addEventListener('hashchange', syncPage);
  syncPage();
}

function initPatient() {
  let s = guard('patient');
  if (!s) return;

  let u = users().find(x => x.id === s.userId);

  if (!u) {
    localStorage.removeItem(K.session);
    location.href = 'index.html';
    return;
  }

  document.getElementById('patientGreeting').textContent =
    'Good day, ' + u.name.split(' ')[0] + '.';

  document.getElementById('patientNameTop').textContent = u.name;

  document.getElementById('patientAvatar').textContent =
    u.name.charAt(0).toUpperCase();

  initBookingDialog();

  document.querySelectorAll('[data-service]').forEach(card => {
    card.onclick = event => {
      event.preventDefault();
      openPatientBooking(card.dataset.service);
    };
  });

  let date = document.getElementById('appointmentDate');
  let calendar = document.getElementById('holidayCalendar');
  let calendarToggle = document.getElementById('holidayCalendarToggle');
  date.min = dateKey(new Date());
  window.patientCalendarMonth = new Date();
  calendarToggle.onclick = () => setHolidayCalendarOpen(calendar.hidden);
  document.addEventListener('click', event => {
    if (!event.target.closest('.date-picker-field')) setHolidayCalendarOpen(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') setHolidayCalendarOpen(false);
  });
  date.addEventListener('change', () => {
    if (!date.value) return renderHolidayCalendar();
    let selected = new Date(`${date.value}T00:00:00`);
    window.patientCalendarMonth = new Date(selected.getFullYear(), selected.getMonth(), 1);
    renderHolidayCalendar();
  });
  renderHolidayCalendar();

  let paymentMethod = document.getElementById('paymentMethod');
  let paymentDetails = document.getElementById('paymentDetails');
  let paymentQr = document.getElementById('paymentQr');
  let paymentTransfer = document.getElementById('paymentTransfer');
  let paymentProofField = document.getElementById('paymentProofField');
  let paymentProofInput = document.getElementById('paymentProof');
  let paymentProofPreview = document.getElementById('paymentProofPreview');
  let paymentQrTitle = document.getElementById('paymentQrTitle');
  let paymentQrMessage = document.getElementById('paymentQrMessage');
  let gcashQrImage = document.getElementById('gcashQrImage');
  let mayaQrImage = document.getElementById('mayaQrImage');

  paymentMethod.onchange = () => {
    let method = paymentMethod.value;
    let showQr = method === 'GCash' || method === 'Maya';
    let showTransfer = method === 'Bank Transfer';
    let showProof = ['GCash', 'Maya', 'Bank Transfer'].includes(method);

    paymentDetails.hidden = !showQr && !showTransfer;
    paymentQr.hidden = !showQr;
    paymentTransfer.hidden = !showTransfer;
    paymentProofField.hidden = !showProof;
    paymentProofInput.required = showProof;

    if (!showProof) {
      paymentProofInput.value = '';
      paymentProofPreview.removeAttribute('src');
      paymentProofPreview.hidden = true;
    }

    if (showQr) {
      let isGcash = method === 'GCash';
      gcashQrImage.hidden = !isGcash;
      mayaQrImage.hidden = isGcash;
      paymentQrTitle.textContent = `${method} QR code`;
      paymentQrMessage.textContent = `Scan the clinic's official ${method} QR code to pay.`;
    }
  };

  paymentProofInput.onchange = () => {
    let file = paymentProofInput.files[0];
    if (!file) {
      paymentProofPreview.hidden = true;
      return;
    }
    if (!file.type.startsWith('image/')) {
      paymentProofInput.value = '';
      paymentProofPreview.hidden = true;
      return msg('bookingMessage', 'Please choose an image file for payment proof.', true);
    }
    if (file.size > 10 * 1024 * 1024) {
      paymentProofInput.value = '';
      paymentProofPreview.hidden = true;
      return msg('bookingMessage', 'Choose an image smaller than 10 MB.', true);
    }
    paymentProofPreview.src = URL.createObjectURL(file);
    paymentProofPreview.hidden = false;
    msg('bookingMessage', 'Payment proof selected.');
  };

  document.getElementById('bookingForm').onsubmit = async e => {
    e.preventDefault();

    let d = date.value;
    let t = document.getElementById('appointmentTime').value;

    if (d < dateKey(new Date())) {
      return msg(
        'bookingMessage',
        'Please choose today or a future date.',
        true
      );
    }

    let list = appts();

    if (
      list.some(
        a =>
          a.date === d &&
          a.time === t &&
          ['Pending', 'Approved'].includes(a.status)
      )
    ) {
      return msg(
        'bookingMessage',
        'That preferred time already has a request. Please choose another time.',
        true
      );
    }

    let method = document.getElementById('paymentMethod').value;
    let isOnlinePayment = ['GCash', 'Maya', 'Bank Transfer'].includes(method);
    let proofFile = paymentProofInput.files[0];

    if (isOnlinePayment && !proofFile) {
      return msg('bookingMessage', 'Upload a screenshot of your payment proof to continue.', true);
    }

    let paymentProof = '';
    if (isOnlinePayment) {
      try {
        paymentProof = await resizeProofImage(proofFile);
      } catch {
        return msg('bookingMessage', 'Could not read that image. Please select it again.', true);
      }
    }

    list.push({
      id: 'A' + Date.now(),
      userId: u.id,
      patientName: u.name,
      email: u.email,
      procedure: document.getElementById('procedure').value,
      date: d,
      time: t,
      method,
      paymentProof,
      status: 'Pending',
      paymentStatus: isOnlinePayment
        ? 'Pending verification'
        : 'Unpaid',
      amount: 0,
      createdAt: new Date().toISOString()
    });

    try {
      write(K.appointments, list);
    } catch {
      return msg('bookingMessage', 'Could not save the proof. Please choose a smaller image and try again.', true);
    }

    e.target.reset();
    paymentMethod.onchange();
    date.min = dateKey(new Date());
    renderHolidayCalendar();

    msg(
      'bookingMessage',
      'Your appointment request was submitted. It is pending clinic review.'
    );

    renderPatient(u);
  };

  renderPatient(u);
  window.addEventListener('storage', event => {
    if (event.key === K.appointments) renderPatient(u);
  });
}

function initBookingDialog() {
  let bookingPanel = document.getElementById('book');
  let services = document.getElementById('services');
  if (!bookingPanel || !services) return;
  let dialog = document.createElement('dialog');
  dialog.id = 'bookingDialog';
  dialog.className = 'booking-dialog';
  bookingPanel.classList.remove('patient-view');
  bookingPanel.classList.add('booking-dialog-panel');
  dialog.append(bookingPanel);
  services.append(dialog);

  document.getElementById('bookingDialogClose').onclick = () => dialog.close();
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    if (location.hash === '#book') history.replaceState(null, '', '#overview');
  });
  document.querySelectorAll('[data-open-booking]').forEach(link => {
    link.onclick = event => {
      event.preventDefault();
      openPatientBooking();
    };
  });
}

function openPatientBooking(procedure = '') {
  let dialog = document.getElementById('bookingDialog');
  if (!dialog) return;
  let procedureInput = document.getElementById('procedure');
  if (procedure) procedureInput.value = procedure;
  if (!dialog.open) dialog.showModal();
}

function renderHolidayCalendar() {
  let host = document.getElementById('holidayCalendar');
  let dateInput = document.getElementById('appointmentDate');
  if (!host || !dateInput) return;
  let month = window.patientCalendarMonth || new Date();
  let year = month.getFullYear();
  let monthIndex = month.getMonth();
  let firstWeekday = new Date(year, monthIndex, 1).getDay();
  let monthDays = new Date(year, monthIndex + 1, 0).getDate();
  let selected = dateInput.value;
  let thisMonthHolidays = Object.entries(PH_HOLIDAYS)
    .filter(([key]) => key.startsWith(`${year}-${String(monthIndex + 1).padStart(2, '0')}`))
    .sort(([a], [b]) => a.localeCompare(b));
  let cells = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    .map(day => `<span class="holiday-weekday">${day}</span>`).join('');

  for (let blank = 0; blank < firstWeekday; blank++) cells += '<span class="holiday-day holiday-day-empty" aria-hidden="true"></span>';
  for (let day = 1; day <= monthDays; day++) {
    let current = new Date(year, monthIndex, day);
    let key = dateKey(current);
    let holiday = PH_HOLIDAYS[key];
    let holidayClass = holiday ? ' holiday-day-marked' : '';
    let selectedClass = selected === key ? ' holiday-day-selected' : '';
    let disabled = key < dateInput.min ? ' disabled' : '';
    let label = holiday ? `${key}, ${holiday[0]}, ${holiday[1]}` : key;
    cells += `<button class="holiday-day${holidayClass}${selectedClass}" type="button" data-holiday-date="${key}" aria-label="${esc(label)}"${disabled}${holiday ? ` title="${esc(holiday[0])} · ${esc(holiday[1])}"` : ''}>${day}${holiday ? '<i aria-hidden="true"></i>' : ''}</button>`;
  }

  host.innerHTML = `
    <div class="holiday-calendar-top">
      <button type="button" data-holiday-shift="-1" aria-label="Previous month">‹</button>
      <strong>${month.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</strong>
      <button type="button" data-holiday-shift="1" aria-label="Next month">›</button>
    </div>
    <div class="holiday-calendar-grid">${cells}</div>
    <div class="holiday-calendar-legend"><i></i> Philippine national holiday</div>
    ${thisMonthHolidays.length ? `<ul class="holiday-month-list">${thisMonthHolidays.map(([key, [name, type]]) => `<li><time>${new Date(`${key}T00:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</time><span>${esc(name)}<small>${esc(type)}</small></span></li>`).join('')}</ul>` : '<p class="holiday-no-dates">No nationally declared holiday dates in this month.</p>'}
    <p class="holiday-calendar-note">Holiday dates are marked for 2026–2027; clinic availability may differ. 2027 Eid dates will be added when officially declared.</p>
  `;

  host.querySelectorAll('[data-holiday-shift]').forEach(button => {
    button.onclick = event => {
      event.stopPropagation();
      window.patientCalendarMonth = new Date(year, monthIndex + Number(button.dataset.holidayShift), 1);
      renderHolidayCalendar();
    };
  });
  host.querySelectorAll('[data-holiday-date]').forEach(button => {
    button.onclick = () => {
      dateInput.value = button.dataset.holidayDate;
      dateInput.dispatchEvent(new Event('change', { bubbles: true }));
      setHolidayCalendarOpen(false);
    };
  });
}

function setHolidayCalendarOpen(open) {
  let calendar = document.getElementById('holidayCalendar');
  let toggle = document.getElementById('holidayCalendarToggle');
  let field = document.querySelector('.date-picker-field');
  if (!calendar || !toggle || !field) return;
  calendar.hidden = !open;
  field.classList.toggle('calendar-open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close date calendar' : 'Open date calendar');
}

function resizeProofImage(file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      let image = new Image();
      image.onerror = reject;
      image.onload = () => {
        let scale = Math.min(1, 1280 / Math.max(image.width, image.height));
        let canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.78));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function renderPatient(u) {
  let mine = appts()
    .filter(a => a.userId === u.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  document.getElementById('patientTotal').textContent = mine.length;

  document.getElementById('patientApproved').textContent =
    mine.filter(a => a.status === 'Approved').length;

  document.getElementById('patientPending').textContent =
    mine.filter(a => a.status === 'Pending').length;

  document.getElementById('patientAppointments').innerHTML =
    mine.length
      ? mine.map(a => `
        <tr>
          <td>
            <strong>${esc(a.procedure)}</strong><br>
            <span class="tiny muted">${esc(a.note || 'No note added')}</span>
          </td>
          <td>${dateText(a.date)} · ${esc(a.time)}</td>
          <td>
            <span class="status-pill ${sclass(a.status)}">
              ${esc(a.status)}
            </span>
          </td>
          <td>
            <span class="payment-pill ${pclass(a.paymentStatus)}">
              ${esc(a.paymentStatus)}
            </span>
          </td>
        </tr>
      `).join('')
      : '<tr><td colspan="4" class="empty-cell">No appointments yet. Submit your first request above.</td></tr>';
}

function initAdmin() {
  if (!guard('admin')) return;

  initPaymentProofDialog();
  document.getElementById('appointmentSearch').oninput = renderAdmin;
  document.getElementById('statusFilter').onchange = renderAdmin;
  document.getElementById('exportCsv').onclick = exportCsv;
  window.adminScheduleMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  document.getElementById('schedulePrev').onclick = () => { adminScheduleMonth.setMonth(adminScheduleMonth.getMonth() - 1); renderAdmin(); };
  document.getElementById('scheduleNext').onclick = () => { adminScheduleMonth.setMonth(adminScheduleMonth.getMonth() + 1); renderAdmin(); };

  renderAdmin();
}

function renderAdmin() {
  let all = appts().sort(
    (a, b) => b.createdAt.localeCompare(a.createdAt)
  );

  let search = (
    document.getElementById('appointmentSearch').value || ''
  ).toLowerCase();

  let filter = document.getElementById('statusFilter').value;

  let shown = all.filter(
    a =>
      (filter === 'All' || a.status === filter) &&
      (`${a.patientName} ${a.procedure} ${a.email}`)
        .toLowerCase()
        .includes(search)
  );

  document.getElementById('adminTotal').textContent = all.length;

  document.getElementById('adminPending').textContent =
    all.filter(a => a.status === 'Pending').length;

  document.getElementById('adminApproved').textContent =
    all.filter(a => a.status === 'Approved').length;

  document.getElementById('adminPaid').textContent =
    '₱' +
    all
      .filter(a => a.paymentStatus === 'Verified')
      .reduce((n, a) => n + Number(a.amount || 0), 0)
      .toLocaleString('en-PH');

  let body = document.getElementById('adminAppointments');

  body.innerHTML = shown.length
    ? shown.map(a => `
      <tr>
        <td>
          <strong>${esc(a.patientName)}</strong><br>
          <span class="tiny muted">${esc(a.email)}</span>
        </td>
        <td>${esc(a.procedure)}</td>
        <td>${dateText(a.date)} · ${esc(a.time)}</td>
        <td>${esc(a.method)}</td>
        <td>
          <span class="status-pill ${sclass(a.status)}">
            ${esc(a.status)}
          </span>
        </td>
        <td>
          <button class="table-action" data-edit="${a.id}">Edit booking</button>
          ${
            a.status === 'Pending'
              ? `<button class="table-action" data-status="${a.id}" data-value="Approved">Approve</button>
                 <button class="table-action danger" data-status="${a.id}" data-value="Rejected">Reject</button>`
              : ''
          }
          ${
            a.status === 'Approved'
              ? `<button class="table-action" data-status="${a.id}" data-value="Completed">Complete</button>`
              : ''
          }
        </td>
      </tr>
    `).join('')
    : '<tr><td colspan="6" class="empty-cell">No matching appointment requests.</td></tr>';

  body.querySelectorAll('[data-status]').forEach(b => {
    b.onclick = () =>
      update(b.dataset.status, { status: b.dataset.value });
  });

  body.querySelectorAll('[data-edit]').forEach(button => {
    button.onclick = () => editAppointment(button.dataset.edit);
  });

  renderPayments(all);
  renderAnalytics(all);
  renderAdminCalendar(all);
  renderAdminWidgets(all);
}

function monthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function money(value) {
  return '₱' + Number(value || 0).toLocaleString('en-PH', { maximumFractionDigits: 2 });
}

function renderAdminWidgets(all) {
  let now = new Date();
  let today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  let active = all.filter(item => ['Pending', 'Approved'].includes(item.status));
  let upcoming = active.filter(item => item.date >= today).sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
  let nextEl = document.getElementById('nextPatientDetails');
  let next = upcoming[0];
  let lastVisit = next && all.filter(item => item.userId === next.userId && item.id !== next.id && item.date && item.date < next.date)
    .sort((a, b) => b.date.localeCompare(a.date))[0];
  nextEl.innerHTML = next ? `
    <div class="next-patient-name"><span class="avatar admin-avatar">${esc((next.patientName || 'P').charAt(0).toUpperCase())}</span><div><strong>${esc(next.patientName || 'Patient')}</strong><small>${esc(next.procedure || 'Dental appointment')}</small></div></div>
    <dl class="patient-detail-list"><div><dt>Patient ID</dt><dd>${esc(next.userId || next.id)}</dd></div><div><dt>Last visit</dt><dd>${lastVisit ? dateText(lastVisit.date) : 'No prior visit'}</dd></div><div><dt>Email</dt><dd>${esc(next.email || 'Not provided')}</dd></div><div><dt>Appointment</dt><dd>${dateText(next.date)} · ${esc(next.time || 'Time not set')}</dd></div><div><dt>Status</dt><dd><span class="status-pill ${sclass(next.status)}">${esc(next.status)}</span></dd></div></dl>
  ` : '<p class="muted">No upcoming appointments.</p>';

  let todays = all.filter(item => item.date === today && item.status !== 'Rejected').sort((a, b) => (a.time || '').localeCompare(b.time || ''));
  document.getElementById('todayAppointmentCount').textContent = todays.length;
  document.getElementById('todayAppointments').innerHTML = todays.length ? todays.map(item => `
    <div class="today-appointment"><time>${esc(item.time || 'TBD')}</time><div><strong>${esc(item.patientName || 'Patient')}</strong><small>${esc(item.procedure || 'Dental appointment')}</small></div><span class="status-pill ${sclass(item.status)}">${esc(item.status)}</span></div>
  `).join('') : '<p class="muted">No appointments scheduled today.</p>';

  let usersList = users();
  let byUser = new Map();
  all.forEach(item => {
    if (!item.userId) return;
    let existing = byUser.get(item.userId);
    if (!existing || (item.createdAt && item.createdAt < existing)) byUser.set(item.userId, item.createdAt || '');
  });
  let seen = new Set();
  let thisMonth = monthKey(now);
  usersList.forEach(user => {
    seen.add(user.id);
    let created = user.createdAt || byUser.get(user.id) || '';
    if (created && monthKey(new Date(created)) === thisMonth) byUser.set(`monthly:${user.id}`, created);
  });
  byUser.forEach((created, id) => { if (!id.startsWith('monthly:')) seen.add(id); });
  let monthlyPatients = [...byUser.keys()].filter(id => id.startsWith('monthly:')).length;
  document.getElementById('patientsThisMonth').textContent = monthlyPatients;
  document.getElementById('patientsAllTime').textContent = seen.size;

  let previous = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  let currentRevenue = 0;
  let previousRevenue = 0;
  all.filter(item => item.paymentStatus === 'Verified').forEach(item => {
    let paymentDate = new Date(item.paymentVerifiedAt || item.updatedAt || item.createdAt || '');
    if (Number.isNaN(paymentDate.getTime())) return;
    if (monthKey(paymentDate) === thisMonth) currentRevenue += Number(item.amount || 0);
    if (monthKey(paymentDate) === monthKey(previous)) previousRevenue += Number(item.amount || 0);
  });
  document.getElementById('earningsThisMonth').textContent = money(currentRevenue);
  document.getElementById('earningsPreviousMonth').textContent = money(previousRevenue);
}

function editAppointment(id) {
  let appointment = appts().find(item => item.id === id);
  if (!appointment) return;
  let date = prompt('Appointment date (YYYY-MM-DD):', appointment.date || '');
  if (date === null) return;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(new Date(`${date}T00:00:00`).getTime())) {
    return msg('adminActionMessage', 'Enter the appointment date as YYYY-MM-DD.', true);
  }
  let time = prompt('Appointment time:', appointment.time || '');
  if (time === null) return;
  let procedure = prompt('Dental procedure:', appointment.procedure || '');
  if (procedure === null) return;
  let collision = appts().some(item => item.id !== id && item.date === date && item.time === time && ['Pending', 'Approved'].includes(item.status));
  if (collision) return msg('adminActionMessage', 'That time is already reserved by another active request.', true);
  update(id, { date, time, procedure: procedure.trim() || appointment.procedure });
  msg('adminActionMessage', 'Booking details updated. The patient dashboard now shows the revised schedule.');
}

function renderAdminCalendar(all) {
  let month = window.adminScheduleMonth || new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  let year = month.getFullYear();
  let monthIndex = month.getMonth();
  document.getElementById('scheduleMonth').textContent = month.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  let firstDay = new Date(year, monthIndex, 1).getDay();
  let days = new Date(year, monthIndex + 1, 0).getDate();
  let entries = all.filter(item => item.date && item.date.slice(0, 7) === `${year}-${String(monthIndex + 1).padStart(2, '0')}` && ['Pending', 'Approved'].includes(item.status));
  let html = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => `<div class="calendar-weekday">${day}</div>`).join('');
  for (let i = 0; i < firstDay; i++) html += '<div class="calendar-day calendar-empty"></div>';
  for (let day = 1; day <= days; day++) {
    let key = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    let dayEntries = entries.filter(item => item.date === key).sort((a, b) => (a.time || '').localeCompare(b.time || ''));
    let holiday = PH_HOLIDAYS[key];
    html += `<div class="calendar-day"><span class="calendar-date">${day}</span>${holiday ? `<div class="admin-calendar-holiday" title="${esc(holiday[0])} · ${esc(holiday[1])}">${esc(holiday[0])}</div>` : ''}${dayEntries.map(item => `<div class="calendar-event ${item.status === 'Approved' ? 'event-approved' : 'event-pending'}" title="${esc(item.patientName)} · ${esc(item.procedure)} · ${esc(item.time)}"><strong>${esc(item.patientName || 'Patient')}</strong><small>${esc(item.time || 'Time not set')}</small></div>`).join('')}</div>`;
  }
  document.getElementById('adminCalendar').innerHTML = html;
}

function update(id, changes) {
  let l = appts();
  let i = l.findIndex(a => a.id === id);

  if (i < 0) return;

  l[i] = {
    ...l[i],
    ...changes,
    updatedAt: new Date().toISOString()
  };

  write(K.appointments, l);

  msg('adminActionMessage', 'Appointment updated successfully.');

  renderAdmin();
}

function renderPayments(all) {
  let b = document.getElementById('adminPayments');

  b.innerHTML = all.length
    ? all.map(a => `
      <tr>
        <td>${esc(a.patientName)}</td>
        <td>
          ${esc(a.procedure)}<br>
          <span class="tiny muted">${dateText(a.date)}</span>
        </td>
        <td>${esc(a.method)}</td>
        <td>${a.paymentProof ? `<button class="table-action" type="button" data-proof="${esc(a.id)}">View proof</button>` : '<span class="tiny muted">Not provided</span>'}</td>
        <td>
          <span class="payment-pill ${pclass(a.paymentStatus)}">
            ${esc(a.paymentStatus)}
          </span>
        </td>
        <td>
          ${
            a.paymentStatus === 'Verified'
              ? '<span class="tiny muted">Verified</span>'
              : `<button class="table-action" data-pay="${a.id}">Mark verified</button>`
          }
        </td>
      </tr>
    `).join('')
    : '<tr><td colspan="6" class="empty-cell">No payment records yet.</td></tr>';

  b.querySelectorAll('[data-pay]').forEach(btn => {
    btn.onclick = () => {
      let v = prompt(
        'Enter amount actually received in PHP. This demo does not verify payments:',
        ''
      );

      if (v === null) return;

      let amount = Number(v);

      if (!Number.isFinite(amount) || amount < 0) {
        return alert('Enter a valid amount.');
      }

      update(btn.dataset.pay, {
        paymentStatus: 'Verified',
        amount,
        paymentVerifiedAt: new Date().toISOString()
      });
    };
  });

  b.querySelectorAll('[data-proof]').forEach(btn => {
    btn.onclick = () => openPaymentProof(btn.dataset.proof);
  });
}

function initPaymentProofDialog() {
  let dialog = document.getElementById('paymentProofDialog');
  if (!dialog || dialog.dataset.initialized) return;
  dialog.dataset.initialized = 'true';
  document.getElementById('paymentProofClose').onclick = () => dialog.close();
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    let image = document.getElementById('paymentProofImage');
    image.removeAttribute('src');
    image.hidden = true;
    document.getElementById('paymentProofError').hidden = true;
  });
}

function openPaymentProof(id) {
  let appointment = appts().find(item => String(item.id) === String(id));
  let dialog = document.getElementById('paymentProofDialog');
  let image = document.getElementById('paymentProofImage');
  let error = document.getElementById('paymentProofError');
  if (!appointment?.paymentProof || !dialog || !image || !error) return;

  error.hidden = true;
  image.hidden = false;
  image.onerror = () => {
    image.hidden = true;
    error.hidden = false;
  };
  image.src = appointment.paymentProof;
  if (!dialog.open) dialog.showModal();
}

function bars(id, entries) {
  let el = document.getElementById(id);

  if (!entries.length) {
    el.innerHTML = '<p class="muted tiny">No records available yet.</p>';
    return;
  }

  let max = Math.max(1, ...entries.map(x => x[1]));

  el.innerHTML = entries.map(([name, val]) => `
    <div class="bar-row">
      <span>${esc(name)}</span>
      <div class="bar-track">
        <div class="bar-fill" style="width:${Math.max(1, val / max * 100)}%"></div>
      </div>
      <span class="bar-value">${val}</span>
    </div>
  `).join('');
}

function paymentPie(entries) {
  let el = document.getElementById('paymentChart');

  if (!entries.length) {
    el.innerHTML = '<p class="muted tiny">No records available yet.</p>';
    return;
  }

  let colors = ['#ed7447', '#dfa91f', '#7653b6', '#328bc7', '#48a778', '#d65c8b'];
  let total = entries.reduce((sum, [, value]) => sum + value, 0);
  let angle = 0;
  let gradient = entries.map(([, value], index) => {
    let start = angle;
    angle += value / total * 360;
    return `${colors[index % colors.length]} ${start}deg ${angle}deg`;
  }).join(', ');

  el.innerHTML = `
    <div class="payment-pie-layout">
      <div class="payment-pie-wrap" role="img" aria-label="3D pie chart of payment methods">
        <div class="payment-pie-depth" style="--pie-gradient:conic-gradient(${gradient})"></div>
        <div class="payment-pie-top" style="--pie-gradient:conic-gradient(${gradient})"></div>
      </div>
      <div class="payment-pie-legend">
        ${entries.map(([name, value], index) => `
          <div class="payment-pie-legend-row">
            <span class="payment-pie-swatch" style="--pie-color:${colors[index % colors.length]}"></span>
            <span class="payment-pie-name">${esc(name)}</span>
            <strong>${value}</strong>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function monthlyColumns(entries) {
  let el = document.getElementById('monthlyChart');

  if (!entries.length) {
    el.innerHTML = '<p class="muted tiny">No records available yet.</p>';
    return;
  }

  let max = Math.max(1, ...entries.map(([, value]) => value));
  let label = month => month === 'Unknown'
    ? 'Unknown'
    : new Date(`${month}-01T00:00:00`).toLocaleDateString(undefined, { month: 'short', year: '2-digit' });

  el.innerHTML = `
    <div class="monthly-column-chart" aria-label="Monthly appointment booking totals">
      ${entries.map(([month, value]) => `
        <div class="monthly-column-group" title="${esc(label(month))}: ${value} bookings">
          <strong class="monthly-column-total">${value}</strong>
          <div class="monthly-column-track">
            <div class="monthly-column-fill" style="height:${Math.max(4, value / max * 145)}px"></div>
          </div>
          <span class="monthly-column-label">${esc(label(month))}</span>
        </div>
      `).join('')}
    </div>
  `;
}

function statusColumns(appointments) {
  let el = document.getElementById('statusChart');
  let statuses = ['Pending', 'Approved', 'Rejected', 'Completed'];

  if (!appointments.length) {
    el.innerHTML = '<p class="muted tiny">No records available yet.</p>';
    return;
  }

  let monthNames = [...new Set(appointments.map(a => a.date ? a.date.slice(0, 7) : 'Unknown'))]
    .sort((a, b) => a === 'Unknown' ? 1 : b === 'Unknown' ? -1 : a.localeCompare(b))
    .slice(-6);
  let counts = Object.fromEntries(statuses.map(status => [status, Object.fromEntries(monthNames.map(month => [month, 0]))]));

  appointments.forEach(appointment => {
    let status = statuses.includes(appointment.status) ? appointment.status : 'Pending';
    let month = appointment.date ? appointment.date.slice(0, 7) : 'Unknown';
    if (counts[status][month] !== undefined) counts[status][month] += 1;
  });

  let totals = statuses.map(status => monthNames.reduce((sum, month) => sum + counts[status][month], 0));
  let max = Math.max(1, ...totals);
  let label = month => month === 'Unknown'
    ? 'Unknown date'
    : new Date(`${month}-01T00:00:00`).toLocaleDateString(undefined, { month: 'short', year: '2-digit' });

  el.innerHTML = `
    <div class="status-column-chart" aria-label="Appointment counts by status, stacked by month">
      <div class="status-column-legend">
        ${monthNames.map((month, index) => `<span><i class="status-legend-swatch month-color-${index}"></i>${esc(label(month))}</span>`).join('')}
      </div>
      <div class="status-column-plot">
        ${statuses.map((status, index) => `
          <div class="status-column-group" title="${status}: ${totals[index]} appointments">
            <strong class="status-column-total">${totals[index]}</strong>
            <div class="status-column-stack" style="height:${Math.max(3, totals[index] / max * 150)}px">
              ${monthNames.map((month, monthIndex) => counts[status][month] ? `
                <span class="status-column-segment month-color-${monthIndex}" style="height:${counts[status][month] / totals[index] * 100}%" title="${esc(label(month))}: ${counts[status][month]}"></span>
              ` : '').join('')}
            </div>
            <span class="status-column-label">${status}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function procedureBars(appointments) {
  let el = document.getElementById('procedureChart');

  if (!appointments.length) {
    el.innerHTML = '<p class="muted tiny">No records available yet.</p>';
    return;
  }

  let statuses = ['Pending', 'Approved', 'Completed', 'Rejected'];
  let procedures = {};

  appointments.forEach(appointment => {
    let procedure = appointment.procedure || 'Unknown';
    let status = statuses.includes(appointment.status) ? appointment.status : 'Pending';
    procedures[procedure] ||= Object.fromEntries(statuses.map(name => [name, 0]));
    procedures[procedure][status] += 1;
  });

  let entries = Object.entries(procedures)
    .map(([name, counts]) => [name, counts, Object.values(counts).reduce((sum, count) => sum + count, 0)])
    .sort((a, b) => b[2] - a[2]);
  let max = Math.max(1, ...entries.map(([, , total]) => total));

  el.innerHTML = `
    <div class="procedure-bar-chart" aria-label="Appointment requests by procedure and status">
      <div class="procedure-stack-legend">
        ${statuses.map(status => `<span><i class="procedure-legend-swatch status-${status.toLowerCase()}"></i>${status}</span>`).join('')}
      </div>
      <div class="procedure-stack-list">
      ${entries.map(([name, counts, total]) => `
        <div class="procedure-stack-row">
          <span class="procedure-stack-label" title="${esc(name)}">${esc(name)}</span>
          <div class="procedure-stack-track" title="${esc(name)}: ${total} requests">
            <div class="procedure-stack-fill" style="width:${total / max * 100}%">
              ${statuses.filter(status => counts[status]).map(status => `
                <span class="procedure-stack-segment status-${status.toLowerCase()}" style="width:${counts[status] / total * 100}%" title="${status}: ${counts[status]}"></span>
              `).join('')}
            </div>
          </div>
          <strong class="procedure-stack-total">${total}</strong>
        </div>
      `).join('')}
      </div>
    </div>
  `;
}

function renderAnalytics(all) {
  statusColumns(all);
  let completed = all.filter(item => item.status === 'Completed').length;
  let completionRate = all.length ? Math.round(completed / all.length * 100) : 0;
  document.getElementById('appointmentSuccessRate').textContent = `${completionRate}%`;
  document.getElementById('successStatsSummary').textContent = all.length
    ? `${completed} completed out of ${all.length} total appointment records.`
    : 'No completed appointments recorded yet.';
  renderSuccessLineChart(all);

  let m = {};
  let month = {};

  all.forEach(a => {
    m[a.method] = (m[a.method] || 0) + 1;

    let k = a.date ? a.date.slice(0, 7) : 'Unknown';
    month[k] = (month[k] || 0) + 1;
  });

  procedureBars(all);

  paymentPie(
    Object.entries(m).sort((a, b) => b[1] - a[1])
  );

  monthlyColumns(
    Object.entries(month)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-6)
  );
}

function renderSuccessLineChart(appointments) {
  let host = document.getElementById('successLineChart');
  let now = new Date();
  let months = Array.from({ length: 6 }, (_, index) => {
    let month = new Date(now.getFullYear(), now.getMonth() - 5 + index, 1);
    let key = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`;
    let records = appointments.filter(item => item.date && item.date.slice(0, 7) === key);
    let completed = records.filter(item => item.status === 'Completed').length;
    return {
      key,
      label: month.toLocaleDateString(undefined, { month: 'short' }),
      rate: records.length ? Math.round(completed / records.length * 100) : null,
      total: records.length,
      completed
    };
  });
  if (!months.some(month => month.total)) {
    host.innerHTML = '<p class="success-line-empty">Monthly completion trends will appear as appointments are recorded.</p>';
    return;
  }

  let x = index => 44 + index * 88;
  let y = rate => 130 - rate * 1.05;
  let segments = [];
  let segment = [];
  months.forEach((month, index) => {
    if (month.rate === null) {
      if (segment.length) segments.push(segment);
      segment = [];
    } else segment.push(`${x(index)},${y(month.rate)}`);
  });
  if (segment.length) segments.push(segment);

  host.innerHTML = `
    <svg viewBox="0 0 520 184" role="img" aria-label="Monthly appointment completion rate line graph">
      <g class="success-chart-grid">
        <line x1="44" y1="25" x2="484" y2="25"></line><line x1="44" y1="77.5" x2="484" y2="77.5"></line><line x1="44" y1="130" x2="484" y2="130"></line>
      </g>
      <g class="success-chart-axis-labels"><text x="6" y="29">100%</text><text x="15" y="81">50%</text><text x="25" y="134">0%</text></g>
      ${segments.map(points => `<polyline class="success-chart-line" points="${points.join(' ')}"></polyline>`).join('')}
      ${months.map((month, index) => `
        <text class="success-chart-month" x="${x(index)}" y="158" text-anchor="middle">${esc(month.label)}</text>
        ${month.rate === null ? '' : `<circle class="success-chart-point" cx="${x(index)}" cy="${y(month.rate)}" r="4"><title>${esc(month.label)}: ${month.rate}% (${month.completed}/${month.total})</title></circle>`}
      `).join('')}
    </svg>
  `;
}

function exportCsv() {
  let rows = [
    [
      'Patient',
      'Email',
      'Procedure',
      'Date',
      'Time',
      'Payment Method',
      'Payment Status',
      'Appointment Status',
      'Note'
    ],
    ...appts().map(a => [
      a.patientName,
      a.email,
      a.procedure,
      a.date,
      a.time,
      a.method,
      a.paymentStatus,
      a.status,
      a.note || ''
    ])
  ];

  let csv = rows
    .map(r =>
      r.map(v =>
        '"' + String(v ?? '').replace(/"/g, '""') + '"'
      ).join(',')
    )
    .join('\r\n');

  let url = URL.createObjectURL(
    new Blob([csv], { type: 'text/csv;charset=utf-8' })
  );

  let a = document.createElement('a');
  a.href = url;
  a.download = 'angelica-edralin-dental-clinic-appointments.csv';
  a.click();

  URL.revokeObjectURL(url);
}
