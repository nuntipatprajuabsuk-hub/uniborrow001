(function () {
    "use strict";

    const store = window.UniBorrowStore;
    const i18n = window.UniBorrowI18n;

    function escapeHtml(value) {
        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function imageSrc(image) {
        if (String(image).startsWith("data:image/")) return image;
        const safeName = /^[a-z0-9._-]+$/i.test(String(image)) ? image : "powerstrip.svg";
        return `../img/${safeName}`;
    }

    function formatDate(value, options) {
        if (!value) return "Not specified";
        const date = new Date(`${String(value).slice(0, 10)}T12:00:00`);
        if (Number.isNaN(date.getTime())) return escapeHtml(value);
        return new Intl.DateTimeFormat(i18n.locale(), options || { day: "numeric", month: "short", year: "numeric" }).format(date);
    }

    function formatRelativeDate(value) {
        const timestamp = new Date(value).getTime();
        if (Number.isNaN(timestamp)) return "Recently";
        const days = Math.round((timestamp - Date.now()) / 86400000);
        if (days === 0) return "Today";
        if (days === -1) return "Yesterday";
        if (days === 1) return "Tomorrow";
        return formatDate(value);
    }

    function statusMeta(status) {
        const labels = {
            available: i18n.t("Available", "พร้อมให้ยืม"),
            unavailable: i18n.t("Paused", "หยุดให้ยืม"),
            borrowed: i18n.t("Borrowed", "ถูกยืมแล้ว"),
            pending: i18n.t("Pending", "รออนุมัติ"),
            active: i18n.t("Currently borrowing", "กำลังยืม"),
            return_requested: i18n.t("Return pending", "รอยืนยันการคืน"),
            completed: i18n.t("Completed", "เสร็จสิ้น"),
            rejected: i18n.t("Rejected", "ถูกปฏิเสธ"),
            cancelled: i18n.t("Cancelled", "ยกเลิกแล้ว")
        };
        return { label: labels[status] || status, className: `status-${status}` };
    }

    function getUser(userId) {
        return store.getState().users.find((user) => user.id === userId) || null;
    }

    function itemCard(item) {
        const owner = getUser(item.ownerId);
        const status = statusMeta(item.status);
        const rating = item.rating ? `★ ${item.rating.toFixed(1)}` : "New listing";
        const featured = item.featuredUntil && item.featuredUntil >= new Date().toISOString().slice(0, 10);
        const price = item.rentalType === "paid"
            ? `${i18n.currency(item.pricePerDay)}${i18n.t("/day", "/วัน")}`
            : i18n.t("Free", "ยืมฟรี");
        return `
            <article class="item-card ${featured ? "featured-card" : ""}">
                <a href="item-detail.html?id=${encodeURIComponent(item.id)}" class="item-card-link">
                    <div class="item-image">${featured ? `<span class="featured-badge">★ ${i18n.t("Featured", "แนะนำ")}</span>` : ""}<img src="${imageSrc(item.image)}" alt="${escapeHtml(item.name)}"></div>
                    <div class="item-content">
                        <div class="item-kicker"><span>${escapeHtml(item.category)}</span><span class="status-pill ${status.className}">${status.label}</span></div>
                        <h3>${escapeHtml(item.name)}</h3>
                        <p class="item-owner">by ${escapeHtml(owner ? owner.name : "Unknown owner")}</p>
                        <div class="price-line"><strong>${price}</strong>${item.deposit ? `<span>${i18n.t("Deposit", "ประกัน")} ${i18n.currency(item.deposit)}</span>` : ""}</div>
                        <div class="item-meta"><span>${rating}</span><span>Until ${formatDate(item.availableUntil, { day: "numeric", month: "short" })}</span></div>
                    </div>
                </a>
            </article>`;
    }

    function emptyState(title, description, actionHtml) {
        return `<div class="empty-state"><div class="empty-icon">○</div><h3>${escapeHtml(title)}</h3><p>${escapeHtml(description)}</p>${actionHtml || ""}</div>`;
    }

    function toast(message, type) {
        let region = document.getElementById("toastRegion");
        if (!region) {
            region = document.createElement("div");
            region.id = "toastRegion";
            region.className = "toast-region";
            region.setAttribute("aria-live", "polite");
            document.body.appendChild(region);
        }
        const element = document.createElement("div");
        element.className = `toast ${type === "error" ? "toast-error" : "toast-success"}`;
        element.textContent = message;
        region.appendChild(element);
        window.setTimeout(() => element.classList.add("show"), 10);
        window.setTimeout(() => {
            element.classList.remove("show");
            window.setTimeout(() => element.remove(), 250);
        }, 3200);
    }

    function renderHeader() {
        const target = document.getElementById("siteHeader");
        if (!target) return;
        const state = store.getState();
        const user = store.getCurrentUser();
        const allNotifications = user
            ? state.notifications.filter((notification) => notification.userId === user.id)
            : [];
        const notifications = allNotifications.slice(0, 6);
        const unread = allNotifications.filter((notification) => !notification.read).length;
        const notificationItems = notifications.length
            ? notifications.map((notification) => `
                <a class="notification-item ${notification.read ? "" : "unread"}" href="${escapeHtml(notification.href)}" data-notification-id="${escapeHtml(notification.id)}">
                    <strong>${escapeHtml(notification.title)}</strong>
                    <span>${escapeHtml(notification.message)}</span>
                    <small>${formatRelativeDate(notification.createdAt)}</small>
                </a>`).join("")
            : `<div class="notification-empty">No notifications yet.</div>`;

        target.className = "navbar";
        target.innerHTML = `
            <div class="container navbar-inner">
                <a href="index.html" class="logo" aria-label="UniBorrow home"><span class="logo-mark">U</span>UniBorrow</a>
                <button class="menu-button" id="menuButton" type="button" aria-expanded="false" aria-controls="mainNavigation">Menu</button>
                <nav class="nav-links" id="mainNavigation" aria-label="Main navigation">
                    <a href="browse.html">Browse</a>
                    <a href="my-items.html">My Items</a>
                    <a href="my-borrowings.html">My Borrowings</a>
                    <a href="business.html">Business</a>
                </nav>
                <div class="nav-actions">
                    <button class="language-button" id="languageButton" type="button" aria-label="Switch language">${i18n.getLanguage() === "th" ? "EN" : "ไทย"}</button>
                    ${user ? `
                        <div class="notification-wrap">
                            <button class="icon-button" id="notificationButton" type="button" aria-label="Notifications" aria-expanded="false">🔔${unread ? `<span class="notification-badge">${unread}</span>` : ""}</button>
                            <div class="notification-popover" id="notificationPopover" hidden>
                                <div class="popover-header"><strong>Notifications</strong>${unread ? `<button type="button" id="markAllRead">Mark all read</button>` : ""}</div>
                                <div>${notificationItems}</div>
                            </div>
                        </div>
                        <a href="profile.html" class="profile-button"><span class="mini-avatar">${escapeHtml(user.name.charAt(0).toUpperCase())}</span><span>${escapeHtml(user.name.split(" ")[0])}${user.plan === "pro" ? `<small class="pro-mini">PRO</small>` : ""}</span></a>
                    ` : `
                        <a href="login.html" class="text-link">Log in</a>
                        <a href="register.html" class="primary-button compact">Create account</a>
                    `}
                </div>
            </div>`;

        const menuButton = document.getElementById("menuButton");
        const navigation = document.getElementById("mainNavigation");
        menuButton.addEventListener("click", () => {
            const open = navigation.classList.toggle("open");
            menuButton.setAttribute("aria-expanded", String(open));
        });

        document.getElementById("languageButton").addEventListener("click", () => {
            i18n.setLanguage(i18n.getLanguage() === "th" ? "en" : "th");
        });

        const notificationButton = document.getElementById("notificationButton");
        const popover = document.getElementById("notificationPopover");
        if (notificationButton && popover) {
            notificationButton.addEventListener("click", () => {
                const willOpen = popover.hidden;
                popover.hidden = !willOpen;
                notificationButton.setAttribute("aria-expanded", String(willOpen));
            });
            popover.querySelectorAll("[data-notification-id]").forEach((link) => {
                link.addEventListener("click", () => store.markNotificationRead(link.dataset.notificationId));
            });
            document.getElementById("markAllRead")?.addEventListener("click", () => {
                store.markAllNotificationsRead();
                renderHeader();
            });
        }

        const file = window.location.pathname.split("/").pop() || "index.html";
        target.querySelectorAll("a[href]").forEach((link) => {
            if (link.getAttribute("href").split("?")[0] === file) link.setAttribute("aria-current", "page");
        });
    }

    function renderFooter() {
        const target = document.getElementById("siteFooter");
        if (!target) return;
        target.className = "footer";
        target.innerHTML = `
            <div class="container footer-inner">
                <div><strong>UniBorrow</strong><p>Campus Item Sharing Platform</p></div>
                <div class="footer-note"><span>University demonstration project</span><span>© ${new Date().getFullYear()} UniBorrow</span></div>
            </div>`;
    }

    function renderAuthGate(title) {
        const main = document.getElementById("appMain");
        const returnPath = `${window.location.pathname.split("/").pop()}${window.location.search}`;
        main.innerHTML = `
            <section class="container auth-gate">
                <span class="section-label">Members only</span>
                <h1>${escapeHtml(title)}</h1>
                <p>Log in with a demo account or create a university account to continue.</p>
                <div class="button-row"><a class="primary-button" href="login.html?return=${encodeURIComponent(returnPath)}">Log in</a><a class="secondary-button" href="register.html">Create account</a></div>
            </section>`;
    }

    window.UniBorrowUI = {
        escapeHtml,
        imageSrc,
        formatDate,
        formatRelativeDate,
        statusMeta,
        formatCurrency: i18n.currency,
        getUser,
        itemCard,
        emptyState,
        toast,
        renderHeader,
        renderFooter,
        renderAuthGate
    };

    document.addEventListener("click", (event) => {
        const popover = document.getElementById("notificationPopover");
        const button = document.getElementById("notificationButton");
        if (popover && button && !event.target.closest(".notification-wrap")) {
            popover.hidden = true;
            button.setAttribute("aria-expanded", "false");
        }
    });
})();
