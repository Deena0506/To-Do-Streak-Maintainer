// ====== STATE ======
let streak = Number(localStorage.getItem("streak")) || 0;
let history = JSON.parse(localStorage.getItem("history")) || [];
let lastCompletedDate = localStorage.getItem("lastCompletedDate");

// ====== INIT ======
document.getElementById("streakCount").innerText = streak;

// Splash screen
setTimeout(() => {
    document.getElementById("splash").style.display = "none";
    document.getElementById("app").classList.remove("hidden");
}, 3000);

// ====== DATE UTILS ======
function getToday() {
    return new Date().toISOString().split("T")[0];
}

// ====== DAILY RESET ======
function dailyResetCheck() {
    const today = getToday();
    const savedDay = localStorage.getItem("currentDay");

    if (savedDay !== today) {
        localStorage.setItem("currentDay", today);
        document.getElementById("taskList").innerHTML = "";
        updateProgress();
    }
}
dailyResetCheck();

// ====== ADD TASK ======
function addTask() {
    const input = document.getElementById("taskInput");
    if (input.value.trim() === "") return;

    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.addEventListener("change", updateProgress);

    const span = document.createElement("span");
    span.innerText = input.value;

    li.appendChild(checkbox);
    li.appendChild(span);

    document.getElementById("taskList").appendChild(li);

    input.value = "";
    updateProgress();
}

// ====== PROGRESS BAR ======
function updateProgress() {
    const checkboxes = document.querySelectorAll("#taskList input[type='checkbox']");
    const total = checkboxes.length;

    if (total === 0) {
        document.getElementById("progressFill").style.width = "0%";
        document.getElementById("progressPercent").innerText = "0%";
        return;
    }

    let completed = 0;
    checkboxes.forEach(cb => {
        if (cb.checked) completed++;
    });

    const percent = Math.round((completed / total) * 100);

    document.getElementById("progressFill").style.width = percent + "%";
    document.getElementById("progressPercent").innerText = percent + "%";
}

// ====== COMPLETE DAY ======
function checkStreak() {
    const today = getToday();

    if (lastCompletedDate === today) {
        alert("⚠️ You already completed today!");
        return;
    }

    const taskItems = document.querySelectorAll("#taskList li");
    if (taskItems.length === 0) {
        alert("Add at least one task");
        return;
    }

    let completed = true;
    let taskHistory = [];

    taskItems.forEach(item => {
        const checkbox = item.querySelector("input");
        const text = item.querySelector("span").innerText;

        taskHistory.push({
            name: text,
            done: checkbox.checked
        });

        if (!checkbox.checked) completed = false;
    });

    if (completed) {
        streak++;
        alert("🔥 Streak Increased!");
    } else {
        streak = 0;
        alert("❌ Streak Reset!");
    }

    lastCompletedDate = today;

    history.unshift({
        date: today,
        status: completed ? "Completed" : "Failed",
        tasks: taskHistory
    });

    localStorage.setItem("streak", streak);
    localStorage.setItem("history", JSON.stringify(history));
    localStorage.setItem("lastCompletedDate", lastCompletedDate);

    document.getElementById("streakCount").innerText = streak;
    document.getElementById("taskList").innerHTML = "";
    updateProgress();
    renderHistory();
}

// ====== RESET STREAK ======
function resetStreak() {
    if (!confirm("Reset streak and history?")) return;

    streak = 0;
    history = [];
    lastCompletedDate = null;

    localStorage.setItem("streak", 0);
    localStorage.setItem("history", JSON.stringify([]));
    localStorage.removeItem("lastCompletedDate");

    document.getElementById("streakCount").innerText = 0;
    document.getElementById("taskList").innerHTML = "";
    document.getElementById("historyList").innerHTML = "";
    updateProgress();
}

// ====== HISTORY ======
function renderHistory() {
    const list = document.getElementById("historyList");
    list.innerHTML = "";

    history.forEach(day => {
        const li = document.createElement("li");
        li.style.flexDirection = "column";

        li.innerHTML = `
            <strong>
                ${day.date} -
                <span class="${day.status === "Completed" ? "completed" : "failed"}">
                    ${day.status}
                </span>
            </strong>
            <ul>
                ${day.tasks.map(t => `
                    <li style="margin-left:12px; font-size:13px;">
                        ${t.done ? "✔️" : "❌"} ${t.name}
                    </li>
                `).join("")}
            </ul>
        `;

        list.appendChild(li);
    });
}

renderHistory();
