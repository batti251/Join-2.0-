/**
 * Function to load correct header and nav by initiation
 *
 */
async function init() {
  w3.includeHTML(() => {
    userInitials(), setNavBackgroundColor();
  });
}

/**
 * This Function renders correct user names Initials into the users-icon-menu
 *
 */
function userInitials() {
  let initials = document.getElementById("profile-initials");
  let sessionInititals = sessionStorage.getItem("initials") || "G";
  checkLoginStatus();
  initials.innerHTML = sessionInititals;
}

/**
 * This Function renders navbar, according to the users login status
 *
 */
function checkLoginStatus() {
  let previousLink = document.referrer;
  let visitor = sessionStorage.getItem("user");
  let navLinks = document.querySelectorAll(".nav-link");
  let profile = document.querySelector(".header-user");
  if (visitor == null) {
    profile.classList.add("d-none");
    for (let i = 0; i <= 3; i++) {
      navLinks[i].classList.add("d-none");
    }
    navLinks[4].classList.remove("d-none");
  }
  checkWorkaround(previousLink, visitor);
}

/**
 * This function checks, if user tries to get access to board without using the login page
 *
 * @param {String}} previousLink sets the previous active link from the tab
 * @param {String} visitor indicator for active user/ valid Guest or unallowed access
 */
function checkWorkaround(previousLink, visitor) {
  if (visitor == null && !previousLink) {
    location.href = "../index.html";
  }
}

/**
 * This Function highlights current active board-tab
 *
 */
function setNavBackgroundColor() {
  let activePage = window.location.pathname;
  let links = document.getElementsByClassName("nav-link");
  let activeLink = [...links].filter((l) => l.href.includes(activePage));
  [...links].forEach((e) => e.classList.remove("active"));
  activeLink.forEach((e) => e.classList.add("active"));
}

/**
 * Deletes SessionStorage
 *
 */
function deleteSessionStorage() {
  sessionStorage.clear();
}

/**
 * This function toggles the dropdown menu from the users-icon-menu in the header
 *
 */
function toggleDropdown() {
  let dropdown = document.querySelector(".dropdown-menu-container");
  dropdown.classList.toggle("d-none");
  dropdown.classList.toggle('z-index-1');
}

/**
 * This function removes opened dropdown menu, when clicked outside the menu
 *
 */
document.addEventListener("click", function (event) {
  const dropdownWrap = document.querySelector(".dropdown-menu-container");
  const profileBadge = document.querySelector(".profile-ellipse");
  if (
    dropdownWrap &&
    !dropdownWrap.contains(event.target) &&
    !profileBadge.contains(event.target)
  ) {
    dropdownWrap.classList.add("d-none");
  }
});
