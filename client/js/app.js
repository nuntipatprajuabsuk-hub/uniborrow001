(function () {
    "use strict";

    const ui = window.UniBorrowUI;
    const pages = window.UniBorrowPages;

    function render() {
        ui.renderHeader();
        ui.renderFooter();
        const renderer = pages[document.body.dataset.page];
        if (renderer) renderer();
        else document.getElementById("appMain").innerHTML = `<section class="container page-section">Page not found.</section>`;
        window.UniBorrowI18n.apply(document.body);
    }

    document.addEventListener("DOMContentLoaded", render);
    window.addEventListener("uniborrow:change", render);
    window.addEventListener("uniborrow:language", render);
})();
