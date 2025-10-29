$(document).ready(() => {
    // ------------------- FORMULARIO 1: SABLE DE LUZ -------------------
    const $lightsaberForm = $("#lightsaber-form");
    const $saberColor = $("#saber-color");
    const $saberType = $("#saber-type");
    const $saberImage = $("#saber-image");
    // Mostrar cambios en consola
    $saberColor.on("input", () => {
        console.log("[Sable] Color:", $saberColor.val());
    });
    $saberType.on("change", () => {
        console.log("[Sable] Tipo:", $saberType.val());
    });
    $saberImage.on("change", () => {
        var _a;
        const file = (_a = $saberImage[0].files) === null || _a === void 0 ? void 0 : _a[0];
        if (file)
            console.log("[Sable] Archivo seleccionado:", file.name);
    });
    // Submit
    $lightsaberForm.on("submit", (e) => {
        e.preventDefault();
        console.log("[Sable] Formulario guardado con éxito!");
        // Guardar en localStorage
        localStorage.setItem("sableColor", String($saberColor.val()));
        localStorage.setItem("sableTipo", String($saberType.val()));
        alert("Sable guardado!");
    });
    // Reset
    $lightsaberForm.on("reset", (e) => {
        e.preventDefault();
        $lightsaberForm[0].reset();
        console.log("[Sable] Formulario restablecido");
    });
    // ------------------- FORMULARIO 2: ROL EN LA MISIÓN -------------------
    const $missionForm = $("#mission-role-form");
    const $padawanName = $("#padawan-name");
    const $forceSide = $("input[name='force-side']");
    const $roles = $("input[name='role']");
    const $assignBtn = $("#assign-role");
    // Registrar input del nombre
    $padawanName.on("input", () => {
        console.log("[Misión] Nombre del Padawan:", $padawanName.val());
    });
    // Radio buttons
    $forceSide.on("change", () => {
        console.log("[Misión] Afiliación a la Fuerza:", $("input[name='force-side']:checked").val());
    });
    // Botón Asignar rol
    $assignBtn.on("click", (e) => {
        e.preventDefault();
        const nombre = $padawanName.val() || "Sin nombre";
        const selectedRoles = $roles.filter(":checked").map((_, el) => $(el).val()).get();
        const fuerza = $("input[name='force-side']:checked").val() || "No asignada";
        console.log(`[Misión] Padawan: ${nombre}`);
        console.log(`[Misión] Fuerza: ${fuerza}`);
        console.log("[Misión] Roles asignados:", selectedRoles.join(", ") || "Ninguno");
        alert(`Padawan ${nombre} asignado con roles: ${selectedRoles.join(", ") || "ninguno"} (${fuerza})`);
    });
    // ------------------- FORMULARIO 3: INFORME DE ESTADO -------------------
    const $statusForm = $("#status-report-form");
    const $reportContent = $("#report-content");
    const $completedTraining = $("#completed-training");
    $reportContent.on("input", () => {
        console.log("[Informe] Contenido actualizado:", $reportContent.val());
    });
    $completedTraining.on("change", () => {
        const estado = $completedTraining.is(":checked") ? "completo" : "pendiente";
        console.log("[Informe] Entrenamiento:", estado);
    });
    $statusForm.on("submit", (e) => {
        e.preventDefault();
        const contenido = $reportContent.val() || "";
        const entrenamiento = $completedTraining.is(":checked") ? true : false;
        console.log("[Informe] Enviado:", { contenido, entrenamiento });
        // Guardar en sessionStorage
        sessionStorage.setItem("informe", JSON.stringify({ contenido, entrenamiento }));
        alert("Informe enviado al consejo Jedi!");
        $statusForm[0].reset();
    });
});
export {};
