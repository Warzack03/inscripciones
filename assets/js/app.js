(function () {
  const ZONE_TEXT = {
    Tarragona: "Estás en el formulario de Tarragona.",
    Reus: "Estás en el formulario de Reus.",
    Barcelona: "Estás en el formulario de Barcelona."
  };

  const SUCCESS_MESSAGE =
    "Ya estás inscrito para las pruebas. Estate atento a nuestras redes sociales, la web principal y tu email para las próximas noticias.";

  function updateZoneUI(zone) {
    const currentZone = ZONE_TEXT[zone] ? zone : "Tarragona";

    document.querySelectorAll(".zone-pill").forEach((pill) => {
      pill.classList.toggle("is-active", pill.dataset.zone === currentZone);
    });

    document.querySelectorAll(".zone-current-label").forEach((node) => {
      node.textContent = ZONE_TEXT[currentZone];
    });

    document.querySelectorAll(".zone-form-title").forEach((node) => {
      node.textContent = `Deja tu perfil para la zona de ${currentZone}.`;
    });

    document.querySelectorAll('.lead-form[data-form-type="cataluna"]').forEach((form) => {
      const zoneField = form.querySelector('select[name="zona"]');
      const sheetField = form.querySelector('input[name="sheetName"]');
      if (zoneField) {
        zoneField.value = currentZone;
      }
      if (sheetField) {
        sheetField.value = currentZone;
      }
    });
  }

  function toggleFeedback(feedback, type, message) {
    feedback.className = `form-feedback is-visible is-${type}`;
    feedback.textContent = message;
  }

  function clearFeedback(feedback) {
    feedback.className = "form-feedback";
    feedback.textContent = "";
  }

  function validateForm(form) {
    if (form.checkValidity()) {
      return true;
    }

    form.reportValidity();
    return false;
  }

  function buildPayload(form) {
    const data = new FormData(form);
    const payload = {};

    data.forEach((value, key) => {
      payload[key] = typeof value === "string" ? value.trim() : value;
    });

    payload.aceptaPolitica = data.get("aceptaPolitica") ? "Si" : "No";
    payload.urlOrigen = window.location.href;

    if (payload.zona) {
      payload.sheetName = payload.zona;
    }

    return payload;
  }

  async function submitLeadForm(form) {
    const feedback = form.querySelector(".form-feedback");
    clearFeedback(feedback);

    if (!validateForm(form)) {
      return;
    }

    const endpoint = window.APP_CONFIG && window.APP_CONFIG.formsEndpoint;
    if (!endpoint) {
      toggleFeedback(
        feedback,
        "error",
        "Falta conectar Google Sheets. Cuando añadas la URL del Apps Script en assets/js/config.js, el formulario quedará listo para enviar."
      );
      return;
    }

    const payload = buildPayload(form);

    if (payload.website) {
      toggleFeedback(feedback, "success", SUCCESS_MESSAGE);
      form.reset();
      if (form.dataset.formType === "cataluna") {
        updateZoneUI("Tarragona");
      }
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;

    submitButton.disabled = true;
    submitButton.textContent = "Enviando...";

    try {
      await fetch(endpoint, {
        method: "POST",
        mode: "no-cors",
        body: new URLSearchParams(payload)
      });

      form.reset();
      toggleFeedback(feedback, "success", SUCCESS_MESSAGE);

      if (form.dataset.formType === "cataluna") {
        updateZoneUI("Tarragona");
      }
    } catch (error) {
      toggleFeedback(
        feedback,
        "error",
        "No hemos podido enviar tu inscripción ahora mismo. Pruébalo de nuevo dentro de unos minutos o escríbenos a risingraimon@gmail.com."
      );
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    const zonePills = document.querySelectorAll(".zone-pill");
    const zoneSelect = document.querySelector(".zone-select");

    zonePills.forEach((pill) => {
      pill.addEventListener("click", () => updateZoneUI(pill.dataset.zone));
    });

    if (zoneSelect) {
      zoneSelect.addEventListener("change", (event) => updateZoneUI(event.target.value));
      updateZoneUI(zoneSelect.value);
    }

    document.querySelectorAll(".lead-form").forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        submitLeadForm(form);
      });
    });
  });
})();
