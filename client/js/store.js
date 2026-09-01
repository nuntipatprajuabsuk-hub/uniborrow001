(function () {
    "use strict";

    const STORAGE_KEY = "uniborrow_demo_v3";
    const VERSION = 3;

    function clone(value) {
        return JSON.parse(JSON.stringify(value));
    }

    function datePlus(days) {
        const date = new Date();
        date.setHours(12, 0, 0, 0);
        date.setDate(date.getDate() + days);
        return date.toISOString().slice(0, 10);
    }

    // This is intentionally a lightweight demo hash. It is not production authentication.
    function hashPassword(value) {
        let hash = 2166136261;
        for (let index = 0; index < value.length; index += 1) {
            hash ^= value.charCodeAt(index);
            hash = Math.imul(hash, 16777619);
        }
        return `demo-${(hash >>> 0).toString(16)}`;
    }

    function createSeedState() {
        return {
            version: VERSION,
            currentUserId: null,
            users: [
                {
                    id: "user-tawan",
                    name: "Tawan S.",
                    email: "tawan@uniborrow.ac.th",
                    passwordHash: hashPassword("demo1234"),
                    studentId: "664821",
                    faculty: "Faculty of Engineering",
                    bio: "Engineering student who enjoys sharing project equipment.",
                    plan: "pro"
                },
                {
                    id: "user-maya",
                    name: "Maya P.",
                    email: "maya@uniborrow.ac.th",
                    passwordHash: hashPassword("demo1234"),
                    studentId: "661190",
                    faculty: "Faculty of Science",
                    bio: "Science student and textbook collector.",
                    plan: "free"
                },
                {
                    id: "user-niran",
                    name: "Niran K.",
                    email: "niran@uniborrow.ac.th",
                    passwordHash: hashPassword("demo1234"),
                    studentId: "663305",
                    faculty: "Faculty of Architecture",
                    bio: "Architecture student with tools and studio equipment to share.",
                    plan: "free"
                }
            ],
            items: [
                {
                    id: "hdmi-cable",
                    ownerId: "user-tawan",
                    name: "HDMI Cable",
                    category: "Electronics",
                    image: "hdmi.svg",
                    rating: 4.8,
                    status: "available",
                    rentalType: "paid",
                    pricePerDay: 40,
                    deposit: 100,
                    featuredUntil: datePlus(5),
                    description: "สาย HDMI ยาว 1.5 เมตร สำหรับเชื่อมต่อแล็ปท็อปกับจอหรือโปรเจกเตอร์ ทดสอบแล้วใช้งานได้ปกติ",
                    availableFrom: datePlus(0),
                    availableUntil: datePlus(14),
                    createdAt: datePlus(-30)
                },
                {
                    id: "scientific-calculator",
                    ownerId: "user-maya",
                    name: "Scientific Calculator",
                    category: "Study",
                    image: "calculator.svg",
                    rating: 4.9,
                    status: "borrowed",
                    rentalType: "paid",
                    pricePerDay: 60,
                    deposit: 200,
                    featuredUntil: null,
                    description: "เครื่องคิดเลขวิทยาศาสตร์รุ่นที่ใช้สอบได้ เหมาะสำหรับวิชาคณิตศาสตร์และฟิสิกส์ แบตเตอรี่เต็ม",
                    availableFrom: datePlus(6),
                    availableUntil: datePlus(25),
                    createdAt: datePlus(-40)
                },
                {
                    id: "camera-tripod",
                    ownerId: "user-tawan",
                    name: "Camera Tripod",
                    category: "Equipment",
                    image: "tripod.svg",
                    rating: 4.7,
                    status: "borrowed",
                    rentalType: "paid",
                    pricePerDay: 100,
                    deposit: 500,
                    featuredUntil: datePlus(3),
                    description: "ขาตั้งกล้องปรับความสูงได้ถึง 150 ซม. เหมาะกับงานถ่ายวิดีโอโปรเจกต์และพรีเซนต์",
                    availableFrom: datePlus(4),
                    availableUntil: datePlus(18),
                    createdAt: datePlus(-22)
                },
                {
                    id: "electric-drill",
                    ownerId: "user-tawan",
                    name: "Electric Drill",
                    category: "Tools",
                    image: "drill.svg",
                    rating: 4.8,
                    status: "available",
                    rentalType: "paid",
                    pricePerDay: 80,
                    deposit: 300,
                    featuredUntil: null,
                    description: "สว่านไฟฟ้าขนาดพกพาพร้อมดอกสว่านมาตรฐาน เหมาะสำหรับงานประกอบเฟอร์นิเจอร์หอพัก",
                    availableFrom: datePlus(0),
                    availableUntil: datePlus(10),
                    createdAt: datePlus(-18)
                },
                {
                    id: "physics-textbook",
                    ownerId: "user-maya",
                    name: "Physics Textbook",
                    category: "Books",
                    image: "textbook.svg",
                    rating: 4.6,
                    status: "available",
                    rentalType: "free",
                    pricePerDay: 0,
                    deposit: 0,
                    featuredUntil: null,
                    description: "หนังสือฟิสิกส์พื้นฐาน สภาพดี มีโน้ตสรุปท้ายบทเพิ่มเติม",
                    availableFrom: datePlus(0),
                    availableUntil: datePlus(30),
                    createdAt: datePlus(-55)
                },
                {
                    id: "power-strip",
                    ownerId: "user-niran",
                    name: "Power Strip",
                    category: "Electronics",
                    image: "powerstrip.svg",
                    rating: 4.9,
                    status: "available",
                    rentalType: "paid",
                    pricePerDay: 30,
                    deposit: 100,
                    featuredUntil: null,
                    description: "ปลั๊กพ่วง 4 ช่อง สายยาว 2 เมตร มีสวิตช์ปิดเปิดและระบบป้องกันไฟเกิน",
                    availableFrom: datePlus(0),
                    availableUntil: datePlus(20),
                    createdAt: datePlus(-12)
                }
            ],
            requests: [
                {
                    id: "request-active-calculator",
                    itemId: "scientific-calculator",
                    borrowerId: "user-tawan",
                    ownerId: "user-maya",
                    startDate: datePlus(-2),
                    endDate: datePlus(5),
                    message: "ใช้สอบวิชาฟิสิกส์ช่วงสัปดาห์นี้ครับ",
                    pricing: { days: 8, rentalAmount: 480, platformFee: 48, ownerPayout: 432, deposit: 200, totalDue: 680, feeRate: 0.10 },
                    status: "active",
                    createdAt: datePlus(-4),
                    updatedAt: datePlus(-2)
                },
                {
                    id: "request-pending-drill",
                    itemId: "electric-drill",
                    borrowerId: "user-niran",
                    ownerId: "user-tawan",
                    startDate: datePlus(1),
                    endDate: datePlus(4),
                    message: "ขอยืมประกอบโมเดลส่งอาจารย์ครับ",
                    pricing: { days: 4, rentalAmount: 320, platformFee: 16, ownerPayout: 304, deposit: 300, totalDue: 620, feeRate: 0.05 },
                    status: "pending",
                    createdAt: datePlus(-1),
                    updatedAt: datePlus(-1)
                },
                {
                    id: "request-active-tripod",
                    itemId: "camera-tripod",
                    borrowerId: "user-maya",
                    ownerId: "user-tawan",
                    startDate: datePlus(-1),
                    endDate: datePlus(3),
                    message: "ใช้ถ่ายวิดีโอแล็บค่ะ",
                    pricing: { days: 5, rentalAmount: 500, platformFee: 25, ownerPayout: 475, deposit: 500, totalDue: 1000, feeRate: 0.05 },
                    status: "active",
                    createdAt: datePlus(-3),
                    updatedAt: datePlus(-1)
                },
                {
                    id: "request-completed-book",
                    itemId: "physics-textbook",
                    borrowerId: "user-tawan",
                    ownerId: "user-maya",
                    startDate: datePlus(-20),
                    endDate: datePlus(-14),
                    message: "อ่านเตรียมสอบกลางภาค",
                    pricing: { days: 7, rentalAmount: 0, platformFee: 0, ownerPayout: 0, deposit: 0, totalDue: 0, feeRate: 0 },
                    status: "completed",
                    createdAt: datePlus(-22),
                    updatedAt: datePlus(-14)
                }
            ],
            promotions: [
                { id: "promotion-hdmi", itemId: "hdmi-cable", userId: "user-tawan", amount: 19, days: 7, createdAt: datePlus(-2) }
            ],
            notifications: [
                {
                    id: "notification-pending-drill",
                    userId: "user-tawan",
                    title: "New borrowing request",
                    message: "Niran K. requested your Electric Drill.",
                    href: "my-items.html",
                    read: false,
                    createdAt: datePlus(-1)
                },
                {
                    id: "notification-active-calculator",
                    userId: "user-tawan",
                    title: "Request approved",
                    message: "Maya P. approved your Scientific Calculator request.",
                    href: "my-borrowings.html",
                    read: true,
                    createdAt: datePlus(-2)
                }
            ]
        };
    }

    function loadState() {
        try {
            const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
            if (stored && stored.version === VERSION && Array.isArray(stored.users)) return stored;
        } catch (error) {
            console.warn("Unable to read UniBorrow demo data. Resetting the demo.", error);
        }
        const fresh = createSeedState();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
        return fresh;
    }

    let state = loadState();

    function save() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        window.dispatchEvent(new CustomEvent("uniborrow:change"));
    }

    function uid(prefix) {
        return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    }

    function requireUser() {
        const user = state.users.find((candidate) => candidate.id === state.currentUserId);
        if (!user) throw new Error("Please log in to continue.");
        return user;
    }

    function getItem(itemId) {
        return state.items.find((item) => item.id === itemId) || null;
    }

    function getRequest(requestId) {
        return state.requests.find((request) => request.id === requestId) || null;
    }

    function notify(userId, title, message, href) {
        state.notifications.unshift({
            id: uid("notification"),
            userId,
            title,
            message,
            href,
            read: false,
            createdAt: new Date().toISOString()
        });
    }

    function validateUniversityEmail(email) {
        return /^[^\s@]+@[^\s@]+\.(?:ac\.th|edu)$/i.test(email);
    }

    function calculateQuoteFor(item, startDate, endDate) {
        if (!item || !startDate || !endDate || startDate > endDate) return null;
        const start = new Date(`${startDate}T12:00:00`);
        const end = new Date(`${endDate}T12:00:00`);
        const days = Math.floor((end - start) / 86400000) + 1;
        if (!Number.isFinite(days) || days < 1) return null;
        const owner = state.users.find((user) => user.id === item.ownerId);
        const rentalAmount = item.rentalType === "paid" ? Math.round(Number(item.pricePerDay || 0) * days * 100) / 100 : 0;
        const feeRate = rentalAmount ? (owner?.plan === "pro" ? 0.05 : 0.10) : 0;
        const platformFee = Math.round(rentalAmount * feeRate * 100) / 100;
        const deposit = Math.max(0, Number(item.deposit || 0));
        return {
            days,
            rentalAmount,
            platformFee,
            ownerPayout: Math.round((rentalAmount - platformFee) * 100) / 100,
            deposit,
            totalDue: Math.round((rentalAmount + deposit) * 100) / 100,
            feeRate
        };
    }

    const api = {
        categories: ["Books", "Electronics", "Tools", "Equipment", "Sports", "Study", "Others"],

        getState() {
            return clone(state);
        },

        getCurrentUser() {
            const user = state.users.find((candidate) => candidate.id === state.currentUserId);
            return user ? clone(user) : null;
        },

        getItem(itemId) {
            const item = getItem(itemId);
            return item ? clone(item) : null;
        },

        calculateQuote(itemId, startDate, endDate) {
            const quote = calculateQuoteFor(getItem(itemId), startDate, endDate);
            return quote ? clone(quote) : null;
        },

        getBusinessMetrics() {
            const paidRequests = state.requests.filter((request) => ["active", "return_requested", "completed"].includes(request.status));
            const gmv = paidRequests.reduce((sum, request) => sum + Number(request.pricing?.rentalAmount || 0), 0);
            const transactionRevenue = paidRequests.reduce((sum, request) => sum + Number(request.pricing?.platformFee || 0), 0);
            const promotionRevenue = state.promotions.reduce((sum, promotion) => sum + Number(promotion.amount || 0), 0);
            const subscriptionRevenue = state.users.filter((user) => user.plan === "pro").length * 59;
            return clone({
                gmv,
                transactionRevenue,
                promotionRevenue,
                subscriptionRevenue,
                totalRevenue: transactionRevenue + promotionRevenue + subscriptionRevenue,
                completedTransactions: paidRequests.length
            });
        },

        login(email, password) {
            const normalized = email.trim().toLowerCase();
            const user = state.users.find((candidate) => candidate.email.toLowerCase() === normalized);
            if (!user || user.passwordHash !== hashPassword(password)) {
                throw new Error("Email or password is incorrect.");
            }
            state.currentUserId = user.id;
            save();
            return clone(user);
        },

        register(payload) {
            const email = payload.email.trim().toLowerCase();
            if (!payload.name.trim()) throw new Error("Please enter your full name.");
            if (!validateUniversityEmail(email)) throw new Error("Please use a university email ending in .ac.th or .edu.");
            if (payload.password.length < 8) throw new Error("Password must contain at least 8 characters.");
            if (state.users.some((user) => user.email.toLowerCase() === email)) throw new Error("This email is already registered.");

            const user = {
                id: uid("user"),
                name: payload.name.trim(),
                email,
                passwordHash: hashPassword(payload.password),
                studentId: payload.studentId.trim(),
                faculty: payload.faculty.trim() || "University Student",
                bio: "",
                plan: "free"
            };
            state.users.push(user);
            state.currentUserId = user.id;
            save();
            return clone(user);
        },

        logout() {
            state.currentUserId = null;
            save();
        },

        updateProfile(payload) {
            const user = requireUser();
            if (!payload.name.trim()) throw new Error("Name cannot be empty.");
            user.name = payload.name.trim();
            user.studentId = payload.studentId.trim();
            user.faculty = payload.faculty.trim();
            user.bio = payload.bio.trim();
            save();
            return clone(user);
        },

        createItem(payload) {
            const user = requireUser();
            if (!payload.name.trim()) throw new Error("Please enter an item name.");
            if (!payload.description.trim()) throw new Error("Please add a short description.");
            if (payload.availableFrom && payload.availableUntil && payload.availableFrom > payload.availableUntil) {
                throw new Error("Available-until date must be after the start date.");
            }
            if (payload.rentalType === "paid" && Number(payload.pricePerDay) <= 0) throw new Error("Paid rentals need a price greater than zero.");
            const item = {
                id: uid("item"),
                ownerId: user.id,
                name: payload.name.trim(),
                category: api.categories.includes(payload.category) ? payload.category : "Others",
                image: payload.image || "powerstrip.svg",
                rating: 0,
                status: "available",
                rentalType: payload.rentalType === "paid" ? "paid" : "free",
                pricePerDay: payload.rentalType === "paid" ? Math.max(0, Number(payload.pricePerDay || 0)) : 0,
                deposit: Math.max(0, Number(payload.deposit || 0)),
                featuredUntil: null,
                description: payload.description.trim(),
                availableFrom: payload.availableFrom || datePlus(0),
                availableUntil: payload.availableUntil || datePlus(14),
                createdAt: new Date().toISOString()
            };
            state.items.unshift(item);
            save();
            return clone(item);
        },

        updateItem(itemId, payload) {
            const user = requireUser();
            const item = getItem(itemId);
            if (!item || item.ownerId !== user.id) throw new Error("You cannot edit this item.");
            if (!payload.name.trim() || !payload.description.trim()) throw new Error("Name and description are required.");
            if (payload.availableFrom && payload.availableUntil && payload.availableFrom > payload.availableUntil) {
                throw new Error("Available-until date must be after the start date.");
            }
            if (payload.rentalType === "paid" && Number(payload.pricePerDay) <= 0) throw new Error("Paid rentals need a price greater than zero.");
            item.name = payload.name.trim();
            item.category = api.categories.includes(payload.category) ? payload.category : "Others";
            item.description = payload.description.trim();
            item.rentalType = payload.rentalType === "paid" ? "paid" : "free";
            item.pricePerDay = item.rentalType === "paid" ? Math.max(0, Number(payload.pricePerDay || 0)) : 0;
            item.deposit = Math.max(0, Number(payload.deposit || 0));
            item.availableFrom = payload.availableFrom;
            item.availableUntil = payload.availableUntil;
            if (payload.image) item.image = payload.image;
            save();
            return clone(item);
        },

        deleteItem(itemId) {
            const user = requireUser();
            const item = getItem(itemId);
            if (!item || item.ownerId !== user.id) throw new Error("You cannot delete this item.");
            const hasOpenRequest = state.requests.some((request) => request.itemId === itemId && ["pending", "active", "return_requested"].includes(request.status));
            if (hasOpenRequest) throw new Error("Resolve active borrowing requests before deleting this item.");
            state.items = state.items.filter((candidate) => candidate.id !== itemId);
            state.requests = state.requests.filter((request) => request.itemId !== itemId);
            save();
        },

        toggleItemAvailability(itemId) {
            const user = requireUser();
            const item = getItem(itemId);
            if (!item || item.ownerId !== user.id) throw new Error("You cannot update this item.");
            if (item.status === "borrowed") throw new Error("A borrowed item cannot be paused.");
            item.status = item.status === "available" ? "unavailable" : "available";
            save();
            return item.status;
        },

        requestBorrow(itemId, payload) {
            const user = requireUser();
            const item = getItem(itemId);
            if (!item) throw new Error("Item not found.");
            if (item.ownerId === user.id) throw new Error("You cannot borrow your own item.");
            if (item.status !== "available") throw new Error("This item is not currently available.");
            if (!payload.startDate || !payload.endDate || payload.startDate > payload.endDate) {
                throw new Error("Please choose a valid borrowing period.");
            }
            if (payload.startDate < datePlus(0)) throw new Error("The borrowing period cannot start in the past.");
            if (item.availableFrom && payload.startDate < item.availableFrom) {
                throw new Error(`This item is available from ${item.availableFrom}.`);
            }
            if (item.availableUntil && payload.endDate > item.availableUntil) {
                throw new Error(`Please return this item by ${item.availableUntil}.`);
            }
            const duplicate = state.requests.some((request) => request.itemId === itemId && request.borrowerId === user.id && ["pending", "active", "return_requested"].includes(request.status));
            if (duplicate) throw new Error("You already have an open request for this item.");
            const pricing = calculateQuoteFor(item, payload.startDate, payload.endDate);
            if (!pricing) throw new Error("Unable to calculate the rental price.");
            const request = {
                id: uid("request"),
                itemId,
                borrowerId: user.id,
                ownerId: item.ownerId,
                startDate: payload.startDate,
                endDate: payload.endDate,
                message: payload.message.trim(),
                pricing,
                status: "pending",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            state.requests.unshift(request);
            notify(item.ownerId, "New borrowing request", `${user.name} requested your ${item.name}.`, "my-items.html");
            save();
            return clone(request);
        },

        approveRequest(requestId) {
            const user = requireUser();
            const request = getRequest(requestId);
            if (!request || request.ownerId !== user.id || request.status !== "pending") throw new Error("This request cannot be approved.");
            const item = getItem(request.itemId);
            if (!item || item.status !== "available") throw new Error("This item is no longer available.");
            request.status = "active";
            request.updatedAt = new Date().toISOString();
            item.status = "borrowed";
            notify(request.borrowerId, "Request approved", `Your request for ${item.name} was approved.`, "my-borrowings.html");
            state.requests.forEach((other) => {
                if (other.id !== request.id && other.itemId === item.id && other.status === "pending") {
                    other.status = "rejected";
                    other.updatedAt = new Date().toISOString();
                    notify(other.borrowerId, "Request closed", `${item.name} was assigned to another borrower.`, "my-borrowings.html");
                }
            });
            save();
        },

        rejectRequest(requestId) {
            const user = requireUser();
            const request = getRequest(requestId);
            if (!request || request.ownerId !== user.id || request.status !== "pending") throw new Error("This request cannot be rejected.");
            request.status = "rejected";
            request.updatedAt = new Date().toISOString();
            const item = getItem(request.itemId);
            notify(request.borrowerId, "Request declined", `Your request for ${item ? item.name : "an item"} was declined.`, "my-borrowings.html");
            save();
        },

        cancelRequest(requestId) {
            const user = requireUser();
            const request = getRequest(requestId);
            if (!request || request.borrowerId !== user.id || request.status !== "pending") throw new Error("This request cannot be cancelled.");
            request.status = "cancelled";
            request.updatedAt = new Date().toISOString();
            save();
        },

        requestReturn(requestId) {
            const user = requireUser();
            const request = getRequest(requestId);
            if (!request || request.borrowerId !== user.id || request.status !== "active") throw new Error("This loan cannot be returned.");
            request.status = "return_requested";
            request.updatedAt = new Date().toISOString();
            const item = getItem(request.itemId);
            notify(request.ownerId, "Return confirmation needed", `${user.name} marked ${item ? item.name : "an item"} as returned.`, "my-items.html");
            save();
        },

        confirmReturn(requestId) {
            const user = requireUser();
            const request = getRequest(requestId);
            if (!request || request.ownerId !== user.id || request.status !== "return_requested") throw new Error("This return cannot be confirmed.");
            request.status = "completed";
            request.updatedAt = new Date().toISOString();
            const item = getItem(request.itemId);
            if (item) item.status = "available";
            notify(request.borrowerId, "Return completed", `${item ? item.name : "The item"} has been returned successfully.`, "my-borrowings.html");
            save();
        },

        markNotificationRead(notificationId) {
            const user = requireUser();
            const notification = state.notifications.find((candidate) => candidate.id === notificationId && candidate.userId === user.id);
            if (notification) {
                notification.read = true;
                save();
            }
        },

        markAllNotificationsRead() {
            const user = requireUser();
            state.notifications.forEach((notification) => {
                if (notification.userId === user.id) notification.read = true;
            });
            save();
        },

        upgradeToPro() {
            const user = requireUser();
            if (user.plan === "pro") return clone(user);
            user.plan = "pro";
            notify(user.id, "UniBorrow Pro activated", "Your educational Pro upgrade is now active.", "business.html");
            save();
            return clone(user);
        },

        boostItem(itemId) {
            const user = requireUser();
            const item = getItem(itemId);
            if (!item || item.ownerId !== user.id) throw new Error("You cannot promote this item.");
            item.featuredUntil = datePlus(7);
            state.promotions.unshift({ id: uid("promotion"), itemId, userId: user.id, amount: 19, days: 7, createdAt: new Date().toISOString() });
            notify(user.id, "Listing promoted", `${item.name} is featured for 7 days.`, "my-items.html");
            save();
            return clone(item);
        },

        resetDemo() {
            state = createSeedState();
            save();
        }
    };

    window.UniBorrowStore = api;
})();
