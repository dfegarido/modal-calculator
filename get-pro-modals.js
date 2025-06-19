document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('simpleModal');
    const openBtns = document.getElementsByClassName('get-pro-openModal');
    const closeBtn = document.getElementsByClassName('close')[0];

    if (!modal || openBtns.length === 0 || !closeBtn) {
        // Don't run modal code if elements are missing
        return;
    }

    // Open modal for all buttons
    for (let i = 0; i < openBtns.length; i++) {
        openBtns[i].onclick = function() {
            modal.style.display = 'block';
        };
    }

    // Close modal when clicking the X
    closeBtn.onclick = function() {
        modal.style.display = 'none';
    };

    // Close modal when clicking outside of it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };

    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            modal.style.display = 'none';
        }
    });

    // Step Modal Logic
    const stepModal = document.getElementById('stepModal');
    const closeStepBtn = document.querySelector('.close-step-modal');
    const progressBar = document.getElementById('progressBar');
    const stepContent = document.getElementById('stepContent');
    const prevStepBtn = document.getElementById('prevStep');
    const nextStepBtn = document.getElementById('nextStep');
    const serviceIcons = document.querySelectorAll('.service-icon');
    const stepModalTitle = document.getElementById('stepModalTitle');
    const progressStepLabel = document.getElementById('progressStepLabel');

    // Example steps (customize as needed)
    const steps = [
        'Step 1: Nature of project.',
        'Step 2: Enter your zip code.',
        'Step 3: Enter your name.',
        'Step 4: Enter your contact info.'
    ];
    let currentStep = 0;
    let selectedService = '';
    // Store form data for all steps
    let formData = {
        nature: '',
        zipCode: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    };

    // HTML for step 1 (nature of project)
    const step1NatureHTML = `
        <div id="step1-nature" class="step-nature">
            <h2 class="step-h2">What is the nature of your project?</h2>
            <div class="nature-radio-group">
                <label class="nature-radio">
                    <input type="radio" name="nature" value="replace-install">
                    <span class="nature-radio-label">Replace or install</span>
                </label>
                <label class="nature-radio">
                    <input type="radio" name="nature" value="repair">
                    <span class="nature-radio-label">Repair</span>
                </label>
            </div>
        </div>
    `;

    // HTML for step 2 (zip code)
    const step2ZipHTML = `
        <div id="step2-zip" class="step-zip">
            <h2 class="step-h2">What is your zip code?</h2>
            <input type="text" id="zipCode" name="zipCode" maxlength="10" placeholder="Zip Code" class="step-input" required />
        </div>
    `;

    // HTML for step 3 (first and last name)
    const step3NameHTML = `
        <div id="step3-name" class="step-name.">
            <h2 class="step-h2">Please enter your full name</h2>
            <div>
                <label for="firstName">First Name</label><br>
                <input type="text" id="firstName" name="firstName" placeholder="First Name" class="step-input" required />
            </div>
            <div>
                <label for="lastName">Last Name</label><br>
                <input type="text" id="lastName" name="lastName" placeholder="Last Name" class="step-input" required />
            </div>
        </div>
    `;

    // HTML for step 4 (email and phone)
    const step4ContactHTML = `
        <div id="step4-contact" class="step-contact">
            <h2 class="step-h2">How can we contact you?</h2>
            <div>
                <label for="email">Email Address</label><br>
                <input type="email" id="email" name="email" placeholder="jane.doe@email.com" class="step-input" required />
            </div>
            <div>
                <label for="phone">Phone Number</label><br>
                <input type="tel" id="phone" name="phone" placeholder="(555) 123-4567" class="step-input" required />
            </div>
        </div>
    `;

    function updateStepCircles() {
        const circles = document.querySelectorAll('.step-circle');
        circles.forEach((circle, idx) => {
            if (idx <= currentStep) {
                circle.classList.add('active');
            } else {
                circle.classList.remove('active');
            }
        });
    }

    function updateStepModal() {
        if (currentStep === 0) {
            stepContent.innerHTML = step1NatureHTML;
            // Restore radio selection
            if (formData.nature) {
                const radio = stepContent.querySelector(`input[name="nature"][value="${formData.nature}"]`);
                if (radio) radio.checked = true;
            }
        } else if (currentStep === 1) {
            stepContent.innerHTML = step2ZipHTML;
            // Restore zip code
            if (formData.zipCode) {
                const zipInput = stepContent.querySelector('#zipCode');
                if (zipInput) zipInput.value = formData.zipCode;
            }
        } else if (currentStep === 2) {
            stepContent.innerHTML = step3NameHTML;
            // Restore names
            if (formData.firstName) {
                const firstInput = stepContent.querySelector('#firstName');
                if (firstInput) firstInput.value = formData.firstName;
            }
            if (formData.lastName) {
                const lastInput = stepContent.querySelector('#lastName');
                if (lastInput) lastInput.value = formData.lastName;
            }
        } else if (currentStep === 3) {
            stepContent.innerHTML = step4ContactHTML;
            // Restore contact info
            if (formData.email) {
                const emailInput = stepContent.querySelector('#email');
                if (emailInput) emailInput.value = formData.email;
            }
            if (formData.phone) {
                const phoneInput = stepContent.querySelector('#phone');
                if (phoneInput) phoneInput.value = formData.phone;
            }
        } else if (currentStep === 4) {
            // Show summary step
            stepContent.innerHTML = `
                <div class="step-summary beautiful-summary-card">
                    <h2 class="step-h2">Summary</h2>
                    <ul class="summary-list">
                        <li><strong>Service:</strong> ${selectedService}</li>
                        <li><strong>Nature:</strong> ${formData.nature === 'replace-install' ? 'Replace or install' : formData.nature === 'repair' ? 'Repair' : ''}</li>
                        <li><strong>Zip Code:</strong> ${formData.zipCode}</li>
                        <li><strong>Name:</strong> ${formData.firstName} ${formData.lastName}</li>
                        <li><strong>Email:</strong> ${formData.email}</li>
                        <li><strong>Phone:</strong> ${formData.phone}</li>
                    </ul>
                    <button id="editSummaryBtn" class="step-btn">Edit</button>
                    <div class="summary-thankyou">Thank you! We will contact you soon.</div>
                </div>
            `;
            // Add event listener for Edit button
            setTimeout(() => {
                const editBtn = document.getElementById('editSummaryBtn');
                if (editBtn) {
                    editBtn.onclick = function() {
                        currentStep = 0;
                        updateStepModal();
                    };
                }
            }, 0);
        }
        // Calculate percentage for progress bar
        const stepsCount = 5; // total steps
        const percent = Math.round((currentStep + 1) / stepsCount * 100);
        progressBar.style.width = percent + '%';
        progressBar.textContent = '';
        // Show percentage above the bar
        const barContainer = document.querySelector('.progress-bar-container');
        let percentElem = barContainer.querySelector('.progress-bar-percentage');
        if (!percentElem) {
            percentElem = document.createElement('div');
            percentElem.className = 'progress-bar-percentage';
            barContainer.appendChild(percentElem);
        }
        percentElem.textContent = percent + '%';
        // Add step markers to the progress bar
        if (barContainer) {
            // Remove old markers
            barContainer.querySelectorAll('.progress-bar-step-marker').forEach(e => e.remove());
            for (let i = 0; i < stepsCount; i++) {
                const marker = document.createElement('div');
                marker.className = 'progress-bar-step-marker' + (i <= currentStep ? ' done' : '');
                marker.style.left = (i / (stepsCount - 1) * 100) + '%';
                barContainer.appendChild(marker);
            }
        }
        prevStepBtn.style.display = currentStep === 0 ? 'none' : 'inline-block';
        if (currentStep === 3) {
            nextStepBtn.textContent = 'Get Quote';
            nextStepBtn.style.display = 'inline-block';
        } else if (currentStep === 4) {
            nextStepBtn.style.display = 'none';
        } else {
            nextStepBtn.textContent = 'Next';
            nextStepBtn.style.display = 'inline-block';
        }
        stepModalTitle.textContent = selectedService ? `${selectedService} - Step ${Math.min(currentStep + 1, 5)}` : `Step ${Math.min(currentStep + 1, 5)}`;
        progressStepLabel.textContent = `Step ${Math.min(currentStep + 1, 5)} of 5`;
        updateStepCircles();
    }

    // Save data before moving to next step
    function saveStepData() {
        if (currentStep === 0) {
            const checked = document.querySelector('input[name="nature"]:checked');
            formData.nature = checked ? checked.value : '';
        } else if (currentStep === 1) {
            const zip = document.getElementById('zipCode');
            formData.zipCode = zip ? zip.value : '';
        } else if (currentStep === 2) {
            const first = document.getElementById('firstName');
            const last = document.getElementById('lastName');
            formData.firstName = first ? first.value : '';
            formData.lastName = last ? last.value : '';
        } else if (currentStep === 3) {
            const email = document.getElementById('email');
            const phone = document.getElementById('phone');
            formData.email = email ? email.value : '';
            formData.phone = phone ? phone.value : '';
        }
    }

    function validateStep() {
        if (currentStep === 0) {
            return document.querySelector('input[name="nature"]:checked');
        }
        if (currentStep === 1) {
            const zip = document.getElementById('zipCode');
            return zip && zip.value.trim().length > 0;
        }
        if (currentStep === 2) {
            const first = document.getElementById('firstName');
            const last = document.getElementById('lastName');
            return first && last && first.value.trim().length > 0 && last.value.trim().length > 0;
        }
        if (currentStep === 3) {
            const email = document.getElementById('email');
            const phone = document.getElementById('phone');
            return email && phone && email.value.trim().length > 0 && phone.value.trim().length > 0;
        }
        return true;
    }

    serviceIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            selectedService = this.nextElementSibling ? this.nextElementSibling.textContent : '';
            currentStep = 0;
            updateStepModal();
            stepModal.style.display = 'block';
        });
    });

    closeStepBtn.onclick = function() {
        stepModal.style.display = 'none';
    };
    prevStepBtn.onclick = function() {
        if (currentStep > 0) {
            saveStepData();
            currentStep--;
            updateStepModal();
        }
    };
    nextStepBtn.onclick = function() {
        if (!validateStep()) {
            alert('Please complete this step before continuing.');
            return;
        }
        saveStepData();
        if (currentStep < 3) {
            currentStep++;
            updateStepModal();
        } else if (currentStep === 3) {
            // Collect values and show summary
            currentStep = 4;
            updateStepModal();
        } else {
            stepModal.style.display = 'none';
            // Optionally, handle form submission here
        }
    };
    window.addEventListener('click', function(event) {
        if (event.target == stepModal) {
            stepModal.style.display = 'none';
        }
    });
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            stepModal.style.display = 'none';
        }
    });

    // Ensure Back/Next always visible in footer
    prevStepBtn.style.display = 'none';
});