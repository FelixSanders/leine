function showContactPage(pageId) {
    const pages = document.querySelectorAll('.contact-page');
    pages.forEach(page => page.classList.remove('active'));

    document.getElementById(pageId).classList.add('active');

    const container = document.querySelector('.contact-container');
    container.classList.add('active');
}