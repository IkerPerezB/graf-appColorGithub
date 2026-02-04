// --- SELECCIÓN DE ELEMENTOS ---
const redRange = document.getElementById('redRange');
const greenRange = document.getElementById('greenRange');
const blueRange = document.getElementById('blueRange');

const redInput = document.getElementById('redInput');
const greenInput = document.getElementById('greenInput');
const blueInput = document.getElementById('blueInput');

const colorBox = document.getElementById('colorBox');
const hexCode = document.getElementById('hexCode');
const htmlColorPicker = document.getElementById('htmlColorPicker'); // Nuevo elemento

// --- FUNCIONES DE CONVERSIÓN ---

function valueToHex(c) {
    const hex = parseInt(c).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + valueToHex(r) + valueToHex(g) + valueToHex(b);
}

// Nueva función: Convierte Hex (#RRGGBB) a objeto {r, g, b}
function hexToRgb(hex) {
    // Quitamos el # si existe
    hex = hex.replace(/^#/, '');
    
    // Parseamos los pares
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return { r, g, b };
}

function getContrastColor(r, g, b) {
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? 'black' : 'white';
}

function validateValue(val) {
    if (val > 255) return 255;
    if (val < 0 || val === '') return 0;
    return parseInt(val);
}

// --- FUNCIÓN PRINCIPAL DE ACTUALIZACIÓN VISUAL ---
function updateVisuals(source) {
    const r = parseInt(redRange.value);
    const g = parseInt(greenRange.value);
    const b = parseInt(blueRange.value);
    
    const currentHex = rgbToHex(r, g, b);

    // 1. Pintar fondo y texto
    colorBox.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    hexCode.textContent = currentHex;
    colorBox.style.color = getContrastColor(r, g, b);

    // 2. Sincronizar el picker HTML (Solo si el cambio NO vino del picker)
    // Esto evita un bucle infinito visual, aunque los navegadores suelen manejarlo bien.
    if (source !== 'picker') {
        htmlColorPicker.value = currentHex;
    }
}

// --- MANEJADORES DE EVENTOS ---

function handleSliderInput(slider, input) {
    input.value = slider.value;
    updateVisuals('slider');
}

function handleNumberInput(slider, input) {
    let val = validateValue(input.value);
    input.value = val;
    slider.value = val;
    updateVisuals('number');
}

// Nuevo Manejador: Cuando cambia el Color Picker HTML
function handlePickerInput() {
    const hexColor = htmlColorPicker.value;
    const rgb = hexToRgb(hexColor);

    // Actualizamos sliders e inputs numéricos con los valores del picker
    redRange.value = rgb.r;
    redInput.value = rgb.r;

    greenRange.value = rgb.g;
    greenInput.value = rgb.g;

    blueRange.value = rgb.b;
    blueInput.value = rgb.b;

    // Actualizamos la caja visual
    updateVisuals('picker');
}

// --- ASIGNACIÓN DE EVENTOS ---

redRange.addEventListener('input', () => handleSliderInput(redRange, redInput));
redInput.addEventListener('input', () => handleNumberInput(redRange, redInput));

greenRange.addEventListener('input', () => handleSliderInput(greenRange, greenInput));
greenInput.addEventListener('input', () => handleNumberInput(greenRange, greenInput));

blueRange.addEventListener('input', () => handleSliderInput(blueRange, blueInput));
blueInput.addEventListener('input', () => handleNumberInput(blueRange, blueInput));

// Evento para el Picker
htmlColorPicker.addEventListener('input', handlePickerInput);

// Inicializar
updateVisuals();