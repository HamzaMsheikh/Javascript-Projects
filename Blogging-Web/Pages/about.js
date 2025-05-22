document.addEventListener("DOMContentLoaded", () => {
    // Navbar toggle logic
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
        });
    }

    // Sync mobile menu Login/Logout with desktop
    const loginNavItem = document.getElementById('loginNavItem');
    const logoutNavItem = document.getElementById('logoutNavItem');
    const loginNavItemMobile = document.getElementById('loginNavItemMobile');
    const logoutNavItemMobile = document.getElementById('logoutNavItemMobile');
    const observer = new MutationObserver(() => {
        if (loginNavItemMobile && logoutNavItemMobile) {
            loginNavItemMobile.classList.toggle('hidden', loginNavItem.classList.contains('hidden'));
            logoutNavItemMobile.classList.toggle('hidden', logoutNavItem.classList.contains('hidden'));
        }
    });
    if (loginNavItem && logoutNavItem) {
        observer.observe(loginNavItem, { attributes: true });
        observer.observe(logoutNavItem, { attributes: true });
    }
});