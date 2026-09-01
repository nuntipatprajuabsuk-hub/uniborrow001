(function () {
    "use strict";

    const LANGUAGE_KEY = "uniborrow_language";
    let language = localStorage.getItem(LANGUAGE_KEY) || "th";

    const thai = {
        "Browse": "ค้นหาสิ่งของ",
        "My Items": "สิ่งของของฉัน",
        "My Borrowings": "รายการยืมของฉัน",
        "Business": "โมเดลธุรกิจ",
        "Log in": "เข้าสู่ระบบ",
        "Create account": "สร้างบัญชี",
        "Menu": "เมนู",
        "Notifications": "การแจ้งเตือน",
        "Mark all read": "อ่านทั้งหมดแล้ว",
        "No notifications yet.": "ยังไม่มีการแจ้งเตือน",
        "Campus sharing made simple": "แบ่งปันของใช้ในมหาวิทยาลัยได้ง่ายขึ้น",
        "Borrow more.": "ยืมได้มากกว่า",
        "Buy less.": "ซื้อน้อยลง",
        "Search items": "ค้นหาสิ่งของ",
        "Three simple steps": "3 ขั้นตอนง่าย ๆ",
        "Find an item": "ค้นหาสิ่งของ",
        "Search by name or category": "ค้นหาจากชื่อหรือหมวดหมู่",
        "Send a request": "ส่งคำขอยืม",
        "Choose the borrowing dates": "เลือกวันที่ต้องการยืม",
        "Return on time": "คืนของตรงเวลา",
        "Keep your campus trusted": "สร้างความน่าเชื่อถือในมหาวิทยาลัย",
        "Explore": "สำรวจ",
        "Browse by category": "ค้นหาตามหมวดหมู่",
        "View all items →": "ดูสิ่งของทั้งหมด →",
        "Popular now": "กำลังเป็นที่นิยม",
        "Items students recommend": "สิ่งของที่นักศึกษาแนะนำ",
        "Have something useful?": "มีของที่ไม่ได้ใช้อยู่ไหม?",
        "Turn unused items into campus resources.": "เปลี่ยนของที่ไม่ได้ใช้ให้สร้างประโยชน์และรายได้",
        "List an item": "ลงประกาศสิ่งของ",
        "Books": "หนังสือ",
        "Electronics": "อิเล็กทรอนิกส์",
        "Tools": "เครื่องมือ",
        "Equipment": "อุปกรณ์",
        "Sports": "กีฬา",
        "Study": "การเรียน",
        "Others": "อื่น ๆ",
        "Available": "พร้อมให้ยืม",
        "Borrowed": "ถูกยืมแล้ว",
        "Paused": "หยุดให้ยืม",
        "Pending": "รออนุมัติ",
        "Currently borrowing": "กำลังยืม",
        "Return pending": "รอยืนยันการคืน",
        "Completed": "เสร็จสิ้น",
        "Rejected": "ถูกปฏิเสธ",
        "Cancelled": "ยกเลิกแล้ว",
        "New listing": "รายการใหม่",
        "Find something useful": "ค้นหาสิ่งของที่ต้องการ",
        "All categories": "ทุกหมวดหมู่",
        "All statuses": "ทุกสถานะ",
        "Clear filters": "ล้างตัวกรอง",
        "No matching items": "ไม่พบสิ่งของที่ตรงกัน",
        "Try another keyword or clear the filters.": "ลองค้นหาด้วยคำอื่นหรือล้างตัวกรอง",
        "Item not found": "ไม่พบสิ่งของ",
        "This listing may have been removed.": "รายการนี้อาจถูกลบแล้ว",
        "Back to Browse": "กลับไปค้นหาสิ่งของ",
        "Manage this item": "จัดการสิ่งของนี้",
        "Request to borrow": "ส่งคำขอยืม",
        "Not available right now": "ยังไม่พร้อมให้ยืม",
        "Description": "รายละเอียด",
        "Available from": "เริ่มให้ยืม",
        "Available until": "ให้ยืมถึง",
        "Borrowing request": "คำขอยืม",
        "Start date": "วันที่เริ่มยืม",
        "Return date": "วันที่คืน",
        "Message to owner": "ข้อความถึงเจ้าของ",
        "Cancel": "ยกเลิก",
        "Send request": "ส่งคำขอ",
        "Member login": "เข้าสู่ระบบสมาชิก",
        "Log in to UniBorrow": "เข้าสู่ระบบ UniBorrow",
        "University email": "อีเมลมหาวิทยาลัย",
        "Password": "รหัสผ่าน",
        "Demo account": "บัญชีทดลอง",
        "Fill demo login": "กรอกบัญชีทดลอง",
        "Create account": "สร้างบัญชี",
        "Full name": "ชื่อ-นามสกุล",
        "Student ID": "รหัสนักศึกษา",
        "Faculty": "คณะ",
        "Confirm password": "ยืนยันรหัสผ่าน",
        "List a new item": "ลงประกาศสิ่งของใหม่",
        "Edit item": "แก้ไขสิ่งของ",
        "Item name": "ชื่อสิ่งของ",
        "Category": "หมวดหมู่",
        "Item image": "รูปภาพสิ่งของ",
        "Save changes": "บันทึกการแก้ไข",
        "Items you are sharing": "สิ่งของที่คุณกำลังแบ่งปัน",
        "+ List an item": "+ ลงประกาศสิ่งของ",
        "Total listings": "รายการทั้งหมด",
        "Requests waiting": "คำขอที่รออยู่",
        "Edit": "แก้ไข",
        "Pause": "หยุดชั่วคราว",
        "Resume": "เปิดให้ยืม",
        "Approve": "อนุมัติ",
        "Decline": "ปฏิเสธ",
        "Confirm returned": "ยืนยันการคืน",
        "Pending request": "คำขอที่รออนุมัติ",
        "Your borrowing activity": "กิจกรรมการยืมของคุณ",
        "Current": "กำลังยืม",
        "History": "ประวัติ",
        "Cancel request": "ยกเลิกคำขอ",
        "Mark as returned": "แจ้งคืนของ",
        "Borrow again": "ยืมอีกครั้ง",
        "Student profile": "โปรไฟล์นักศึกษา",
        "Items listed": "สิ่งของที่ลงประกาศ",
        "Borrowing requests": "คำขอยืมทั้งหมด",
        "Successful returns": "คืนสำเร็จ",
        "Account": "บัญชี",
        "Edit profile": "แก้ไขโปรไฟล์",
        "About": "เกี่ยวกับฉัน",
        "Save profile": "บันทึกโปรไฟล์",
        "Demo controls": "การควบคุมระบบทดลอง",
        "Account and data": "บัญชีและข้อมูล",
        "Log out": "ออกจากระบบ",
        "Reset all demo data": "รีเซ็ตข้อมูลทดลองทั้งหมด",
        "Members only": "สำหรับสมาชิก",
        "Featured": "แนะนำ",
        "Free": "ยืมฟรี",
        "Paid rental": "มีค่าเช่า",
        "Price per day": "ราคาต่อวัน",
        "Security deposit": "เงินประกัน",
        "Rental summary": "สรุปค่าเช่า",
        "Rental fee": "ค่าเช่า",
        "Platform fee": "ค่าธรรมเนียมแพลตฟอร์ม",
        "Owner receives": "เจ้าของได้รับ",
        "Refundable deposit": "เงินประกันที่คืนให้",
        "Total due": "ยอดที่ชำระ",
        "Upgrade to Pro": "อัปเกรดเป็น Pro",
        "Current plan": "แผนปัจจุบัน",
        "Boost listing": "โปรโมตรายการ",
        "Earnings dashboard": "แดชบอร์ดรายได้",
        "Platform revenue": "รายได้แพลตฟอร์ม",
        "Transaction fees": "ค่าธรรมเนียมธุรกรรม",
        "Featured listings": "รายการโปรโมต",
        "Pro subscriptions": "สมาชิก Pro",
        "Educational prototype": "ต้นแบบเพื่อการศึกษา"
        ,"Find useful items from students around campus, send a request, and keep every borrowing in one place.": "ค้นหาสิ่งของจากนักศึกษาในมหาวิทยาลัย ส่งคำขอยืม และติดตามทุกขั้นตอนได้ในที่เดียว"
        ,"List an item in a minute and manage every request from My Items.": "ลงประกาศได้ภายในไม่กี่นาที และจัดการคำขอทั้งหมดได้จากหน้าสิ่งของของฉัน"
        ,"Search the campus collection and check availability before requesting.": "ค้นหาสิ่งของในมหาวิทยาลัยและตรวจสอบสถานะก่อนส่งคำขอ"
        ,"Welcome back": "ยินดีต้อนรับกลับ"
        ,"Continue sharing on campus.": "กลับมาแบ่งปันสิ่งของในมหาวิทยาลัยกันต่อ"
        ,"Use your account to request items, manage listings, and track returns.": "ใช้บัญชีเพื่อยืมของ จัดการประกาศ และติดตามการคืน"
        ,"Join the community": "เข้าร่วมชุมชน"
        ,"Share resources, not extra expenses.": "แบ่งปันทรัพยากร ลดค่าใช้จ่ายที่ไม่จำเป็น"
        ,"Create a demo university account and start borrowing or listing items immediately.": "สร้างบัญชีนักศึกษาแบบทดลอง แล้วเริ่มยืมหรือลงประกาศสิ่งของได้ทันที"
        ,"Track every request": "ติดตามคำขอทั้งหมด"
        ,"Manage lending status": "จัดการสถานะการให้ยืม"
        ,"Keep a borrowing history": "เก็บประวัติการยืม"
        ,"Your student profile": "โปรไฟล์นักศึกษาของคุณ"
        ,"Use clear details so borrowers know exactly what they will receive.": "ระบุรายละเอียดให้ชัดเจน เพื่อให้ผู้ยืมทราบว่าจะได้รับสิ่งของแบบใด"
        ,"Condition, included accessories, and any usage notes.": "ระบุสภาพ อุปกรณ์ที่ให้มาด้วย และข้อแนะนำในการใช้งาน"
        ,"Update availability and respond to borrowing requests.": "อัปเดตสถานะและตอบรับคำขอยืม"
        ,"Follow pending requests, due dates, and completed returns.": "ติดตามคำขอ วันที่ต้องคืน และรายการที่คืนสำเร็จ"
        ,"Campus Item Sharing Platform": "แพลตฟอร์มแบ่งปันสิ่งของในมหาวิทยาลัย"
        ,"University demonstration project": "โครงงานสาธิตระดับมหาวิทยาลัย"
        ,"No active borrowings": "ไม่มีรายการที่กำลังยืม"
        ,"No pending requests": "ไม่มีคำขอที่รออนุมัติ"
        ,"No borrowing history": "ยังไม่มีประวัติการยืม"
        ,"No items listed": "ยังไม่มีสิ่งของที่ลงประกาศ"
        ,"Add your first item to start sharing.": "เพิ่มสิ่งของชิ้นแรกเพื่อเริ่มแบ่งปัน"
        ,"Currently with borrower": "อยู่กับผู้ยืม"
        ,"Return awaiting confirmation": "รอเจ้าของยืนยันการคืน"
        ,"Free plan": "แผนฟรี"
        ,"Rental type": "รูปแบบการให้ยืม"
        ,"Deposit": "เงินประกัน"
        ,"Price per day": "ราคาต่อวัน"
    };

    const placeholders = {
        "What do you need today?": "วันนี้คุณต้องการยืมอะไร?",
        "Search name, category or description": "ค้นหาจากชื่อ หมวดหมู่ หรือรายละเอียด",
        "Tell the owner what you need it for": "บอกเจ้าของว่าต้องการนำไปใช้อะไร",
        "name@university.ac.th": "ชื่อ@มหาวิทยาลัย.ac.th"
    };

    function t(english, translated) {
        return language === "th" ? (translated || thai[english] || english) : english;
    }

    function translateText(value) {
        const trimmed = value.trim();
        if (!trimmed) return value;
        let translated = thai[trimmed];
        if (!translated) {
            const patterns = [
                [/^(\d+) items? found$/, "$1 รายการที่พบ"],
                [/^(\d+) items?$/, "$1 รายการ"],
                [/^by (.+)$/, "โดย $1"],
                [/^Owner: (.+)$/, "เจ้าของ: $1"],
                [/^Until (.+)$/, "ถึง $1"],
                [/^(\d+) requests? waiting$/, "$1 คำขอที่รออนุมัติ"],
                [/^(\d+) days?$/, "$1 วัน"]
            ];
            const match = patterns.find(([pattern]) => pattern.test(trimmed));
            if (match) translated = trimmed.replace(match[0], match[1]);
        }
        if (!translated) return value;
        return value.replace(trimmed, translated);
    }

    function apply(root) {
        document.documentElement.lang = language === "th" ? "th" : "en";
        if (language !== "th") return;
        const walker = document.createTreeWalker(root || document.body, NodeFilter.SHOW_TEXT);
        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);
        nodes.forEach((node) => {
            if (["SCRIPT", "STYLE", "CODE"].includes(node.parentElement?.tagName)) return;
            node.nodeValue = translateText(node.nodeValue);
        });
        (root || document).querySelectorAll?.("[placeholder]").forEach((element) => {
            if (placeholders[element.placeholder]) element.placeholder = placeholders[element.placeholder];
        });
    }

    function setLanguage(next) {
        language = next === "en" ? "en" : "th";
        localStorage.setItem(LANGUAGE_KEY, language);
        window.dispatchEvent(new CustomEvent("uniborrow:language"));
    }

    window.UniBorrowI18n = {
        t,
        apply,
        setLanguage,
        getLanguage: () => language,
        locale: () => language === "th" ? "th-TH" : "en-US",
        currency(value) {
            return new Intl.NumberFormat(language === "th" ? "th-TH" : "en-US", { style: "currency", currency: "THB", maximumFractionDigits: 2 }).format(Number(value || 0));
        }
    };
})();
