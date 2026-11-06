// PHANTOM EXPRESS — Delivery Estimator & Client-Side Validation
document.addEventListener('DOMContentLoaded', () => {
    // 1. CARI BEKAS GRID DESTINATION & OPTION
    const destGrid = document.querySelector('.destination-grid') || document.querySelector('.zone-options') || document.getElementById('zoneContainer');
    const optionGrid = document.querySelector('.speed-grid') || document.querySelector('.options-grid') || document.querySelector('.delivery-options') || document.getElementById('optionContainer');

    // 2. KLIK KAD DESTINATION — PADAM AMARAN MERAH & SEMAK BORANG LENGKAP
    bindCardGrid(destGrid, 'destError');

    // 3. KLIK KAD OPTION — PADAM AMARAN MERAH & SEMAK BORANG LENGKAP
    bindCardGrid(optionGrid, 'optionError');

    // 4. PENDENGAR ACARA MENAIP (INPUT, KEYUP, CHANGE)
    const nameInput = document.getElementById('fullName') || document.getElementById('customerName') || document.querySelector('input[type="text"]');
    const emailInput = document.getElementById('email') || document.getElementById('customerEmail') || document.querySelector('input[type="email"]');
    const weightInput = document.getElementById('weight') || document.getElementById('parcelWeight') || document.querySelector('input[type="number"]');

    if (nameInput) {
        ['input', 'keyup', 'change'].forEach(evt => {
            nameInput.addEventListener(evt, () => {
                if (nameInput.value.trim() !== '') clearFieldError(nameInput, 'nameError');
                checkLiveValidation();
            });
        });
    }

    if (emailInput) {
        ['input', 'keyup', 'change'].forEach(evt => {
            emailInput.addEventListener(evt, () => {
                const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (emailInput.value.trim() !== '' && pattern.test(emailInput.value.trim())) {
                    clearFieldError(emailInput, 'emailError');
                }
                checkLiveValidation();
            });
        });
    }

    if (weightInput) {
        ['input', 'keyup', 'change'].forEach(evt => {
            weightInput.addEventListener(evt, () => {
                const val = parseFloat(weightInput.value);
                if (!isNaN(val) && val > 0 && val <= 30) clearFieldError(weightInput, 'weightError');
                checkLiveValidation();
            });
        });
    }

    // 5. BUTANG CALCULATE & RESET
    const calcBtn = document.getElementById('calculateBtn') || document.querySelector('.mission-button');
    const resetBtn = document.getElementById('resetBtn');

    if (calcBtn) {
        calcBtn.addEventListener('click', (e) => {
            e.preventDefault();
            runValidationAndCalculation();
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            resetAll();
        });
    }
});

// SEMAKAN LENGKAP REAL-TIME: HILANGKAN AMARAN AUTOMATIK BILA SEMUA DAH ISI
function checkLiveValidation() {
    const nameInput = document.getElementById('fullName') || document.getElementById('customerName') || document.querySelector('input[type="text"]');
    const emailInput = document.getElementById('email') || document.getElementById('customerEmail') || document.querySelector('input[type="email"]');
    const weightInput = document.getElementById('weight') || document.getElementById('parcelWeight') || document.querySelector('input[type="number"]');

    const destGrid = document.querySelector('.destination-grid') || document.querySelector('.zone-options') || document.getElementById('zoneContainer');
    const optionGrid = document.querySelector('.speed-grid') || document.querySelector('.options-grid') || document.querySelector('.delivery-options') || document.getElementById('optionContainer');

    const nameValid = nameInput && nameInput.value.trim() !== '';
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailValid = emailInput && emailInput.value.trim() !== '' && emailPattern.test(emailInput.value.trim());
    const destValid = destGrid && destGrid.querySelector('input[type="radio"]:checked') !== null;
    
    const wVal = weightInput ? parseFloat(weightInput.value) : 0;
    const weightValid = weightInput && !isNaN(wVal) && wVal > 0 && wVal <= 30;
    const optionValid = optionGrid && optionGrid.querySelector('input[type="radio"]:checked') !== null;

    if (nameValid && emailValid && destValid && weightValid && optionValid) {
        document.querySelectorAll('.error-input, .error-card, .input-error').forEach(el => {
            el.classList.remove('error-input', 'error-card', 'input-error');
        });
        document.querySelectorAll('.field-error-text, [id$="Error"]').forEach(el => el.remove());

        const banner = document.getElementById('formErrorBanner') || document.getElementById('formMessage');
        if (banner) banner.style.display = 'none';
    }
}

// FUNGSI MENIKAT EVENT PADA KAD GRID
function bindCardGrid(gridEl, errorId) {
    if (!gridEl) return;

    gridEl.addEventListener('click', (e) => {
        let card = e.target;
        while (card && card.parentElement && card.parentElement !== gridEl) {
            card = card.parentElement;
        }

        if (card && card !== gridEl) {
            Array.from(gridEl.children).forEach(c => {
                c.classList.remove('selected', 'active', 'error-card', 'input-error', 'error-input');
                const radio = c.querySelector('input[type="radio"]');
                if (radio) radio.checked = false;
            });

            card.classList.add('selected');
            const radio = card.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;

            gridEl.style.marginBottom = '';
            
            const errEl = document.getElementById(errorId);
            if (errEl) errEl.remove();

            if (gridEl.nextElementSibling && gridEl.nextElementSibling.classList.contains('field-error-text')) {
                gridEl.nextElementSibling.remove();
            }

            checkLiveValidation();
        }
    });
}

// PADAM RALAT INPUT INDIVIDU
function clearFieldError(inputEl, errorId) {
    if (inputEl) {
        inputEl.classList.remove('error-input', 'input-error');
        const wrapper = inputEl.closest('.weight-input-wrapper') || inputEl.closest('.weight-box');
        if (wrapper) wrapper.classList.remove('error-input', 'input-error');

        if (inputEl.nextElementSibling && inputEl.nextElementSibling.classList.contains('field-error-text')) {
            inputEl.nextElementSibling.remove();
        }
        if (wrapper && wrapper.nextElementSibling && wrapper.nextElementSibling.classList.contains('field-error-text')) {
            wrapper.nextElementSibling.remove();
        }
    }
    
    const errEl = document.getElementById(errorId);
    if (errEl) errEl.remove();

    checkLiveValidation();
}

// RESET SEMUA BORANG (DIKEMASKINI: NAVBAR DILINDUNGI 100%)
function resetAll() {
    // 1. Padam status ralat
    document.querySelectorAll('.error-input, .error-card, .input-error').forEach(el => {
        el.classList.remove('error-input', 'error-card', 'input-error');
    });
    document.querySelectorAll('.field-error-text, [id$="Error"]').forEach(el => el.remove());

    // 2. Kosongkan nilai input borang sahaja
    document.querySelectorAll('#deliveryForm input').forEach(i => {
        if (i.type === 'text' || i.type === 'email' || i.type === 'number') i.value = '';
        if (i.type === 'radio' || i.type === 'checkbox') i.checked = false;
    });

    // 3. Buang class selected/active pada KAD BORANG SAHAJA (NAVBAR DILINDUNGI)
    document.querySelectorAll('.choice-card, .speed-card').forEach(c => {
        c.classList.remove('selected', 'active', 'error-card', 'input-error');
    });
    
    // 4. Sembunyikan banner amaran ralat
    const banner = document.getElementById('formErrorBanner') || document.getElementById('formMessage');
    if (banner) banner.style.display = 'none';

    // 5. Kosongkan ruang keputusan
    const resultBox = document.getElementById('result') || document.getElementById('resultContainer') || document.getElementById('resultDisplay');
    if (resultBox) {
        resultBox.innerHTML = '';
    }
}

// SEMAKAN VALIDATION UTAMA & PENGIRAAN KOS DINAMIK
function runValidationAndCalculation() {
    document.querySelectorAll('.error-input, .error-card, .input-error').forEach(el => {
        el.classList.remove('error-input', 'error-card', 'input-error');
    });
    document.querySelectorAll('.field-error-text, [id$="Error"]').forEach(el => el.remove());

    let hasError = false;
    let errorMessages = [];

    const nameInput = document.getElementById('fullName') || document.getElementById('customerName') || document.querySelector('input[type="text"]');
    const emailInput = document.getElementById('email') || document.getElementById('customerEmail') || document.querySelector('input[type="email"]');
    const weightInput = document.getElementById('weight') || document.getElementById('parcelWeight') || document.querySelector('input[type="number"]');

    const destGrid = document.querySelector('.destination-grid') || document.querySelector('.zone-options') || document.getElementById('zoneContainer');
    const optionGrid = document.querySelector('.speed-grid') || document.querySelector('.options-grid') || document.querySelector('.delivery-options') || document.getElementById('optionContainer');

    // 1. Semak Nama
    if (!nameInput || !nameInput.value.trim()) {
        if (nameInput) nameInput.classList.add('error-input');
        showErrorBelow(nameInput, 'Please enter your full name.', 'nameError');
        errorMessages.push('Please enter your full name.');
        hasError = true;
    }

    // 2. Semak Emel
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput || !emailInput.value.trim() || !emailPattern.test(emailInput.value.trim())) {
        if (emailInput) emailInput.classList.add('error-input');
        showErrorBelow(emailInput, 'Please enter a valid email address.', 'emailError');
        errorMessages.push('Please enter a valid email address.');
        hasError = true;
    }

    // 3. Semak Destinasi
    const selectedZoneRadio = destGrid ? destGrid.querySelector('input[type="radio"]:checked') : null;
    if (!selectedZoneRadio) {
        if (destGrid) {
            Array.from(destGrid.children).forEach(c => c.classList.add('error-card'));
            showErrorBelow(destGrid, 'Please select a delivery destination before proceeding.', 'destError');
        }
        errorMessages.push('Please select a delivery destination before proceeding.');
        hasError = true;
    }

    // 4. Semak Berat
    const weightVal = weightInput ? parseFloat(weightInput.value) : 0;
    if (!weightInput || isNaN(weightVal) || weightVal <= 0 || weightVal > 30) {
        const wrapper = weightInput ? (weightInput.closest('.weight-box') || weightInput) : null;
        if (wrapper) wrapper.classList.add('error-input');
        if (weightInput) weightInput.classList.add('error-input');
        showErrorBelow(wrapper || weightInput, 'Please enter a valid weight (0.1 - 30 kg).', 'weightError');
        errorMessages.push('Please enter a valid weight (0.1 - 30 kg).');
        hasError = true;
    }

    // 5. Semak Pilihan Kelajuan (Standard / Express)
    const selectedSpeedRadio = optionGrid ? optionGrid.querySelector('input[type="radio"]:checked') : null;
    if (!selectedSpeedRadio) {
        if (optionGrid) {
            Array.from(optionGrid.children).forEach(c => c.classList.add('error-card'));
            showErrorBelow(optionGrid, 'Please select a delivery option before proceeding.', 'optionError');
        }
        errorMessages.push('Please select a delivery option before proceeding.');
        hasError = true;
    }

    // JIKA ADA RALAT
    if (hasError) {
        const banner = document.getElementById('formErrorBanner') || document.getElementById('formMessage');
        if (banner) {
            banner.textContent = 'Please complete all required fields highlighted in red.';
            banner.className = 'form-error-banner';
            banner.style.display = 'block';
        }
        alert('Incomplete form:\n- ' + errorMessages.join('\n- '));
        return;
    }

    // SEMBUNYIKAN BANNER MERAH
    const banner = document.getElementById('formErrorBanner') || document.getElementById('formMessage');
    if (banner) {
        banner.style.display = 'none';
    }

    // EKSTRAK NAMA DEPAN SAHAJA & FORMAT HURUF BESAR DI DEPAN
    const rawFullName = nameInput.value.trim();
    const rawFirstName = rawFullName.split(' ')[0];
    const firstName = rawFirstName ? (rawFirstName.charAt(0).toUpperCase() + rawFirstName.slice(1).toLowerCase()) : 'Customer';

    // LOGIK PENGIRAAN HARGA DINAMIK
    const weight = weightVal;
    const basePrice = parseFloat(selectedZoneRadio.value); // RM10, RM20, atau RM35
    const weightFee = weight > 1 ? (weight - 1) * 1.00 : 0.00; // RM1/kg melebihi 1kg
    const expressFee = (selectedSpeedRadio.value === 'express') ? 10.00 : 0.00; // Standard = RM0, Express = RM10
    const total = basePrice + weightFee + expressFee;

    // KETETAPAN TEKS KELAJUAN
    const speedText = (selectedSpeedRadio.value === 'express') ? 'Express delivery' : 'Standard delivery';

    // PAPARKAN KEPUTUSAN DENGAN BUTANG SAMA REKA BENTUK BUTANG ATAS
    const resultBox = document.getElementById('result') || document.getElementById('resultContainer') || document.getElementById('resultDisplay');
    if (resultBox) {
        resultBox.innerHTML = `
            <div class="result-card">
                <span class="result-tag">✦ MISSION CONFIRMED</span>
                <h3>Your delivery is ready, ${firstName}!</h3>
                <p>We've prepared your delivery estimate.</p>

                <div class="result-line">
                    <span>Destination charge</span>
                    <strong>RM ${basePrice.toFixed(2)}</strong>
                </div>
                <div class="result-line">
                    <span>Weight charge</span>
                    <strong>RM ${weightFee.toFixed(2)}</strong>
                </div>
                <div class="result-line">
                    <span>${speedText}</span>
                    <strong>RM ${expressFee.toFixed(2)}</strong>
                </div>

                <div class="result-total">
                    <span>Estimated total</span>
                    <strong>RM ${total.toFixed(2)}</strong>
                </div>

                <p class="result-email">Estimate prepared for ${emailInput.value.trim()}</p>

                <!-- BUTANG AKSI SAMA DESIGN & DUDUK BERSEBELAHAN MACAM ATAS -->
                <div style="display: flex; gap: 10px; margin-top: 20px;">
                    <button type="button" id="printResultBtn" class="mission-button" style="flex: 1; background: rgba(50,20,70,0.8); justify-content: center;">
                        <span>🖨️ Print Summary</span>
                    </button>
                    <button type="button" id="newEstimateBtn" class="mission-button" style="flex: 1; justify-content: center;">
                        <span>↺ New Estimate</span>
                    </button>
                </div>
            </div>
        `;

        // EVENT LISTENER BUTTON PRINT & NEW ESTIMATE
        document.getElementById('printResultBtn').addEventListener('click', () => {
            window.print();
        });

        document.getElementById('newEstimateBtn').addEventListener('click', () => {
            resetAll();
            const formEl = document.getElementById('deliveryForm');
            if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
        });
    }

    alert("Calculation complete! Your total fee is RM " + total.toFixed(2));
}

// TEKS AMARAN MERAH DI BAWAH KOTAK
function showErrorBelow(targetEl, msg, errId) {
    if (!targetEl) return;
    
    const existing = document.getElementById(errId);
    if (existing) existing.remove();

    const errSpan = document.createElement('span');
    errSpan.id = errId;
    errSpan.className = 'field-error-text';
    errSpan.style.cssText = 'color: #ff6b81 !important; font-size: 11px !important; margin-top: 4px !important; margin-bottom: 8px !important; display: block !important; font-weight: 500 !important; clear: both !important; width: 100% !important;';
    errSpan.innerText = msg;

    if (targetEl.parentNode) {
        targetEl.parentNode.insertBefore(errSpan, targetEl.nextSibling);
    }
}