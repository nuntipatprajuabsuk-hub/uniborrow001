const test = require("node:test");
const assert = require("node:assert/strict");

function createStorage() {
    const data = new Map();
    return {
        getItem(key) { return data.has(key) ? data.get(key) : null; },
        setItem(key, value) { data.set(key, String(value)); },
        removeItem(key) { data.delete(key); },
        clear() { data.clear(); }
    };
}

global.localStorage = createStorage();
global.CustomEvent = class CustomEvent { constructor(type) { this.type = type; } };
global.window = { dispatchEvent() {} };

require("../client/js/store.js");
const store = global.window.UniBorrowStore;

test("demo login and complete borrowing workflow", () => {
    store.resetDemo();
    store.login("niran@uniborrow.ac.th", "demo1234");
    const item = store.getItem("hdmi-cable");
    const request = store.requestBorrow("hdmi-cable", {
        startDate: item.availableFrom,
        endDate: item.availableUntil,
        message: "Presentation equipment"
    });
    assert.equal(request.status, "pending");

    store.logout();
    store.login("tawan@uniborrow.ac.th", "demo1234");
    store.approveRequest(request.id);
    assert.equal(store.getItem("hdmi-cable").status, "borrowed");

    store.logout();
    store.login("niran@uniborrow.ac.th", "demo1234");
    store.requestReturn(request.id);
    assert.equal(store.getState().requests.find((entry) => entry.id === request.id).status, "return_requested");

    store.logout();
    store.login("tawan@uniborrow.ac.th", "demo1234");
    store.confirmReturn(request.id);
    assert.equal(store.getState().requests.find((entry) => entry.id === request.id).status, "completed");
    assert.equal(store.getItem("hdmi-cable").status, "available");
});

test("registration validates university email and stores a new account", () => {
    store.resetDemo();
    assert.throws(() => store.register({
        name: "Demo Student",
        email: "student@example.com",
        password: "password123",
        studentId: "660001",
        faculty: "Faculty of Arts"
    }), /university email/);

    const user = store.register({
        name: "Demo Student",
        email: "student@example.edu",
        password: "password123",
        studentId: "660001",
        faculty: "Faculty of Arts"
    });
    assert.equal(store.getCurrentUser().id, user.id);
});

test("owner can create, edit, pause, resume, and delete an item", () => {
    store.resetDemo();
    store.login("tawan@uniborrow.ac.th", "demo1234");
    const item = store.createItem({
        name: "USB Microphone",
        category: "Electronics",
        description: "A small microphone for online presentations.",
        image: "",
        availableFrom: "2099-02-01",
        availableUntil: "2099-02-10"
    });
    assert.equal(store.getItem(item.id).status, "available");

    store.updateItem(item.id, {
        name: "USB Condenser Microphone",
        category: "Electronics",
        description: "A USB microphone with a desk stand.",
        image: "",
        availableFrom: "2099-02-01",
        availableUntil: "2099-02-12"
    });
    assert.equal(store.getItem(item.id).name, "USB Condenser Microphone");
    assert.equal(store.toggleItemAvailability(item.id), "unavailable");
    assert.equal(store.toggleItemAvailability(item.id), "available");
    store.deleteItem(item.id);
    assert.equal(store.getItem(item.id), null);
});
