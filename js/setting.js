

console.log("setting.js loaded");


// ====================
// สำรองข้อมูลและกู้คืนข้อมูล
// ====================
function backupFarmData() {

    const data = {

        expenses:
            JSON.parse(
                localStorage.getItem("expenses")
            ) || [],

        fields:
            JSON.parse(
                localStorage.getItem("fields")
            ) || [],

        assets:
            JSON.parse(
                localStorage.getItem("assets")
            ) || []

    };

    const json =
        JSON.stringify(
            data,
            null,
            2
        );

    const blob =
        new Blob(
            [json],
            { type: "application/json" }
        );

    const url =
        URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    a.href = url;

    a.download =
        "rice-farm-backup.json";

    a.click();

// บันทึกวันที่สำรองล่าสุด
    localStorage.setItem(
    "lastBackup",
    new Date().toLocaleString("th-TH")
);
}


// ====================
// แสดงข้อมูลสถานะของ localStorage
// ====================
function renderStorageInfo() {

    const fields = JSON.parse(localStorage.getItem("fields") || "[]");

    const fieldCosts = JSON.parse(localStorage.getItem("fieldCosts") || "[]");

    const incomeRecords = JSON.parse(localStorage.getItem("incomeRecords") || "[]");

    const assets = JSON.parse(localStorage.getItem("assets") || "[]");

    const transactionCount = fieldCosts.length + incomeRecords.length;

    const fieldCountEl = document.getElementById("fieldCount");
    if (fieldCountEl) fieldCountEl.textContent = fields.length;

    const transactionCountEl = document.getElementById("transactionCount");
    if (transactionCountEl) transactionCountEl.textContent = transactionCount;

    const assetCountEl = document.getElementById("assetCount");
    if (assetCountEl) assetCountEl.textContent = assets.length;

    let totalBytes = 0;

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        totalBytes += key.length + value.length;
    }

    const sizeKB = (totalBytes / 1024).toFixed(2);

    const storageSizeEl = document.getElementById("storageSize");
    if (storageSizeEl) storageSizeEl.textContent = `${sizeKB} KB`;

const lastBackupEl = document.getElementById("lastBackup");
if (lastBackupEl) lastBackupEl.textContent = localStorage.getItem("lastBackup") || "-";
}

// ====================
// กู้คืนข้อมูลจากไฟล์สำรอง
// ====================
function restoreFarmData() {

    const file =
        document.getElementById(
            "restoreFile"
        ).files[0];

    if (!file) {

        alert(
            "กรุณาเลือกไฟล์"
        );

        return;

    }

    const reader =
        new FileReader();

    reader.onload = function(event) {

        try {

            const data =
                JSON.parse(
                    event.target.result
                );

            localStorage.setItem(
                "expenses",
                JSON.stringify(
                    data.expenses || []
                )
            );

            localStorage.setItem(
                "fields",
                JSON.stringify(
                    data.fields || []
                )
            );

            localStorage.setItem(
                "assets",
                JSON.stringify(
                    data.assets || []
                )
            );

            alert(
                "Restore สำเร็จ"
            );

        } catch {

            alert(
                "ไฟล์ไม่ถูกต้อง"
            );

        }

    };

    reader.readAsText(file);

}

// ====================
// ล้างข้อมูลทั้งหมด
// ====================
function clearAllData() {

    const confirmDelete =
        confirm(
            "ต้องการล้างข้อมูลทั้งหมดหรือไม่ ?"
        );

    if (!confirmDelete) {
        return;
    }

    localStorage.clear();

    alert(
        "ล้างข้อมูลเรียบร้อย"
    );

}

renderStorageInfo();
