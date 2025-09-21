// script.js (Keep only one session check block and reuse it to prevent multiple redirects)

function checkSessionAndUpdateUI() {
  fetch('/me')
    .then(res => res.json())
    .then(data => {
      if (data.loggedIn) {
        const name = data.user.name;
        const email = data.user.email;

        // Update multiple places if elements exist
        const content = document.getElementById('content');
        if (content) {
          content.innerHTML = `
            <h3>Hello, ${name}!</h3>
            <p>Email: ${email}</p>
            <button onclick="logout()">Logout</button>
          `;
        }

        const userName = document.getElementById('userName');
        if (userName) userName.textContent = name;

        const userName2 = document.getElementById('userName2');
        if (userName2) userName2.textContent = name;

        const userEmail = document.getElementById('userEmail');
        if (userEmail) userEmail.textContent = email;

        const profileName = document.getElementById('profileName');
        if (profileName) profileName.textContent = name;

        const dropdownName = document.getElementById('dropdownName');
        if (dropdownName) dropdownName.textContent = name;

        const dropdownEmail = document.getElementById('dropdownEmail');
        if (dropdownEmail) dropdownEmail.textContent = email;

        const profileEmailMain = document.getElementById('profileEmail');
        if (profileEmailMain) profileEmailMain.textContent = email;

        const profileAvatar = document.getElementById('profileAvatar');
        if (profileAvatar) profileAvatar.textContent = name.charAt(0).toUpperCase();

        const userAvatar = document.getElementById('userAvatar');
        if (userAvatar) userAvatar.textContent = name.charAt(0).toUpperCase();

        const profileEnrolled = document.getElementById('profileEnrolled');
        if (profileEnrolled) profileEnrolled.textContent = 5;

        const profileCompleted = document.getElementById('profileCompleted');
        if (profileCompleted) profileCompleted.textContent = 3;

        const profileHours = document.getElementById('profileHours');
        if (profileHours) profileHours.textContent = 12;

        const enrolledCoursesList = document.getElementById('enrolledCoursesList');
        if (enrolledCoursesList) {
          enrolledCoursesList.innerHTML = `
            <div class="course">Frontend Development</div>
            <div class="course">Java Basics</div>
            <div class="course">Data Structures</div>
          `;
        }

      } else {
        // Redirect only if needed
        const path = window.location.pathname;
        if (!path.endsWith('index.html') && !path.endsWith('login.html')) {
          window.location.href = 'index.html';
        } else {
          const content = document.getElementById('content');
          if (content) {
            content.innerHTML = `
              <button onclick="window.location.href='login.html'">Login / Signup</button>
            `;
          }
        }
      }
    })
    .catch(err => console.error('Session fetch error:', err));
}

checkSessionAndUpdateUI();

const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}

function logout() {
  fetch('/logout')
    .then(() => window.location.href = 'index.html');
}
