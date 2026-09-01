(function () {
    "use strict";

    const store = window.UniBorrowStore;
    const ui = window.UniBorrowUI;

    function main() {
        return document.getElementById("appMain");
    }

    function today() {
        return new Date().toISOString().slice(0, 10);
    }

    function handle(action, successMessage) {
        try {
            const result = action();
            if (successMessage) ui.toast(successMessage);
            return result;
        } catch (error) {
            ui.toast(error.message || "Something went wrong.", "error");
            return null;
        }
    }

    function setFormError(form, message) {
        const error = form.querySelector(".form-error");
        if (error) {
            error.textContent = message || "";
            error.hidden = !message;
        }
    }

    function renderHome() {
        const state = store.getState();
        const categories = store.categories.filter((category) => category !== "Study");
        const categoryIcons = { Books: "📚", Electronics: "💻", Tools: "🛠️", Equipment: "📷", Sports: "⚽", Others: "📦" };
        const popular = [...state.items].sort((a, b) => b.rating - a.rating).slice(0, 4);
        main().innerHTML = `
            <section class="hero">
                <div class="container hero-grid">
                    <div class="hero-content">
                        <span class="eyebrow">Campus sharing made simple</span>
                        <h1>Borrow more.<br><span>Buy less.</span></h1>
                        <p>Find useful items from students around campus, send a request, and keep every borrowing in one place.</p>
                        <form class="search-box" id="homeSearch">
                            <label class="sr-only" for="homeSearchInput">Search items</label>
                            <input type="search" id="homeSearchInput" placeholder="What do you need today?" autocomplete="off">
                            <button type="submit">Search items</button>
                        </form>
                        <div class="hero-proof"><strong>${state.items.length}</strong> items shared <span>•</span> <strong>${state.requests.filter((request) => request.status === "completed").length + 24}</strong> successful returns</div>
                    </div>
                    <div class="hero-panel" aria-label="How UniBorrow works">
                        <span class="panel-label">Three simple steps</span>
                        <ol>
                            <li><span>01</span><div><strong>Find an item</strong><small>Search by name or category</small></div></li>
                            <li><span>02</span><div><strong>Send a request</strong><small>Choose the borrowing dates</small></div></li>
                            <li><span>03</span><div><strong>Return on time</strong><small>Keep your campus trusted</small></div></li>
                        </ol>
                    </div>
                </div>
            </section>
            <section class="section">
                <div class="container">
                    <div class="section-header"><div><span class="section-label">Explore</span><h2>Browse by category</h2></div><a class="view-all" href="browse.html">View all items →</a></div>
                    <div class="categories">${categories.map((category) => {
                        const count = state.items.filter((item) => item.category === category).length;
                        return `<a class="category-card" href="browse.html?category=${encodeURIComponent(category)}"><span class="category-icon">${categoryIcons[category]}</span><span><strong>${category}</strong><small>${count} item${count === 1 ? "" : "s"}</small></span></a>`;
                    }).join("")}</div>
                </div>
            </section>
            <section class="section popular-section">
                <div class="container">
                    <div class="section-header"><div><span class="section-label">Popular now</span><h2>Items students recommend</h2></div></div>
                    <div class="items-grid">${popular.map(ui.itemCard).join("")}</div>
                </div>
            </section>
            <section class="cta-section">
                <div class="container"><div class="cta"><div><span class="section-label">Have something useful?</span><h2>Turn unused items into campus resources.</h2><p>List an item in a minute and manage every request from My Items.</p></div><a href="add-item.html" class="primary-button">List an item</a></div></div>
            </section>`;

        document.getElementById("homeSearch").addEventListener("submit", (event) => {
            event.preventDefault();
            const query = document.getElementById("homeSearchInput").value.trim();
            window.location.href = query ? `browse.html?search=${encodeURIComponent(query)}` : "browse.html";
        });
    }

    function renderBrowse() {
        const state = store.getState();
        const params = new URLSearchParams(window.location.search);
        const initialSearch = params.get("search") || "";
        const initialCategory = params.get("category") || "";
        main().innerHTML = `
            <section class="container page-section">
                <div class="page-header"><span class="section-label">Browse</span><h1>Find something useful</h1><p>Search the campus collection and check availability before requesting.</p></div>
                <div class="filter-bar" aria-label="Item filters">
                    <div class="filter-search"><label class="sr-only" for="browseSearch">Search items</label><input type="search" id="browseSearch" placeholder="Search name, category or description" value="${ui.escapeHtml(initialSearch)}"></div>
                    <div><label class="sr-only" for="categoryFilter">Category</label><select id="categoryFilter"><option value="">All categories</option>${store.categories.map((category) => `<option ${category.toLowerCase() === initialCategory.toLowerCase() ? "selected" : ""}>${category}</option>`).join("")}</select></div>
                    <div><label class="sr-only" for="statusFilter">Availability</label><select id="statusFilter"><option value="">All statuses</option><option value="available">Available</option><option value="borrowed">Borrowed</option><option value="unavailable">Paused</option></select></div>
                </div>
                <div class="result-bar"><strong id="resultCount"></strong><button type="button" class="text-button" id="clearFilters">Clear filters</button></div>
                <div class="items-grid" id="browseGrid"></div>
            </section>`;

        const search = document.getElementById("browseSearch");
        const category = document.getElementById("categoryFilter");
        const status = document.getElementById("statusFilter");
        const grid = document.getElementById("browseGrid");
        const count = document.getElementById("resultCount");

        function applyFilters() {
            const query = search.value.trim().toLowerCase();
            const filtered = state.items.filter((item) => {
                const owner = state.users.find((user) => user.id === item.ownerId);
                const haystack = `${item.name} ${item.category} ${item.description} ${owner ? owner.name : ""}`.toLowerCase();
                return (!query || haystack.includes(query)) && (!category.value || item.category === category.value) && (!status.value || item.status === status.value);
            });
            count.textContent = `${filtered.length} item${filtered.length === 1 ? "" : "s"} found`;
            grid.innerHTML = filtered.length
                ? filtered.map(ui.itemCard).join("")
                : ui.emptyState("No matching items", "Try another keyword or clear the filters.", `<button class="secondary-button" type="button" id="emptyClear">Clear filters</button>`);
            document.getElementById("emptyClear")?.addEventListener("click", clearFilters);
        }

        function clearFilters() {
            search.value = "";
            category.value = "";
            status.value = "";
            window.history.replaceState({}, "", "browse.html");
            applyFilters();
        }

        [search, category, status].forEach((control) => control.addEventListener(control.tagName === "INPUT" ? "input" : "change", applyFilters));
        document.getElementById("clearFilters").addEventListener("click", clearFilters);
        applyFilters();
    }

    function renderItemDetail() {
        const state = store.getState();
        const user = store.getCurrentUser();
        const id = new URLSearchParams(window.location.search).get("id");
        const item = state.items.find((candidate) => candidate.id === id);
        if (!item) {
            main().innerHTML = `<section class="container page-section">${ui.emptyState("Item not found", "This listing may have been removed.", `<a class="primary-button" href="browse.html">Back to Browse</a>`)}</section>`;
            return;
        }
        const owner = state.users.find((candidate) => candidate.id === item.ownerId);
        const status = ui.statusMeta(item.status);
        const openRequest = user ? state.requests.find((request) => request.itemId === item.id && request.borrowerId === user.id && ["pending", "active", "return_requested"].includes(request.status)) : null;
        let actionHtml;
        if (user && user.id === item.ownerId) {
            actionHtml = `<a class="primary-button full-width" href="add-item.html?id=${encodeURIComponent(item.id)}">Manage this item</a>`;
        } else if (openRequest) {
            const requestStatus = ui.statusMeta(openRequest.status);
            actionHtml = `<button class="full-button" type="button" disabled>${requestStatus.label}</button><p class="action-note">Track this request in <a href="my-borrowings.html">My Borrowings</a>.</p>`;
        } else if (item.status === "available") {
            actionHtml = `<button class="full-button" type="button" id="requestButton">Request to borrow</button>`;
        } else {
            actionHtml = `<button class="full-button" type="button" disabled>Not available right now</button>`;
        }
        main().innerHTML = `
            <section class="container">
                <nav class="breadcrumb" aria-label="Breadcrumb"><a href="browse.html">Browse</a><span>/</span><span>${ui.escapeHtml(item.name)}</span></nav>
                <div class="detail-layout">
                    <div class="detail-image"><img src="${ui.imageSrc(item.image)}" alt="${ui.escapeHtml(item.name)}"></div>
                    <div class="detail-panel">
                        <div class="item-kicker"><span>${ui.escapeHtml(item.category)}</span><span class="status-pill ${status.className}">${status.label}</span></div>
                        <h1 class="detail-title">${ui.escapeHtml(item.name)}</h1>
                        <div class="detail-meta"><span>${item.rating ? `★ ${item.rating.toFixed(1)} rating` : "New listing"}</span><span>Listed ${ui.formatRelativeDate(item.createdAt)}</span></div>
                        <div class="owner-box"><div class="avatar">${ui.escapeHtml(owner ? owner.name.charAt(0) : "?")}</div><div><strong>${ui.escapeHtml(owner ? owner.name : "Unknown owner")}</strong><span>${ui.escapeHtml(owner ? owner.faculty : "")}</span></div></div>
                        <div class="detail-copy"><h2>Description</h2><p>${ui.escapeHtml(item.description)}</p></div>
                        <div class="availability-card"><div><span>Available from</span><strong>${ui.formatDate(item.availableFrom)}</strong></div><div><span>Available until</span><strong>${ui.formatDate(item.availableUntil)}</strong></div></div>
                        <div class="detail-actions">${actionHtml}</div>
                    </div>
                </div>
            </section>
            <dialog class="modal" id="borrowDialog">
                <form method="dialog" class="modal-card" id="borrowForm">
                    <div class="modal-header"><div><span class="section-label">Borrowing request</span><h2>${ui.escapeHtml(item.name)}</h2></div><button class="icon-button" value="cancel" aria-label="Close">×</button></div>
                    <p class="form-error" role="alert" hidden></p>
                    <div class="form-grid two"><div class="field"><label for="startDate">Start date</label><input id="startDate" name="startDate" type="date" min="${today()}" required></div><div class="field"><label for="endDate">Return date</label><input id="endDate" name="endDate" type="date" min="${today()}" required></div></div>
                    <div class="field"><label for="requestMessage">Message to owner</label><textarea id="requestMessage" name="message" maxlength="240" placeholder="Tell the owner what you need it for"></textarea></div>
                    <div class="modal-actions"><button class="secondary-button" value="cancel">Cancel</button><button class="primary-button" type="submit" value="submit">Send request</button></div>
                </form>
            </dialog>`;

        const requestButton = document.getElementById("requestButton");
        const dialog = document.getElementById("borrowDialog");
        requestButton?.addEventListener("click", () => {
            if (!user) {
                const returnPath = `item-detail.html?id=${encodeURIComponent(item.id)}`;
                window.location.href = `login.html?return=${encodeURIComponent(returnPath)}`;
                return;
            }
            dialog.showModal();
        });
        document.getElementById("borrowForm")?.addEventListener("submit", (event) => {
            if (event.submitter?.value !== "submit") return;
            event.preventDefault();
            const form = event.currentTarget;
            const data = new FormData(form);
            const result = handle(() => store.requestBorrow(item.id, {
                startDate: data.get("startDate"),
                endDate: data.get("endDate"),
                message: data.get("message") || ""
            }));
            if (result) {
                dialog.close();
                ui.toast("Borrowing request sent.");
            }
        });
    }

    function renderLogin() {
        const user = store.getCurrentUser();
        const returnPath = new URLSearchParams(window.location.search).get("return") || "index.html";
        main().innerHTML = `
            <section class="auth-layout container">
                <div class="auth-intro"><span class="eyebrow">Welcome back</span><h1>Continue sharing on campus.</h1><p>Use your account to request items, manage listings, and track returns.</p><div class="demo-card"><strong>Demo account</strong><code>tawan@uniborrow.ac.th</code><code>demo1234</code><button type="button" class="text-button" id="fillDemo">Fill demo login</button></div></div>
                <div class="form-card"><span class="section-label">Member login</span><h2>Log in to UniBorrow</h2>${user ? `<div class="notice">You are currently logged in as ${ui.escapeHtml(user.name)}.</div>` : ""}<form id="loginForm"><p class="form-error" role="alert" hidden></p><div class="field"><label for="email">University email</label><input type="email" id="email" name="email" autocomplete="email" required></div><div class="field"><label for="password">Password</label><input type="password" id="password" name="password" autocomplete="current-password" required></div><button type="submit" class="full-button">Log in</button></form><p class="form-note">New to UniBorrow? <a href="register.html">Create an account</a></p></div>
            </section>`;
        document.getElementById("fillDemo").addEventListener("click", () => {
            document.getElementById("email").value = "tawan@uniborrow.ac.th";
            document.getElementById("password").value = "demo1234";
        });
        document.getElementById("loginForm").addEventListener("submit", (event) => {
            event.preventDefault();
            const form = event.currentTarget;
            const data = new FormData(form);
            setFormError(form, "");
            try {
                store.login(data.get("email"), data.get("password"));
                const safeReturn = !returnPath.includes("://") && !returnPath.startsWith("//") && !returnPath.includes("..") ? returnPath : "index.html";
                window.location.href = safeReturn;
            } catch (error) {
                setFormError(form, error.message);
            }
        });
    }

    function renderRegister() {
        main().innerHTML = `
            <section class="auth-layout container">
                <div class="auth-intro"><span class="eyebrow">Join the community</span><h1>Share resources, not extra expenses.</h1><p>Create a demo university account and start borrowing or listing items immediately.</p><ul class="check-list"><li>Track every request</li><li>Manage lending status</li><li>Keep a borrowing history</li></ul></div>
                <div class="form-card"><span class="section-label">Create account</span><h2>Your student profile</h2><form id="registerForm"><p class="form-error" role="alert" hidden></p><div class="field"><label for="name">Full name</label><input id="name" name="name" autocomplete="name" required></div><div class="form-grid two"><div class="field"><label for="studentId">Student ID</label><input id="studentId" name="studentId" required></div><div class="field"><label for="faculty">Faculty</label><input id="faculty" name="faculty" required></div></div><div class="field"><label for="email">University email</label><input type="email" id="email" name="email" placeholder="name@university.ac.th" autocomplete="email" required><small>Use an address ending in .ac.th or .edu</small></div><div class="form-grid two"><div class="field"><label for="password">Password</label><input type="password" id="password" name="password" minlength="8" autocomplete="new-password" required></div><div class="field"><label for="confirmPassword">Confirm password</label><input type="password" id="confirmPassword" name="confirmPassword" minlength="8" autocomplete="new-password" required></div></div><button type="submit" class="full-button">Create account</button></form><p class="form-note">Already a member? <a href="login.html">Log in</a></p></div>
            </section>`;
        document.getElementById("registerForm").addEventListener("submit", (event) => {
            event.preventDefault();
            const form = event.currentTarget;
            const data = Object.fromEntries(new FormData(form));
            setFormError(form, "");
            if (data.password !== data.confirmPassword) {
                setFormError(form, "Passwords do not match.");
                return;
            }
            try {
                store.register(data);
                window.location.href = "index.html";
            } catch (error) {
                setFormError(form, error.message);
            }
        });
    }

    function renderAddItem() {
        const user = store.getCurrentUser();
        if (!user) {
            ui.renderAuthGate("List and manage your items");
            return;
        }
        const state = store.getState();
        const editId = new URLSearchParams(window.location.search).get("id");
        const item = editId ? state.items.find((candidate) => candidate.id === editId && candidate.ownerId === user.id) : null;
        if (editId && !item) {
            main().innerHTML = `<section class="container page-section">${ui.emptyState("Item not found", "You can only edit items that you own.", `<a class="primary-button" href="my-items.html">Back to My Items</a>`)}</section>`;
            return;
        }
        const isEditing = Boolean(item);
        let selectedImage = item ? item.image : "";
        main().innerHTML = `
            <section class="container narrow-page page-section">
                <div class="page-header"><span class="section-label">My Items</span><h1>${isEditing ? "Edit item" : "List a new item"}</h1><p>Use clear details so borrowers know exactly what they will receive.</p></div>
                <form class="form-card wide" id="itemForm">
                    <p class="form-error" role="alert" hidden></p>
                    <div class="field"><label for="itemName">Item name</label><input id="itemName" name="name" maxlength="80" value="${ui.escapeHtml(item ? item.name : "")}" required></div>
                    <div class="field"><label for="itemCategory">Category</label><select id="itemCategory" name="category">${store.categories.map((category) => `<option ${item?.category === category ? "selected" : ""}>${category}</option>`).join("")}</select></div>
                    <div class="field"><label for="itemDescription">Description</label><textarea id="itemDescription" name="description" maxlength="500" required>${ui.escapeHtml(item ? item.description : "")}</textarea><small>Condition, included accessories, and any usage notes.</small></div>
                    <div class="field"><label for="itemImage">Item image</label><div class="upload-control"><div class="upload-preview" id="imagePreview">${item ? `<img src="${ui.imageSrc(item.image)}" alt="Current item image">` : `<span>No image selected</span>`}</div><div><input type="file" id="itemImage" accept="image/png,image/jpeg,image/webp,image/svg+xml"><small>PNG, JPG, WEBP or SVG up to 750 KB. If omitted, a sample image is used.</small></div></div></div>
                    <div class="form-grid two"><div class="field"><label for="availableFrom">Available from</label><input type="date" id="availableFrom" name="availableFrom" value="${item?.availableFrom || today()}" required></div><div class="field"><label for="availableUntil">Available until</label><input type="date" id="availableUntil" name="availableUntil" value="${item?.availableUntil || ""}" required></div></div>
                    <div class="form-actions"><a class="secondary-button" href="my-items.html">Cancel</a><button type="submit" class="primary-button">${isEditing ? "Save changes" : "List item"}</button></div>
                </form>
            </section>`;
        const imageInput = document.getElementById("itemImage");
        imageInput.addEventListener("change", () => {
            const file = imageInput.files[0];
            if (!file) return;
            if (!file.type.startsWith("image/") || file.size > 750 * 1024) {
                imageInput.value = "";
                ui.toast("Choose an image smaller than 750 KB.", "error");
                return;
            }
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                selectedImage = reader.result;
                document.getElementById("imagePreview").innerHTML = `<img src="${selectedImage}" alt="Selected item preview">`;
            });
            reader.readAsDataURL(file);
        });
        document.getElementById("itemForm").addEventListener("submit", (event) => {
            event.preventDefault();
            const form = event.currentTarget;
            const data = Object.fromEntries(new FormData(form));
            data.image = selectedImage;
            setFormError(form, "");
            try {
                if (isEditing) store.updateItem(item.id, data);
                else store.createItem(data);
                window.location.href = "my-items.html";
            } catch (error) {
                setFormError(form, error.message);
            }
        });
    }

    function renderMyItems() {
        const user = store.getCurrentUser();
        if (!user) {
            ui.renderAuthGate("Manage your listed items");
            return;
        }
        const state = store.getState();
        const items = state.items.filter((item) => item.ownerId === user.id);
        const itemRows = items.map((item) => {
            const requests = state.requests.filter((request) => request.itemId === item.id && ["pending", "active", "return_requested"].includes(request.status));
            const pending = requests.filter((request) => request.status === "pending");
            const active = requests.find((request) => ["active", "return_requested"].includes(request.status));
            const status = ui.statusMeta(item.status);
            const requestHtml = pending.map((request) => {
                const borrower = state.users.find((candidate) => candidate.id === request.borrowerId);
                return `<div class="request-card"><div><span class="status-pill status-pending">Pending request</span><strong>${ui.escapeHtml(borrower?.name || "Student")}</strong><p>${ui.formatDate(request.startDate)} – ${ui.formatDate(request.endDate)}</p>${request.message ? `<small>“${ui.escapeHtml(request.message)}”</small>` : ""}</div><div class="request-actions"><button class="secondary-button danger-text" data-action="reject" data-request-id="${request.id}">Decline</button><button class="primary-button" data-action="approve" data-request-id="${request.id}">Approve</button></div></div>`;
            }).join("");
            const borrower = active ? state.users.find((candidate) => candidate.id === active.borrowerId) : null;
            const activeHtml = active ? `<div class="loan-summary"><div><span>${active.status === "return_requested" ? "Return awaiting confirmation" : "Currently with borrower"}</span><strong>${ui.escapeHtml(borrower?.name || "Student")} · due ${ui.formatDate(active.endDate)}</strong></div>${active.status === "return_requested" ? `<button class="primary-button" data-action="confirm-return" data-request-id="${active.id}">Confirm returned</button>` : ""}</div>` : "";
            return `<article class="manage-card"><div class="manage-main"><img src="${ui.imageSrc(item.image)}" alt="${ui.escapeHtml(item.name)}"><div class="manage-copy"><div class="item-kicker"><span>${ui.escapeHtml(item.category)}</span><span class="status-pill ${status.className}">${status.label}</span></div><h2>${ui.escapeHtml(item.name)}</h2><p>${ui.escapeHtml(item.description)}</p></div><div class="manage-actions"><a class="secondary-button compact" href="add-item.html?id=${encodeURIComponent(item.id)}">Edit</a><button class="secondary-button compact" data-action="toggle" data-item-id="${item.id}" ${item.status === "borrowed" ? "disabled" : ""}>${item.status === "unavailable" ? "Resume" : "Pause"}</button><button class="icon-button danger-text" data-action="delete" data-item-id="${item.id}" aria-label="Delete ${ui.escapeHtml(item.name)}">×</button></div></div>${activeHtml}${requestHtml ? `<div class="requests-list"><h3>${pending.length} request${pending.length === 1 ? "" : "s"} waiting</h3>${requestHtml}</div>` : ""}</article>`;
        }).join("");
        main().innerHTML = `
            <section class="container page-section">
                <div class="page-header split"><div><span class="section-label">My Items</span><h1>Items you are sharing</h1><p>Update availability and respond to borrowing requests.</p></div><a class="primary-button" href="add-item.html">+ List an item</a></div>
                <div class="summary-strip"><div><strong>${items.length}</strong><span>Total listings</span></div><div><strong>${items.filter((item) => item.status === "available").length}</strong><span>Available</span></div><div><strong>${state.requests.filter((request) => request.ownerId === user.id && request.status === "pending").length}</strong><span>Requests waiting</span></div></div>
                <div class="manage-list">${itemRows || ui.emptyState("No items listed", "Add your first item to start sharing.", `<a class="primary-button" href="add-item.html">List an item</a>`)}</div>
            </section>`;

        main().querySelectorAll("[data-action]").forEach((button) => button.addEventListener("click", () => {
            const action = button.dataset.action;
            if (action === "approve") handle(() => store.approveRequest(button.dataset.requestId), "Request approved.");
            if (action === "reject") handle(() => store.rejectRequest(button.dataset.requestId), "Request declined.");
            if (action === "confirm-return") handle(() => store.confirmReturn(button.dataset.requestId), "Return confirmed. The item is available again.");
            if (action === "toggle") handle(() => store.toggleItemAvailability(button.dataset.itemId), "Availability updated.");
            if (action === "delete" && window.confirm("Delete this item permanently?")) handle(() => store.deleteItem(button.dataset.itemId), "Item deleted.");
        }));
    }

    function borrowingCard(request, state) {
        const item = state.items.find((candidate) => candidate.id === request.itemId);
        const owner = state.users.find((candidate) => candidate.id === request.ownerId);
        const status = ui.statusMeta(request.status);
        let action = "";
        if (request.status === "pending") action = `<button class="secondary-button danger-text" data-action="cancel" data-request-id="${request.id}">Cancel request</button>`;
        if (request.status === "active") action = `<button class="primary-button" data-action="return" data-request-id="${request.id}">Mark as returned</button>`;
        if (["completed", "rejected", "cancelled"].includes(request.status) && item) action = `<a class="secondary-button" href="item-detail.html?id=${encodeURIComponent(item.id)}">Borrow again</a>`;
        return `<article class="borrowing-card"><img src="${ui.imageSrc(item?.image || "powerstrip.svg")}" alt="${ui.escapeHtml(item?.name || "Item")}"><div class="borrowing-copy"><div class="item-kicker"><span>${ui.escapeHtml(item?.category || "Item")}</span><span class="status-pill ${status.className}">${status.label}</span></div><h2>${ui.escapeHtml(item?.name || "Removed item")}</h2><p>Owner: ${ui.escapeHtml(owner?.name || "Unknown")}</p><div class="date-line"><span>${ui.formatDate(request.startDate)}</span><span>→</span><span>${ui.formatDate(request.endDate)}</span></div></div><div class="borrowing-action">${action}</div></article>`;
    }

    function renderBorrowings() {
        const user = store.getCurrentUser();
        if (!user) {
            ui.renderAuthGate("Track your borrowing activity");
            return;
        }
        const state = store.getState();
        const requests = state.requests.filter((request) => request.borrowerId === user.id);
        const groups = {
            pending: requests.filter((request) => request.status === "pending"),
            current: requests.filter((request) => ["active", "return_requested"].includes(request.status)),
            history: requests.filter((request) => ["completed", "rejected", "cancelled"].includes(request.status))
        };
        main().innerHTML = `
            <section class="container page-section">
                <div class="page-header"><span class="section-label">My Borrowings</span><h1>Your borrowing activity</h1><p>Follow pending requests, due dates, and completed returns.</p></div>
                <div class="tabs" role="tablist"><button class="tab active" role="tab" data-tab="current">Current <span>${groups.current.length}</span></button><button class="tab" role="tab" data-tab="pending">Pending <span>${groups.pending.length}</span></button><button class="tab" role="tab" data-tab="history">History <span>${groups.history.length}</span></button></div>
                <div id="borrowingList"></div>
            </section>`;
        const list = document.getElementById("borrowingList");
        function showGroup(name) {
            main().querySelectorAll(".tab").forEach((tab) => tab.classList.toggle("active", tab.dataset.tab === name));
            const labels = { current: ["No active borrowings", "Approved items will appear here."], pending: ["No pending requests", "Browse available items and send a request."], history: ["No borrowing history", "Completed, cancelled, and declined requests appear here."] };
            list.innerHTML = groups[name].length ? groups[name].map((request) => borrowingCard(request, state)).join("") : ui.emptyState(labels[name][0], labels[name][1], name !== "history" ? `<a class="primary-button" href="browse.html">Browse items</a>` : "");
            list.querySelectorAll("[data-action]").forEach((button) => button.addEventListener("click", () => {
                if (button.dataset.action === "cancel") handle(() => store.cancelRequest(button.dataset.requestId), "Request cancelled.");
                if (button.dataset.action === "return" && window.confirm("Mark this item as returned? The owner will need to confirm.")) handle(() => store.requestReturn(button.dataset.requestId), "Return sent for owner confirmation.");
            }));
        }
        main().querySelectorAll(".tab").forEach((tab) => tab.addEventListener("click", () => showGroup(tab.dataset.tab)));
        showGroup("current");
    }

    function renderProfile() {
        const user = store.getCurrentUser();
        if (!user) {
            ui.renderAuthGate("View your UniBorrow profile");
            return;
        }
        const state = store.getState();
        const listed = state.items.filter((item) => item.ownerId === user.id);
        const borrowed = state.requests.filter((request) => request.borrowerId === user.id);
        const completed = borrowed.filter((request) => request.status === "completed");
        main().innerHTML = `
            <section class="container page-section">
                <div class="profile-hero"><div class="profile-avatar">${ui.escapeHtml(user.name.charAt(0).toUpperCase())}</div><div><span class="section-label">Student profile</span><h1>${ui.escapeHtml(user.name)}</h1><p>${ui.escapeHtml(user.faculty)} · Student #${ui.escapeHtml(user.studentId)}</p></div></div>
                <div class="stats-row"><div class="stat-card"><strong>${listed.length}</strong><span>Items listed</span></div><div class="stat-card"><strong>${borrowed.length}</strong><span>Borrowing requests</span></div><div class="stat-card"><strong>${completed.length}</strong><span>Successful returns</span></div></div>
                <div class="profile-grid"><form class="form-card wide" id="profileForm"><div class="section-header"><div><span class="section-label">Account</span><h2>Edit profile</h2></div></div><p class="form-error" role="alert" hidden></p><div class="form-grid two"><div class="field"><label for="profileName">Full name</label><input id="profileName" name="name" value="${ui.escapeHtml(user.name)}" required></div><div class="field"><label for="profileStudentId">Student ID</label><input id="profileStudentId" name="studentId" value="${ui.escapeHtml(user.studentId)}"></div></div><div class="field"><label for="profileFaculty">Faculty</label><input id="profileFaculty" name="faculty" value="${ui.escapeHtml(user.faculty)}"></div><div class="field"><label for="profileBio">About</label><textarea id="profileBio" name="bio" maxlength="240">${ui.escapeHtml(user.bio)}</textarea></div><button type="submit" class="primary-button">Save profile</button></form><aside class="account-card"><span class="section-label">Demo controls</span><h2>Account and data</h2><p>Signed in as <strong>${ui.escapeHtml(user.email)}</strong></p><button type="button" class="secondary-button full-width" id="logoutButton">Log out</button><button type="button" class="text-button danger-text" id="resetButton">Reset all demo data</button><small>Reset restores the sample accounts, items, requests, and notifications.</small></aside></div>
            </section>`;
        document.getElementById("profileForm").addEventListener("submit", (event) => {
            event.preventDefault();
            const form = event.currentTarget;
            setFormError(form, "");
            try {
                store.updateProfile(Object.fromEntries(new FormData(form)));
                ui.toast("Profile updated.");
            } catch (error) {
                setFormError(form, error.message);
            }
        });
        document.getElementById("logoutButton").addEventListener("click", () => {
            store.logout();
            window.location.href = "index.html";
        });
        document.getElementById("resetButton").addEventListener("click", () => {
            if (window.confirm("Reset all demo data and log out?")) {
                store.resetDemo();
                window.location.href = "index.html";
            }
        });
    }

    window.UniBorrowPages = {
        home: renderHome,
        browse: renderBrowse,
        detail: renderItemDetail,
        login: renderLogin,
        register: renderRegister,
        "add-item": renderAddItem,
        "my-items": renderMyItems,
        borrowings: renderBorrowings,
        profile: renderProfile
    };
})();
