const transactionGroups = [
    { id: "field_cost", label: "à¸•à¹‰à¸™à¸—à¸¸à¸™à¹à¸›à¸¥à¸‡à¸™à¸²" },
    { id: "income", label: "à¸£à¸²à¸¢à¸£à¸±à¸š" },
    { id: "overhead", label: "à¸„à¹ˆà¸²à¹ƒà¸Šà¹‰à¸ˆà¹ˆà¸²à¸¢à¸ªà¹ˆà¸§à¸™à¸à¸¥à¸²à¸‡" },
    { id: "asset", label: "à¸—à¸£à¸±à¸žà¸¢à¹Œà¸ªà¸´à¸™" }
];

const categories = {
    field_cost: [
        { id: "land", label: "à¹€à¸•à¸£à¸µà¸¢à¸¡à¸”à¸´à¸™" },
        { id: "seed", label: "à¹€à¸¡à¸¥à¹‡à¸”à¸žà¸±à¸™à¸˜à¸¸à¹Œ" },
        { id: "fertilizer", label: "à¸›à¸¸à¹‹à¸¢" },
        { id: "chemical", label: "à¸¢à¸²" },
        { id: "machine", label: "à¹€à¸„à¸£à¸·à¹ˆà¸­à¸‡à¸ˆà¸±à¸à¸£" },
        { id: "labor", label: "à¹à¸£à¸‡à¸‡à¸²à¸™" },
        { id: "rent", label: "à¸„à¹ˆà¸²à¹€à¸Šà¹ˆà¸²" },
        { id: "harvest", label: "à¹€à¸à¹‡à¸šà¹€à¸à¸µà¹ˆà¸¢à¸§" },
        { id: "fuel", label: "à¸„à¹ˆà¸²à¸™à¹‰à¸³à¸¡à¸±à¸™" },
        { id: "other", label: "à¸­à¸·à¹ˆà¸™ à¹†" }
    ],
    income: [
        { id: "rice_sale", label: "à¸‚à¸²à¸¢à¸‚à¹‰à¸²à¸§" },
        { id: "straw_sale", label: "à¸‚à¸²à¸¢à¸Ÿà¸²à¸‡à¸‚à¹‰à¸²à¸§" },
        { id: "subsidy", label: "à¹€à¸‡à¸´à¸™à¸­à¸¸à¸”à¸«à¸™à¸¸à¸™à¸£à¸±à¸" },
        { id: "other_income", label: "à¸£à¸²à¸¢à¸£à¸±à¸šà¸­à¸·à¹ˆà¸™ à¹†" }
    ],
    overhead: [
        { id: "repair", label: "à¸‹à¹ˆà¸­à¸¡à¹€à¸„à¸£à¸·à¹ˆà¸­à¸‡à¸ˆà¸±à¸à¸£" },
        { id: "phone", label: "à¹‚à¸—à¸£à¸¨à¸±à¸žà¸—à¹Œ" },
        { id: "travel", label: "à¹€à¸”à¸´à¸™à¸—à¸²à¸‡" },
        { id: "fuel_transport", label: "à¸™à¹‰à¸³à¸¡à¸±à¸™à¸‚à¸™à¸ªà¹ˆà¸‡" },
        { id: "admin", label: "à¸‡à¸²à¸™à¹€à¸­à¸à¸ªà¸²à¸£" },
        { id: "office", label: "à¸ªà¸³à¸™à¸±à¸à¸‡à¸²à¸™" },
        { id: "other_overhead", label: "à¸­à¸·à¹ˆà¸™ à¹†" }
    ]
};

const chartColors = [
    "#2f7d32",
    "#d94b4b",
    "#2f80ed",
    "#f2a541",
    "#8b5cf6",
    "#16a085",
    "#d66ba0",
    "#6b7280",
    "#b7791f"
];

let fields = [];
let fieldCosts = [];
let incomeRecords = [];
let overheadCosts = [];
let assets = [];
let deletedTransactions = [];
let editingFieldId = null;
let editingTransactionId = null;
let currentGroup = "field_cost";
let currentCategory = getDefaultCategory(currentGroup);

function getDefaultCategory(group) {
    if (!categories[group]) {
        return "";
    }

    return categories[group][0].id;
}

function getCategoryLabel(group, categoryId) {
    const groupCategories =
        categories[group] || [];

    const category =
        groupCategories.find(item => item.id === categoryId);

    return category ? category.label : "à¹„à¸¡à¹ˆà¸£à¸°à¸šà¸¸à¸«à¸¡à¸§à¸”";
}

function getGroupLabel(groupId) {
    const group =
        transactionGroups.find(item => item.id === groupId);

    return group ? group.label : "à¹„à¸¡à¹ˆà¸£à¸°à¸šà¸¸à¸à¸¥à¸¸à¹ˆà¸¡";
}

function getFieldName(fieldId) {
    const field =
        fields.find(item => item.id === Number(fieldId));

    return field ? field.name : "à¹„à¸¡à¹ˆà¸£à¸°à¸šà¸¸à¹à¸›à¸¥à¸‡";
}

function formatNumber(value) {
    return Number(value || 0).toLocaleString("th-TH");
}

function escapeHTML(value) {
    return String(value || "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function createId() {
    return Date.now() + Math.floor(Math.random() * 1000);
}

function getElement(id) {
    return document.getElementById(id);
}

function showElement(id, shouldShow) {
    const element =
        getElement(id);

    if (!element) {
        return;
    }

    element.classList.toggle("hidden", !shouldShow);
}

function toggleMenu() {
    const nav =
        getElement("appNav");

    if (!nav) {
        return;
    }

    nav.classList.toggle("open");
}

// ====================
// Storage
// ====================

function loadData() {
    deletedTransactions =
        JSON.parse(localStorage.getItem("deletedTransactions") || "[]");

    fields =
        JSON.parse(localStorage.getItem("fields") || "[]");

    fieldCosts =
        JSON.parse(localStorage.getItem("fieldCosts") || "[]");

    incomeRecords =
        JSON.parse(localStorage.getItem("incomeRecords") || "[]");

    overheadCosts =
        JSON.parse(localStorage.getItem("overheadCosts") || "[]");

    assets =
        JSON.parse(localStorage.getItem("assets") || "[]");

    migrateOldExpenses();
    applyDeletedTransactions();
}

function migrateOldExpenses() {
    const oldExpenses =
        JSON.parse(localStorage.getItem("expenses") || "[]");

    if (oldExpenses.length === 0 || fieldCosts.length > 0) {
        return;
    }

    fieldCosts =
        oldExpenses
            .filter(item => item.type !== "income")
            .map(item => ({
                id: item.id || createId(),
                transactionGroup: "field_cost",
                fieldId: item.fieldId ? Number(item.fieldId) : null,
                name: item.name,
                amount: Number(item.amount || 0),
                quantity: Number(item.quantity || 1),
                unit: item.unit || "à¸£à¸²à¸¢à¸à¸²à¸£",
                category: item.category || getDefaultCategory("field_cost"),
                createdAt: item.createdAt || new Date().toLocaleString("th-TH")
            }));

    incomeRecords =
        oldExpenses
            .filter(item => item.type === "income")
            .map(item => ({
                id: item.id || createId(),
                transactionGroup: "income",
                fieldId: item.fieldId ? Number(item.fieldId) : null,
                name: item.name,
                amount: Number(item.amount || 0),
                category: item.category || getDefaultCategory("income"),
                createdAt: item.createdAt || new Date().toLocaleString("th-TH")
            }));

    saveFieldCosts();
    saveIncomes();
}

function saveFields() {
    localStorage.setItem("fields", JSON.stringify(fields));
}

function saveFieldCosts() {
    localStorage.setItem("fieldCosts", JSON.stringify(fieldCosts));
}

function saveIncomes() {
    localStorage.setItem("incomeRecords", JSON.stringify(incomeRecords));
}

function saveOverheads() {
    localStorage.setItem("overheadCosts", JSON.stringify(overheadCosts));
}

function saveAssets() {
    localStorage.setItem("assets", JSON.stringify(assets));
}

function saveDeletedTransactions() {
    localStorage.setItem(
        "deletedTransactions",
        JSON.stringify(deletedTransactions)
    );
}

function getTransactionAmount(group, item) {
    if (group === "asset") {
        return Number(item.purchasePrice || item.amount || 0);
    }

    return Number(item.amount || item.purchasePrice || 0);
}

function getTransactionName(item) {
    return String(item.name || "").trim().toLowerCase();
}

function isSameTransaction(group, item, deletedItem) {
    if (deletedItem.group !== group) {
        return false;
    }

    const sameId =
        String(item.id) === String(deletedItem.id);

    const sameContent =
        getTransactionName(item) === deletedItem.name &&
        getTransactionAmount(group, item) === deletedItem.amount;

    return sameId || sameContent;
}

function rememberDeletedTransaction(group, item) {
    if (!item) {
        return;
    }

    const deletedItem = {
        group,
        id: String(item.id),
        name: getTransactionName(item),
        amount: getTransactionAmount(group, item)
    };

    const alreadySaved =
        deletedTransactions.some(saved =>
            saved.group === deletedItem.group &&
            saved.id === deletedItem.id
        );

    if (!alreadySaved) {
        deletedTransactions.push(deletedItem);
        saveDeletedTransactions();
    }
}

function applyDeletedTransactions() {
    if (deletedTransactions.length === 0) {
        return;
    }

    fieldCosts =
        fieldCosts.filter(item =>
            !deletedTransactions.some(deletedItem =>
                isSameTransaction("field_cost", item, deletedItem)
            )
        );

    overheadCosts =
        overheadCosts.filter(item =>
            !deletedTransactions.some(deletedItem =>
                isSameTransaction("overhead", item, deletedItem)
            )
        );

    incomeRecords =
        incomeRecords.filter(item =>
            !deletedTransactions.some(deletedItem =>
                isSameTransaction("income", item, deletedItem)
            )
        );

    assets =
        assets.filter(item =>
            !deletedTransactions.some(deletedItem =>
                isSameTransaction("asset", item, deletedItem)
            )
        );

    saveFieldCosts();
    saveIncomes();
    saveOverheads();
    saveAssets();
    removeDeletedLegacyExpenses();
}

function removeDeletedLegacyExpenses() {
    const oldExpenses =
        JSON.parse(localStorage.getItem("expenses") || "[]");

    if (oldExpenses.length === 0) {
        return;
    }

    const keptExpenses =
        oldExpenses.filter(item =>
            !deletedTransactions.some(deletedItem =>
                isSameTransaction(
                    item.transactionGroup || (item.type === "income" ? "income" : "field_cost"),
                    item,
                    deletedItem
                )
            )
        );

    localStorage.setItem(
        "expenses",
        JSON.stringify(keptExpenses)
    );
}

// ====================
// Field CRUD
// ====================

function saveField() {
    const name =
        getElement("fieldName").value.trim();

    const area =
        Number(getElement("fieldArea").value);

    const location =
        getElement("fieldLocation").value.trim();

    if (!name || area <= 0 || !location) {
        alert("à¸à¸£à¸­à¸à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¹à¸›à¸¥à¸‡à¸™à¸²à¹ƒà¸«à¹‰à¸„à¸£à¸š");
        return;
    }

    if (editingFieldId) {
        const field =
            fields.find(item => item.id === editingFieldId);

        field.name = name;
        field.area = area;
        field.location = location;

        editingFieldId = null;
        getElement("fieldSaveBtn").textContent = "à¹€à¸žà¸´à¹ˆà¸¡à¹à¸›à¸¥à¸‡à¸™à¸²";
    } else {
        fields.push({
            id: createId(),
            name,
            area,
            location,
            createdAt: new Date().toLocaleDateString("th-TH")
        });
    }

    saveFields();
    clearFieldForm();
    renderFields();
}

function editField(id) {
    const field =
        fields.find(item => item.id === id);

    if (!field) {
        return;
    }

    getElement("fieldName").value = field.name;
    getElement("fieldArea").value = field.area;
    getElement("fieldLocation").value = field.location;

    editingFieldId = id;
    getElement("fieldSaveBtn").textContent = "à¸šà¸±à¸™à¸—à¸¶à¸à¸à¸²à¸£à¹à¸à¹‰à¹„à¸‚";
}

function deleteField(id) {
    const field =
        fields.find(item => item.id === id);

    if (!field) {
        return;
    }

    const confirmed =
        confirm(`à¸¥à¸šà¹à¸›à¸¥à¸‡à¸™à¸² "${field.name}" à¹à¸¥à¸°à¸•à¹‰à¸™à¸—à¸¸à¸™à¸‚à¸­à¸‡à¹à¸›à¸¥à¸‡à¸™à¸µà¹‰?`);

    if (!confirmed) {
        return;
    }

    fields =
        fields.filter(item => item.id !== id);

    fieldCosts =
        fieldCosts.filter(item => item.fieldId !== id);

    incomeRecords =
        incomeRecords.filter(item => item.fieldId !== id);

    saveFields();
    saveFieldCosts();
    saveIncomes();
    renderFields();
}

function clearFieldForm() {
    getElement("fieldName").value = "";
    getElement("fieldArea").value = "";
    getElement("fieldLocation").value = "";
}

function renderFields() {
    const fieldList =
        getElement("fieldList");

    if (!fieldList) {
        return;
    }

    fieldList.innerHTML = "";

    if (fields.length === 0) {
        fieldList.innerHTML =
            `<li class="empty-state">à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¸¡à¸µà¹à¸›à¸¥à¸‡à¸™à¸²</li>`;
        return;
    }

    fields.forEach(field => {
        const li =
            document.createElement("li");

        li.innerHTML = `
            <div class="list-row">
                <div class="list-info">
                    <strong>${escapeHTML(field.name)}</strong>
                    <span>${formatNumber(field.area)} à¹„à¸£à¹ˆ</span>
                    <small>${escapeHTML(field.location)}</small>
                </div>

                <div class="row-actions">
                    <button onclick="editField(${field.id})">à¹à¸à¹‰à¹„à¸‚</button>
                    <button onclick="deleteField(${field.id})">à¸¥à¸š</button>
                </div>
            </div>
        `;

        fieldList.appendChild(li);
    });
}

// ====================
// Transaction Form
// ====================

function setTransactionGroup(group) {
    currentGroup = group;
    currentCategory = getDefaultCategory(group);
    editingTransactionId = null;

    updateGroupButtons();
    updateDynamicForm();
    renderCategories();
    clearTransactionForm();
}

function setCategory(categoryId) {
    currentCategory = categoryId;
    renderCategories();
    updateIncomeQuantityPlaceholders();
}

function updateGroupButtons() {
    const buttonMap = {
        field_cost: getElement("fieldCostBtn"),
        income: getElement("incomeBtn"),
        overhead: getElement("overheadBtn"),
        asset: getElement("assetBtn")
    };

    Object.keys(buttonMap).forEach(group => {
        if (!buttonMap[group]) {
            return;
        }

        buttonMap[group].classList.toggle(
            "active-group",
            currentGroup === group
        );
    });
}

function updateDynamicForm() {
    const isFieldCost =
        currentGroup === "field_cost";

    const isIncome =
        currentGroup === "income";

    const isOverhead =
        currentGroup === "overhead";

    const isAsset =
        currentGroup === "asset";

    showElement("fieldGroup", isFieldCost || isIncome);
    showElement("categoryGroup", isFieldCost || isIncome || isOverhead);
    showElement("quantityGroup", isFieldCost || isIncome || isAsset);
    showElement("usefulLifeGroup", isAsset);

    if (getElement("nameLabel")) {
        getElement("nameLabel").textContent =
            isAsset ? "à¸Šà¸·à¹ˆà¸­à¸—à¸£à¸±à¸žà¸¢à¹Œà¸ªà¸´à¸™" : "à¸Šà¸·à¹ˆà¸­à¸£à¸²à¸¢à¸à¸²à¸£";
    }

    if (getElement("amountLabel")) {
        getElement("amountLabel").textContent =
            isAsset ? "à¸£à¸²à¸„à¸²à¸‹à¸·à¹‰à¸­" : "à¸ˆà¸³à¸™à¸§à¸™à¹€à¸‡à¸´à¸™";
    }

    if (getElement("itemName")) {
        getElement("itemName").placeholder =
            isAsset ? "à¹€à¸Šà¹ˆà¸™ à¸£à¸–à¹„à¸–" : isIncome ? "à¹€à¸Šà¹ˆà¸™ à¸‚à¸²à¸¢à¸‚à¹‰à¸²à¸§" : "à¹€à¸Šà¹ˆà¸™ à¸›à¸¸à¹‹à¸¢à¸¢à¸¹à¹€à¸£à¸µà¸¢";
    }

    if (getElement("itemAmount")) {
        getElement("itemAmount").placeholder =
            isAsset ? "à¹€à¸Šà¹ˆà¸™ 120000" : "à¹€à¸Šà¹ˆà¸™ 9000";
    }
    updateIncomeQuantityPlaceholders();
}

function updateIncomeQuantityPlaceholders() {
    if (currentGroup !== "income") {
        return;
    }

    const quantityInput =
        getElement("itemQuantity");

    const unitInput =
        getElement("itemUnit");

    if (!quantityInput || !unitInput) {
        return;
    }

    if (currentCategory === "rice_sale") {
        quantityInput.placeholder = "à¹€à¸Šà¹ˆà¸™ 1000";
        unitInput.placeholder = "à¸à¸´à¹‚à¸¥à¸à¸£à¸±à¸¡";
    } else if (currentCategory === "straw_sale") {
        quantityInput.placeholder = "à¹€à¸Šà¹ˆà¸™ 120";
        unitInput.placeholder = "à¸à¹‰à¸­à¸™";
    } else {
        quantityInput.placeholder = "à¹€à¸Šà¹ˆà¸™ 1";
        unitInput.placeholder = "à¸£à¸²à¸¢à¸à¸²à¸£";
    }
}

function getDefaultIncomeUnit(categoryId) {
    if (categoryId === "rice_sale") {
        return "à¸à¸´à¹‚à¸¥à¸à¸£à¸±à¸¡";
    }

    if (categoryId === "straw_sale") {
        return "à¸à¹‰à¸­à¸™";
    }

    return "à¸£à¸²à¸¢à¸à¸²à¸£";
}

function formatQuantityUnit(item) {
    if (!item.quantity) {
        return "";
    }

    return ` â€¢ ${formatNumber(item.quantity)} ${item.unit || "à¸£à¸²à¸¢à¸à¸²à¸£"}`;
}

function renderCategories() {
    const categorySelect =
        getElement("categorySelect");

    if (!categorySelect || !categories[currentGroup]) {
        return;
    }

    categorySelect.innerHTML = "";

    categories[currentGroup].forEach(category => {
        const option =
            document.createElement("option");

        option.value = category.id;
        option.textContent = category.label;

        categorySelect.appendChild(option);
    });

    categorySelect.value = currentCategory;
}

function renderFieldSelect() {
    const fieldSelect =
        getElement("fieldSelect");

    const fieldHint =
        getElement("fieldHint");

    if (!fieldSelect) {
        return;
    }

    fieldSelect.innerHTML = "";

    if (fields.length === 0) {
        fieldSelect.innerHTML =
            `<option value="">à¹€à¸žà¸´à¹ˆà¸¡à¹à¸›à¸¥à¸‡à¸™à¸²à¸à¹ˆà¸­à¸™</option>`;

        fieldSelect.disabled = true;

        if (fieldHint) {
            fieldHint.innerHTML =
                `à¹„à¸›à¸—à¸µà¹ˆà¸«à¸™à¹‰à¸² <a href="field.html">à¹à¸›à¸¥à¸‡à¸™à¸²</a> à¹€à¸žà¸·à¹ˆà¸­à¹€à¸žà¸´à¹ˆà¸¡à¹à¸›à¸¥à¸‡à¹à¸£à¸`;
        }

        return;
    }

    fieldSelect.disabled = false;

    fields.forEach(field => {
        const option =
            document.createElement("option");

        option.value = field.id;
        option.textContent =
            `${field.name} (${formatNumber(field.area)} à¹„à¸£à¹ˆ)`;

        fieldSelect.appendChild(option);
    });

    if (fieldHint) {
        fieldHint.textContent = "";
    }
}

function saveTransaction() {
    if (currentGroup === "field_cost") {
        saveFieldCost();
    } else if (currentGroup === "income") {
        saveIncomeRecord();
    } else if (currentGroup === "overhead") {
        saveOverheadCost();
    } else {
        saveAsset();
    }
}

function saveFieldCost() {
    const fieldId =
        Number(getElement("fieldSelect").value);

    const name =
        getElement("itemName").value.trim();

    const amount =
        Number(getElement("itemAmount").value);

    const quantity =
        Number(getElement("itemQuantity").value || 0);

    const unit =
        getElement("itemUnit").value.trim();

    if (!fieldId) {
        alert("à¸à¸£à¸¸à¸“à¸²à¹€à¸¥à¸·à¸­à¸à¹à¸›à¸¥à¸‡à¸™à¸²");
        return;
    }

    if (!name || amount <= 0) {
        alert("à¸à¸£à¸­à¸à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸•à¹‰à¸™à¸—à¸¸à¸™à¹à¸›à¸¥à¸‡à¸™à¸²à¹ƒà¸«à¹‰à¸„à¸£à¸š");
        return;
    }

    const data = {
        transactionGroup: "field_cost",
        fieldId,
        name,
        amount,
        quantity: Number(getElement("itemQuantity").value || 1),
        unit: getElement("itemUnit").value.trim() || "à¸£à¸²à¸¢à¸à¸²à¸£",
        category: currentCategory,
        createdAt: new Date().toLocaleString("th-TH")
    };

    if (editingTransactionId) {
        updateItem(fieldCosts, editingTransactionId, data);
        editingTransactionId = null;
    } else {
        fieldCosts.push({ id: createId(), ...data });
    }

    saveFieldCosts();
    afterSaveTransaction();
}

function saveIncomeRecord() {
    const fieldId =
        Number(getElement("fieldSelect").value);

    const name =
        getElement("itemName").value.trim();

    const amount =
        Number(getElement("itemAmount").value);

    const quantity =
        Number(getElement("itemQuantity").value || 0);

    const unit =
        getElement("itemUnit").value.trim();

    if (!fieldId) {
        alert("à¸à¸£à¸¸à¸“à¸²à¹€à¸¥à¸·à¸­à¸à¹à¸›à¸¥à¸‡à¸™à¸²");
        return;
    }

    if (!name || amount <= 0) {
        alert("à¸à¸£à¸­à¸à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸£à¸²à¸¢à¸£à¸±à¸šà¹ƒà¸«à¹‰à¸„à¸£à¸š");
        return;
    }

    if (
        (currentCategory === "rice_sale" || currentCategory === "straw_sale") &&
        quantity <= 0
    ) {
        alert("à¸à¸£à¸­à¸à¸ˆà¸³à¸™à¸§à¸™à¸—à¸µà¹ˆà¸‚à¸²à¸¢à¸”à¹‰à¸§à¸¢");
        return;
    }

    const data = {
        transactionGroup: "income",
        fieldId,
        name,
        amount,
        quantity,
        unit: unit || getDefaultIncomeUnit(currentCategory),
        category: currentCategory,
        createdAt: new Date().toLocaleString("th-TH")
    };

    if (editingTransactionId) {
        updateItem(incomeRecords, editingTransactionId, data);
        editingTransactionId = null;
    } else {
        incomeRecords.push({ id: createId(), ...data });
    }

    saveIncomes();
    afterSaveTransaction();
}

function saveOverheadCost() {
    const name =
        getElement("itemName").value.trim();

    const amount =
        Number(getElement("itemAmount").value);

    if (!name || amount <= 0) {
        alert("à¸à¸£à¸­à¸à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸„à¹ˆà¸²à¹ƒà¸Šà¹‰à¸ˆà¹ˆà¸²à¸¢à¸ªà¹ˆà¸§à¸™à¸à¸¥à¸²à¸‡à¹ƒà¸«à¹‰à¸„à¸£à¸š");
        return;
    }

    const data = {
        transactionGroup: "overhead",
        name,
        amount,
        category: currentCategory,
        createdAt: new Date().toLocaleString("th-TH")
    };

    if (editingTransactionId) {
        updateItem(overheadCosts, editingTransactionId, data);
        editingTransactionId = null;
    } else {
        overheadCosts.push({ id: createId(), ...data });
    }

    saveOverheads();
    afterSaveTransaction();
}

function saveAsset() {
    const name =
        getElement("itemName").value.trim();

    const purchasePrice =
        Number(getElement("itemAmount").value);

    const usefulLifeYears =
        Number(getElement("usefulLifeYears").value);

    if (!name || purchasePrice <= 0 || usefulLifeYears <= 0) {
        alert("à¸à¸£à¸­à¸à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸—à¸£à¸±à¸žà¸¢à¹Œà¸ªà¸´à¸™à¹ƒà¸«à¹‰à¸„à¸£à¸š");
        return;
    }

    const data = {
        transactionGroup: "asset",
        name,
        purchasePrice,
        quantity: Number(getElement("itemQuantity").value || 1),
        unit: getElement("itemUnit").value.trim() || "à¸Šà¸´à¹‰à¸™",
        purchaseDate: new Date().toLocaleDateString("th-TH"),
        usefulLifeYears,
        createdAt: new Date().toLocaleString("th-TH")
    };

    if (editingTransactionId) {
        updateItem(assets, editingTransactionId, data);
        editingTransactionId = null;
    } else {
        assets.push({ id: createId(), ...data });
    }

    saveAssets();
    afterSaveTransaction();
}

function updateItem(collection, id, data) {
    const item =
        collection.find(entry => Number(entry.id) === Number(id));

    Object.assign(item, data);
}

function afterSaveTransaction() {
    getElement("saveBtn").textContent = "à¹€à¸žà¸´à¹ˆà¸¡à¸£à¸²à¸¢à¸à¸²à¸£";
    clearTransactionForm();
    renderTransactionsPage();
    renderAssetList();
    renderDashboard();
}

function clearTransactionForm() {
    const ids = [
        "itemName",
        "itemAmount",
        "itemQuantity",
        "itemUnit",
        "usefulLifeYears"
    ];

    ids.forEach(id => {
        if (getElement(id)) {
            getElement(id).value = "";
        }
    });
}

function editTransaction(group, id) {
    currentGroup = group;
    editingTransactionId = String(id);

    updateGroupButtons();
    updateDynamicForm();
    renderCategories();

    let item;

    if (group === "field_cost") {
        item = fieldCosts.find(entry => Number(entry.id) === Number(id));
    } else if (group === "income") {
        item = incomeRecords.find(entry => Number(entry.id) === Number(id));
    } else if (group === "overhead") {
        item = overheadCosts.find(entry => Number(entry.id) === Number(id));
    } else {
        item = assets.find(entry => Number(entry.id) === Number(id));
    }

    if (!item) {
        return;
    }

    if (group === "field_cost") {
        getElement("fieldSelect").value = item.fieldId || "";
        currentCategory = item.category;
        getElement("itemAmount").value = item.amount;
    } else if (group === "income") {
        getElement("fieldSelect").value = item.fieldId || "";
        currentCategory = item.category;
        getElement("itemAmount").value = item.amount;
    } else if (group === "overhead") {
        currentCategory = item.category;
        getElement("itemAmount").value = item.amount;
    } else {
        getElement("itemAmount").value = item.purchasePrice;
        getElement("usefulLifeYears").value = item.usefulLifeYears;
    }

    getElement("itemName").value = item.name;
    getElement("itemQuantity").value = item.quantity || "";
    getElement("itemUnit").value = item.unit || "";
    getElement("saveBtn").textContent = "à¸šà¸±à¸™à¸—à¸¶à¸à¸à¸²à¸£à¹à¸à¹‰à¹„à¸‚";

    renderCategories();
}

function deleteTransaction(group, id) {
    const targetId =
        String(id);

    let deletedItem;

    if (group === "field_cost") {
        deletedItem =
            fieldCosts.find(item => String(item.id) === targetId);

        rememberDeletedTransaction(group, deletedItem);

        fieldCosts =
            fieldCosts.filter(item => String(item.id) !== targetId);
        saveFieldCosts();
    } else if (group === "income") {
        deletedItem =
            incomeRecords.find(item => String(item.id) === targetId);

        rememberDeletedTransaction(group, deletedItem);

        incomeRecords =
            incomeRecords.filter(item => String(item.id) !== targetId);
        saveIncomes();
    } else if (group === "overhead") {
        deletedItem =
            overheadCosts.find(item => String(item.id) === targetId);

        rememberDeletedTransaction(group, deletedItem);

        overheadCosts =
            overheadCosts.filter(item => String(item.id) !== targetId);
        saveOverheads();
    } else {
        deletedItem =
            assets.find(item => String(item.id) === targetId);

        rememberDeletedTransaction(group, deletedItem);

        assets =
            assets.filter(item => String(item.id) !== targetId);
        saveAssets();
    }

    renderTransactionsPage();
    renderAssetList();
    renderDashboard();
}

// ====================
// Rendering
// ====================

function renderTransactionsPage() {
    renderFieldSelect();
    updateGroupButtons();
    updateDynamicForm();
    renderCategories();
    renderTransactionList();
    renderTransactionTotals();
}

function renderTransactionList() {
    const list =
        getElement("transactionList");

    if (!list) {
        return;
    }

    const items = [
        ...fieldCosts.map(item => ({ ...item, viewGroup: "field_cost" })),
        ...incomeRecords.map(item => ({ ...item, viewGroup: "income" })),
        ...overheadCosts.map(item => ({ ...item, viewGroup: "overhead" })),
        ...assets.map(item => ({ ...item, viewGroup: "asset" }))
    ].sort((a, b) => b.id - a.id).slice(0, 5);

    list.innerHTML = "";

    if (items.length === 0) {
        list.innerHTML =
            `<li class="empty-state">à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¸¡à¸µà¸£à¸²à¸¢à¸à¸²à¸£</li>`;
        return;
    }

    items.forEach(item => {
        const li =
            document.createElement("li");

        li.innerHTML =
            createTransactionHTML(item);

        list.appendChild(li);
    });
}

function createTransactionHTML(item) {
    const groupLabel =
        transactionGroups.find(group => group.id === item.viewGroup).label;

    const amount =
        item.viewGroup === "asset" ? item.purchasePrice : item.amount;

    const detail =
        item.viewGroup === "field_cost"
            ? `${getFieldName(item.fieldId)} â€¢ ${getCategoryLabel("field_cost", item.category)}`
            : item.viewGroup === "income"
                ? `${getFieldName(item.fieldId)} â€¢ ${getCategoryLabel("income", item.category)}${formatQuantityUnit(item)}`
            : item.viewGroup === "overhead"
                ? getCategoryLabel("overhead", item.category)
                : `${formatNumber(item.quantity)} ${escapeHTML(item.unit)} â€¢ ${formatNumber(item.usefulLifeYears)} à¸›à¸µ`;

    return `
        <div class="list-row ${item.viewGroup}">
            <div class="list-info">
                <strong>${escapeHTML(item.name)}</strong>
                <span>${formatNumber(amount)} à¸šà¸²à¸—</span>
                <small>${groupLabel}</small>
                <small>${escapeHTML(detail)}</small>
                <small>${escapeHTML(item.createdAt || item.purchaseDate || "à¹„à¸¡à¹ˆà¸¡à¸µà¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸§à¸±à¸™à¸—à¸µà¹ˆ")}</small>
            </div>

            <div class="row-actions">
                <button onclick="editTransaction('${item.viewGroup}', '${item.id}')">à¹à¸à¹‰à¹„à¸‚</button>
                <button onclick="deleteTransaction('${item.viewGroup}', '${item.id}')">à¸¥à¸š</button>
            </div>
        </div>
    `;
}

function renderTransactionTotals() {
    if (!getElement("fieldCostTotal")) {
        return;
    }

    getElement("incomeTotal").textContent =
        formatNumber(sumBy(incomeRecords, "amount"));

    getElement("fieldCostTotal").textContent =
        formatNumber(sumBy(fieldCosts, "amount"));

    getElement("overheadTotal").textContent =
        formatNumber(sumBy(overheadCosts, "amount"));

    getElement("assetTotal").textContent =
        formatNumber(sumBy(assets, "purchasePrice"));

    getElement("farmProfitTotal").textContent =
        formatNumber(
            sumBy(incomeRecords, "amount") -
            sumBy(fieldCosts, "amount")
        );
}

function renderAssetList() {
    const assetList =
        getElement("assetList");

    if (!assetList) {
        return;
    }

    assetList.innerHTML = "";

    if (assets.length === 0) {
        assetList.innerHTML =
            `<li class="empty-state">à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¸¡à¸µà¸—à¸£à¸±à¸žà¸¢à¹Œà¸ªà¸´à¸™</li>`;
        return;
    }

    assets.forEach(asset => {
        const li =
            document.createElement("li");

        li.innerHTML = `
            <div class="list-row asset">
                <div class="list-info">
                    <strong>${escapeHTML(asset.name)}</strong>
                    <span>${formatNumber(asset.quantity)} ${escapeHTML(asset.unit)}</span>
                    <small>${formatNumber(asset.purchasePrice)} à¸šà¸²à¸—</small>
                    <small>${formatNumber(asset.usefulLifeYears)} à¸›à¸µ</small>
                    <small>${escapeHTML(asset.purchaseDate)}</small>
                </div>

                <div class="row-actions">
                    <button onclick="deleteTransaction('asset', '${asset.id}')">à¸¥à¸š</button>
                </div>
            </div>
        `;

        assetList.appendChild(li);
    });
}

// ====================
// Summaries
// ====================

function sumBy(items, key) {
    return items.reduce(
        (total, item) => total + Number(item[key] || 0),
        0
    );
}

function getFieldCosts(fieldId) {
    return fieldCosts.filter(
        cost => cost.fieldId === fieldId
    );
}

function getFieldIncomes(fieldId) {
    return incomeRecords.filter(
        income => income.fieldId === fieldId
    );
}

function calculatePerRai(value, area) {
    if (!area || area <= 0) {
        return 0;
    }

    return value / area;
}

function summarizeByCategory(items, group, amountKey) {
    const totals = {};

    items.forEach(item => {
        const label =
            getCategoryLabel(group, item.category);

        totals[label] =
            (totals[label] || 0) + Number(item[amountKey] || 0);
    });

    return Object.keys(totals).map(label => ({
        label,
        amount: totals[label]
    }));
}

function combineCategorySummaries(summaries) {
    const totals = {};

    summaries.flat().forEach(part => {
        totals[part.label] =
            (totals[part.label] || 0) + Number(part.amount || 0);
    });

    return Object.keys(totals).map(label => ({
        label,
        amount: totals[label]
    }));
}

function createPieChartHTML(parts) {
    const total =
        parts.reduce(
            (sum, part) => sum + part.amount,
            0
        );

    if (total <= 0) {
        return `<div class="empty-state">à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¸¡à¸µà¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸ªà¸³à¸«à¸£à¸±à¸šà¸à¸£à¸²à¸Ÿ</div>`;
    }

    let start = 0;

    const slices =
        parts.map((part, index) => {
            const percent =
                (part.amount / total) * 100;

            const end =
                start + percent;

            const color =
                chartColors[index % chartColors.length];

            const slice =
                `${color} ${start}% ${end}%`;

            start = end;

            return slice;
        });

    const legend =
        parts.map((part, index) => {
            const percent =
                (part.amount / total) * 100;

            const color =
                chartColors[index % chartColors.length];

            return `
                <div class="chart-legend-item">
                    <span
                        class="chart-dot"
                        style="background: ${color}">
                    </span>
                    <div>
                        <strong>${escapeHTML(part.label)}</strong>
                        <small>
                            ${formatNumber(part.amount)} à¸šà¸²à¸—
                            (${percent.toFixed(1)}%)
                        </small>
                    </div>
                </div>
            `;
        }).join("");

    return `
        <div class="pie-chart-wrap">
            <div
                class="pie-chart"
                style="background: conic-gradient(${slices.join(", ")})">
                <span>${formatNumber(total)}</span>
            </div>

            <div class="chart-legend">
                ${legend}
            </div>
        </div>
    `;
}

function renderFieldSummary() {
    const summaryList =
        getElement("fieldSummaryList");

    if (!summaryList) {
        return;
    }

    summaryList.innerHTML = "";

    if (fields.length === 0) {
        summaryList.innerHTML =
            `<div class="empty-state">à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¸¡à¸µà¹à¸›à¸¥à¸‡à¸™à¸²</div>`;
        return;
        
        //à¸„à¸³à¸™à¸§à¸“à¸œà¸¥à¸œà¸¥à¸´à¸•à¹à¸¥à¸°à¸à¸³à¹„à¸£à¸•à¹ˆà¸­à¹„à¸£à¹ˆà¸ªà¸³à¸«à¸£à¸±à¸šà¹à¸•à¹ˆà¸¥à¸°à¹à¸›à¸¥à¸‡à¸™à¸²
        const yieldPerRai =
    field.harvestYieldKg && field.area
        ? (
            field.harvestYieldKg /
            field.area
        ).toFixed(2)
        : "-";

const profitPerRai =
    field.area
        ? (
            profit /
            field.area
        ).toFixed(2)
        : "-";
    }

    fields.forEach(field => {
        const costs =
            getFieldCosts(field.id);

        const incomes =
            getFieldIncomes(field.id);

        const totalCost =
            sumBy(costs, "amount");

        const totalIncome =
            sumBy(incomes, "amount");

        const profit =
            totalIncome - totalCost;

        const costPerRai =
            calculatePerRai(totalCost, field.area);

        const profitPerRai =
            calculatePerRai(profit, field.area);

        const chartParts =
            summarizeByCategory(costs, "field_cost", "amount");

        const incomeChartParts =
            summarizeByCategory(incomes, "income", "amount");

        const card =
            document.createElement("article");

        card.className = "summary-card";
        card.innerHTML = `
            <div class="summary-title">
                <strong>${escapeHTML(field.name)}</strong>
                <span>${formatNumber(field.area)} à¹„à¸£à¹ˆ</span>
            </div>

            <small>${escapeHTML(field.location)}</small>
            <div class="field-info">

    <p>
        ðŸŒ¾ à¸žà¸±à¸™à¸˜à¸¸à¹Œà¸‚à¹‰à¸²à¸§ :
        ${escapeHTML(field.riceVariety || "-")}
    </p>

    <p>
        ðŸ“… à¸§à¸±à¸™à¸—à¸µà¹ˆà¸«à¸§à¹ˆà¸²à¸™ :
        ${field.sowingDate || "-"}
    </p>

    <p>
        ðŸŒ¾ à¸§à¸±à¸™à¸—à¸µà¹ˆà¹€à¸à¹‡à¸šà¹€à¸à¸µà¹ˆà¸¢à¸§ :
        ${field.expectedHarvestDate || "-"}
    </p>

    <p>
        ðŸŒ± à¹€à¸¡à¸¥à¹‡à¸”à¸žà¸±à¸™à¸˜à¸¸à¹Œ :
        ${formatNumber(field.seedUsedKg || 0)}
        à¸à¸.
    </p>

    <p>
        ðŸšœ à¸œà¸¥à¸œà¸¥à¸´à¸• :
        ${formatNumber(field.harvestYieldKg || 0)}
        à¸à¸.
    </p>

    <p>
        ðŸ“ˆ à¸œà¸¥à¸œà¸¥à¸´à¸•à¸•à¹ˆà¸­à¹„à¸£à¹ˆ :
        ${
            field.harvestYieldKg && field.area
            ? formatNumber(
                field.harvestYieldKg / field.area
            )
            : 0
        }
        à¸à¸./à¹„à¸£à¹ˆ
    </p>

</div>
            <div class="summary-grid">
                <div>
                    <span>à¸•à¹‰à¸™à¸—à¸¸à¸™à¹à¸›à¸¥à¸‡à¸™à¸²</span>
                    <strong>${formatNumber(totalCost)}</strong>
                </div>
                <div>
                    <span>à¸£à¸²à¸¢à¸£à¸±à¸š</span>
                    <strong>${formatNumber(totalIncome)}</strong>
                </div>
                <div>
                    <span>à¸à¸³à¹„à¸£</span>
                    <strong>${formatNumber(profit)}</strong>
                </div>
                <div>
                    <span>à¸•à¹‰à¸™à¸—à¸¸à¸™/à¹„à¸£à¹ˆ</span>
                    <strong>${formatNumber(costPerRai)} à¸šà¸²à¸—</strong>
                </div>
                <div>
                    <span>à¸à¸³à¹„à¸£/à¹„à¸£à¹ˆ</span>
                    <strong>${formatNumber(profitPerRai)} à¸šà¸²à¸—</strong>
                </div>
                <div>
                    <span>à¸ˆà¸³à¸™à¸§à¸™à¸£à¸²à¸¢à¸à¸²à¸£</span>
                    <strong>${formatNumber(costs.length + incomes.length)}</strong>
                </div>
            </div>

            <div class="field-chart">
                <h3>à¸ªà¸±à¸”à¸ªà¹ˆà¸§à¸™à¸•à¹‰à¸™à¸—à¸¸à¸™</h3>
                ${createPieChartHTML(chartParts)}
            </div>

            <div class="field-chart">
                <h3>à¸ªà¸±à¸”à¸ªà¹ˆà¸§à¸™à¸£à¸²à¸¢à¸£à¸±à¸š</h3>
                ${createPieChartHTML(incomeChartParts)}
            </div>


<div class="summary-grid">
        `;

        summaryList.appendChild(card);
    });
}

function renderDashboard() {
    if (!getElement("dashboardFieldCount")) {
        return;
    }

    const totalArea =
        fields.reduce(
            (sum, field) => sum + Number(field.area || 0),
            0
        );

    const fieldCostTotal =
        sumBy(fieldCosts, "amount");

    const incomeTotal =
        sumBy(incomeRecords, "amount");

    const overheadTotal =
        sumBy(overheadCosts, "amount");

    const assetTotal =
        sumBy(assets, "purchasePrice");

    getElement("dashboardFieldCount").textContent =
        formatNumber(fields.length);

    getElement("dashboardArea").textContent =
        formatNumber(totalArea);

    getElement("dashboardFieldCosts").textContent =
        formatNumber(fieldCostTotal);

    getElement("dashboardIncome").textContent =
        formatNumber(incomeTotal);

    getElement("dashboardOverheads").textContent =
        formatNumber(overheadTotal);

    getElement("dashboardAssets").textContent =
        formatNumber(assetTotal);

    getElement("dashboardInvestment").textContent =
        formatNumber(fieldCostTotal + overheadTotal + assetTotal);

    getElement("dashboardProfit").textContent =
        formatNumber(incomeTotal - fieldCostTotal - overheadTotal);

    renderDashboardPieChart(
        fieldCostTotal,
        incomeTotal,
        overheadTotal,
        assetTotal
    );

    renderDashboardCategoryPieCharts();
}

function renderDashboardPieChart(fieldCostTotal, incomeTotal, overheadTotal, assetTotal) {
    const chartTarget =
        getElement("dashboardPieChart");

    if (!chartTarget) {
        return;
    }

    chartTarget.innerHTML =
        createPieChartHTML([
            {
                label: getGroupLabel("field_cost"),
                amount: fieldCostTotal
            },
            {
                label: getGroupLabel("income"),
                amount: incomeTotal
            },
            {
                label: getGroupLabel("overhead"),
                amount: overheadTotal
            },
            {
                label: getGroupLabel("asset"),
                amount: assetTotal
            }
        ]);
}

function renderDashboardCategoryPieCharts() {
    const incomeChart =
        getElement("dashboardIncomePieChart");

    const expenseChart =
        getElement("dashboardExpensePieChart");

    if (incomeChart) {
        incomeChart.innerHTML =
            createPieChartHTML(
                summarizeByCategory(
                    incomeRecords,
                    "income",
                    "amount"
                )
            );
    }

    if (expenseChart) {
        expenseChart.innerHTML =
            createPieChartHTML(
                combineCategorySummaries([
                    summarizeByCategory(
                        fieldCosts,
                        "field_cost",
                        "amount"
                    ),
                    summarizeByCategory(
                        overheadCosts,
                        "overhead",
                        "amount"
                    )
                ])
            );
    }
}


// ====================
// Startup
// ====================

loadData();
renderFields();
renderTransactionsPage();
renderFieldSummary();
renderAssetList();
renderDashboard();

