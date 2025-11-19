
document.addEventListener("DOMContentLoaded", function () {
  // Burger menu
  const burger = document.querySelector(".nav-burger");
  const nav = document.querySelector(".nav");
  if (burger && nav) {
    burger.addEventListener("click", () => {
      nav.classList.toggle("open");
    });
  }

  // Platform toggle
  const platformOptions = document.querySelectorAll(".platform-option");
  const platformInput = document.querySelector("#platform");
  if (platformOptions.length && platformInput) {
    platformOptions.forEach((opt) => {
      opt.addEventListener("click", () => {
        platformOptions.forEach((o) => o.classList.remove("active"));
        opt.classList.add("active");
        platformInput.value = opt.dataset.value || "";
      });
    });
  }

  // Apply form
  const applyForm = document.querySelector("#apply-form");
  if (applyForm) {
    applyForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const formData = Object.fromEntries(new FormData(applyForm).entries());
      const code = String(Math.floor(1000 + Math.random() * 9000));
      formData.trackCode = code;
      formData.page = window.location.href;

      showSuccessModal(code);
      applyForm.reset();
      if (platformOptions.length && platformInput) {
        platformOptions.forEach((o) => o.classList.remove("active"));
        platformInput.value = "";
      }

      sendApplicationToServer(formData);
    });
  }

  function sendApplicationToServer(data) {
    fetch("/api/apply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }).catch((err) => {
      console.warn("Не удалось отправить заявку на сервер", err);
    });
  }

  function showSuccessModal(code) {
    const existing = document.querySelector(".modal-backdrop");
    if (existing) existing.remove();

    const backdrop = document.createElement("div");
    backdrop.className = "modal-backdrop";
    backdrop.innerHTML = `
      <div class="modal">
        <div class="modal-icon">✔️</div>
        <div class="modal-title">Заявка отправлена!</div>
        <div class="modal-text">Ваш трек-код:</div>
        <div class="track-box">
          <div class="track-label">
            Отправьте этот код менеджеру в Telegram<br>
            <strong>@ComwingoStore_Tatyana</strong> для дальнейших указаний.
          </div>
          <div class="track-code" id="track-code-text">${code}</div>
        </div>
        <div class="modal-buttons">
          <button class="btn btn-primary btn-full" id="copy-code-btn">Скопировать код</button>
          <a class="btn btn-secondary btn-full" href="https://t.me/ComwingoStore_Tatyana" target="_blank" rel="noopener">Написать в Telegram</a>
          <button class="btn btn-outline btn-full" id="close-modal-btn">Закрыть</button>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);

    backdrop.addEventListener("click", function (e) {
      if (e.target === backdrop) backdrop.remove();
    });

    const closeBtn = backdrop.querySelector("#close-modal-btn");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => backdrop.remove());
    }

    const copyBtn = backdrop.querySelector("#copy-code-btn");
    if (copyBtn) {
      copyBtn.addEventListener("click", () => {
        const text = code;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard
            .writeText(text)
            .then(() => {
              copyBtn.textContent = "Скопировано!";
              setTimeout(() => (copyBtn.textContent = "Скопировать код"), 2000);
            })
            .catch(() => fallbackCopy(text, copyBtn));
        } else {
          fallbackCopy(text, copyBtn);
        }
      });
    }
  }

  function fallbackCopy(text, button) {
    const area = document.createElement("textarea");
    area.value = text;
    document.body.appendChild(area);
    area.select();
    try {
      document.execCommand("copy");
      if (button) {
        button.textContent = "Скопировано!";
        setTimeout(() => (button.textContent = "Скопировать код"), 2000);
      }
    } catch (err) {
      console.warn("Не удалось скопировать", err);
    } finally {
      area.remove();
    }
  }
});
