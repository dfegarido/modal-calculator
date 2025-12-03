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
            // Reset step modal state when opening
            currentStep = 0;
            // Reset reCAPTCHA state
            if (recaptchaWidgetId !== null && typeof grecaptcha !== 'undefined') {
                try {
                    grecaptcha.reset(recaptchaWidgetId);
                } catch (error) {
                    console.error('Error resetting reCAPTCHA:', error);
                }
            }
            recaptchaWidgetId = null;
            recaptchaCompleted = false;
            recaptchaResponseToken = null;
            recaptchaTokenTimestamp = null;
            updateStepModal();
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
    const confirmStepBtn = document.getElementById('confirmStep');
    const serviceColumns = document.querySelectorAll('.service-column');
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
    let recaptchaCompleted = false; // Track if reCAPTCHA is completed
    let recaptchaResponseToken = null; // Store the reCAPTCHA response token directly
    let recaptchaTokenTimestamp = null; // Store when token was generated (tokens expire after 2 minutes)
    let recaptchaWidgetId = null; // Store reCAPTCHA widget ID for v2
    
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
                    <div id="recaptcha-container-step4" style="margin: 20px 0; display: flex; justify-content: center;"></div>
                    <button id="editSummaryBtn" class="step-btn">Edit</button>
                </div>
            `;
            
            // Render reCAPTCHA on step 4 (last step)
            setTimeout(() => {
                renderRecaptchaWidget();
                
                // Add event listener for Edit button
                const editBtn = document.getElementById('editSummaryBtn');
                if (editBtn) {
                    editBtn.onclick = function() {
                        // Reset reCAPTCHA when going back
                        if (recaptchaWidgetId !== null && typeof grecaptcha !== 'undefined') {
                            try {
                                grecaptcha.reset(recaptchaWidgetId);
                            } catch (error) {
                                console.error('Error resetting reCAPTCHA:', error);
                            }
                        }
                        recaptchaWidgetId = null;
                        recaptchaCompleted = false;
                        recaptchaResponseToken = null;
                        recaptchaTokenTimestamp = null;
                        currentStep = 0;
                        updateStepModal();
                    };
                }
            }, 100);
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
            nextStepBtn.disabled = false;
            nextStepBtn.style.opacity = '1';
            nextStepBtn.style.cursor = 'pointer';
            if (confirmStepBtn) confirmStepBtn.style.display = 'none';
        } else if (currentStep === 4) {
            if (confirmStepBtn) {
                confirmStepBtn.style.display = 'inline-block';
                confirmStepBtn.textContent = 'Confirm';
                // Button state is managed by reCAPTCHA callback
                // Initially disabled until reCAPTCHA is completed
                if (!recaptchaCompleted) {
                    confirmStepBtn.disabled = true;
                    confirmStepBtn.style.opacity = '0.5';
                    confirmStepBtn.style.cursor = 'not-allowed';
                }
            }
            if (nextStepBtn) nextStepBtn.style.display = 'none';
        } else {
            if (confirmStepBtn) confirmStepBtn.style.display = 'none';
            if (nextStepBtn && currentStep !== 4) {
                nextStepBtn.style.display = 'inline-block';
                nextStepBtn.textContent = 'Next';
                nextStepBtn.disabled = false;
                nextStepBtn.style.opacity = '1';
                nextStepBtn.style.cursor = 'pointer';
            }
        }
        stepModalTitle.textContent = selectedService ? `${selectedService} - Step ${Math.min(currentStep + 1, 5)}` : `Step ${Math.min(currentStep + 1, 5)}`;
        progressStepLabel.textContent = `Step ${Math.min(currentStep + 1, 5)} of 5`;
        updateStepCircles();
    }

    // Save data before moving to next step
    function saveStepData() {
        if (currentStep === 0) {
            const checked = stepContent.querySelector('input[name="nature"]:checked');
            formData.nature = checked ? checked.value : '';
        } else if (currentStep === 1) {
            const zip = stepContent.querySelector('#zipCode');
            formData.zipCode = zip ? zip.value : '';
        } else if (currentStep === 2) {
            const first = stepContent.querySelector('#firstName');
            const last = stepContent.querySelector('#lastName');
            formData.firstName = first ? first.value : '';
            formData.lastName = last ? last.value : '';
        } else if (currentStep === 3) {
            const email = stepContent.querySelector('#email');
            const phone = stepContent.querySelector('#phone');
            formData.email = email ? email.value : '';
            formData.phone = phone ? phone.value : '';
        }
    }

    function validateEmail(email) {
        // Simple email regex
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validatePhone(phone) {
        // Remove all non-digit characters for validation
        const digitsOnly = phone.replace(/\D/g, '');
        // Accepts phone numbers with 10 digits (US format)
        // Also accepts international formats with 11+ digits
        return digitsOnly.length >= 10;
    }

    function validateStep() {
        if (currentStep === 0) {
            const checked = stepContent.querySelector('input[name="nature"]:checked');
            return checked !== null;
        }
        if (currentStep === 1) {
            const zip = stepContent.querySelector('#zipCode');
            return zip && zip.value.trim().length > 0;
        }
        if (currentStep === 2) {
            const first = stepContent.querySelector('#firstName');
            const last = stepContent.querySelector('#lastName');
            return first && last && first.value.trim().length > 0 && last.value.trim().length > 0;
        }
        if (currentStep === 3) {
            const email = stepContent.querySelector('#email');
            const phone = stepContent.querySelector('#phone');
            if (!email || !phone) {
                return false;
            }
            const emailValue = email.value.trim();
            const phoneValue = phone.value.trim();
            if (!emailValue || !phoneValue) {
                return false;
            }
            if (!validateEmail(emailValue)) {
                alert('Please enter a valid email address.');
                return false;
            }
            if (!validatePhone(phoneValue)) {
                alert('Please enter a valid phone number (e.g., (555) 123-4567 or 555-123-4567).');
                return false;
            }
            return true;
        }
        return true;
    }

    serviceColumns.forEach(column => {
        column.addEventListener('click', function() {
            const serviceName = this.querySelector('.service-name');
            selectedService = serviceName ? serviceName.textContent : '';
            currentStep = 0;
            // Reset reCAPTCHA state when starting a new form
            if (recaptchaWidgetId !== null && typeof grecaptcha !== 'undefined') {
                try {
                    grecaptcha.reset(recaptchaWidgetId);
                } catch (error) {
                    console.error('Error resetting reCAPTCHA:', error);
                }
            }
            recaptchaWidgetId = null;
            recaptchaCompleted = false;
            recaptchaResponseToken = null;
            recaptchaTokenTimestamp = null;
            updateStepModal();
            stepModal.style.display = 'block';
        });
    });

    closeStepBtn.onclick = function() {
        stepModal.style.display = 'none';
    };
    prevStepBtn.onclick = function() {
        if (currentStep > 0) {
            // Reset state if going back from step 4
            if (currentStep === 4) {
                recaptchaCompleted = false;
                recaptchaResponseToken = null;
            }
            saveStepData();
            currentStep--;
            updateStepModal();
        }
    };
    nextStepBtn.onclick = function() {
        if (!validateStep()) {
            // Error messages are now shown in validateStep() for specific fields
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
    // Function to render visible reCAPTCHA v2 widget
    function renderRecaptchaWidget() {
        // Check if reCAPTCHA is loaded
        if (typeof grecaptcha === 'undefined') {
            console.warn('reCAPTCHA not loaded yet, will retry...');
            setTimeout(renderRecaptchaWidget, 500);
            return;
        }
        
        const container = document.getElementById('recaptcha-container-step4');
        if (!container) {
            console.error('reCAPTCHA container not found');
            return;
        }
        
        // Check if widget is already rendered
        if (container.querySelector('iframe')) {
            console.log('reCAPTCHA widget already rendered');
            return;
        }
        
        try {
            console.log('Rendering reCAPTCHA v2 widget on step 4 (last step)...');
            // IMPORTANT: You need a reCAPTCHA v2 site key (not Enterprise) for the visible checkbox
            // Get your v2 key from: https://www.google.com/recaptcha/admin/create
            // Choose: reCAPTCHA v2 → "I'm not a robot" Checkbox
            recaptchaWidgetId = grecaptcha.render('recaptcha-container-step4', {
                'sitekey': '6LdAmh8sAAAAAIjU46wANXBj4nkrtIL7ZFJyCZDf',
                'callback': function(response) {
                    // This callback is called when the user completes the captcha
                    console.log('✓ reCAPTCHA verified - Response received, length:', response ? response.length : 0);
                    recaptchaResponseToken = response;
                    recaptchaTokenTimestamp = Date.now();
                    recaptchaCompleted = true;
                    
                    // Enable the Confirm button
                    const confirmBtn = document.getElementById('confirmStep');
                    if (confirmBtn) {
                        confirmBtn.disabled = false;
                        confirmBtn.style.opacity = '1';
                        confirmBtn.style.cursor = 'pointer';
                    }
                    console.log('✓ reCAPTCHA completed - user can now submit');
                },
                'expired-callback': function() {
                    console.log('reCAPTCHA expired');
                    recaptchaCompleted = false;
                    recaptchaResponseToken = null;
                    recaptchaTokenTimestamp = null;
                    
                    // Disable the Confirm button
                    const confirmBtn = document.getElementById('confirmStep');
                    if (confirmBtn) {
                        confirmBtn.disabled = true;
                        confirmBtn.style.opacity = '0.5';
                        confirmBtn.style.cursor = 'not-allowed';
                    }
                },
                'error-callback': function(error) {
                    console.error('reCAPTCHA error occurred:', error);
                    recaptchaCompleted = false;
                    recaptchaResponseToken = null;
                    
                    // Show user-friendly error message
                    const container = document.getElementById('recaptcha-container-step4');
                    if (container) {
                        const errorMsg = document.createElement('div');
                        errorMsg.style.cssText = 'color: #d32f2f; padding: 10px; margin-top: 10px; text-align: center; font-size: 14px;';
                        errorMsg.innerHTML = '⚠️ reCAPTCHA error: Please check your site key. You need a <strong>reCAPTCHA v2</strong> key (not Enterprise) for the visible checkbox.';
                        container.appendChild(errorMsg);
                    }
                }
            });
            console.log('reCAPTCHA widget rendered with ID:', recaptchaWidgetId);
            
            // Initially disable Confirm button until reCAPTCHA is completed
            const confirmBtn = document.getElementById('confirmStep');
            if (confirmBtn) {
                confirmBtn.disabled = true;
                confirmBtn.style.opacity = '0.5';
                confirmBtn.style.cursor = 'not-allowed';
            }
        } catch (error) {
            console.error('Error rendering reCAPTCHA:', error);
        }
    }
    
    if (confirmStepBtn) {
        confirmStepBtn.onclick = async function(e) {
            e.preventDefault(); // Prevent default form submission if inside a form
            
            // Check if reCAPTCHA is completed
            if (!recaptchaCompleted || !recaptchaResponseToken) {
                alert('Please complete the reCAPTCHA verification before submitting.');
                return;
            }
            
            // Disable button to prevent double-clicks
            const btn = e.target;
            btn.disabled = true;
            btn.textContent = 'Processing...';
            
            // Check if token is still valid (v2 tokens don't expire as quickly, but check anyway)
            const now = Date.now();
            const tokenExpired = !recaptchaTokenTimestamp || (now - recaptchaTokenTimestamp) >= 120000;
            
            if (tokenExpired) {
                // Token expired, need to get new response
                if (recaptchaWidgetId !== null && typeof grecaptcha !== 'undefined') {
                    try {
                        const newResponse = grecaptcha.getResponse(recaptchaWidgetId);
                        if (newResponse && newResponse.length > 0) {
                            recaptchaResponseToken = newResponse;
                            recaptchaTokenTimestamp = Date.now();
                            console.log('✓ Refreshed reCAPTCHA token');
                        } else {
                            alert('reCAPTCHA has expired. Please refresh the page and complete it again.');
                            btn.disabled = false;
                            btn.textContent = 'Confirm';
                            return;
                        }
                    } catch (error) {
                        console.error('Error getting reCAPTCHA response:', error);
                        alert('reCAPTCHA verification failed. Please refresh the page and try again.');
                        btn.disabled = false;
                        btn.textContent = 'Confirm';
                        return;
                    }
                } else {
                    alert('reCAPTCHA verification failed. Please refresh the page and try again.');
                    btn.disabled = false;
                    btn.textContent = 'Confirm';
                    return;
                }
            }
            
            // Proceed with form submission
            console.log('✓ Using reCAPTCHA token for submission');
            submitForm();
        };
    }
    
    function submitForm() {
        // Fill Jotform hidden form fields with summary data
        document.getElementById('jot_service').value = selectedService;
        document.getElementById('jot_nature').value = formData.nature === 'replace-install' ? 'Replace or install' : formData.nature === 'repair' ? 'Repair' : '';
        document.getElementById('jot_zipcode').value = formData.zipCode;
        document.getElementById('jot_name').value = formData.firstName + ' ' + formData.lastName;
        document.getElementById('jot_email').value = formData.email;
        document.getElementById('jot_phone').value = formData.phone;
        
        // Instead of submitting the form, send data via AJAX
        var form = document.getElementById('jotform-submit');
        var formDataObj = new FormData(form);
        
        // Add reCAPTCHA Enterprise token to the FormData
        // JotForm typically expects 'g-recaptcha-response' for reCAPTCHA tokens
        if (recaptchaResponseToken) {
            formDataObj.append('g-recaptcha-response', recaptchaResponseToken);
            console.log('✓ reCAPTCHA Enterprise token added to form submission');
        } else {
            console.warn('⚠ reCAPTCHA token missing - form will submit without token');
        }
        
        // Log the form data being sent (for debugging)
        console.log('Submitting form data:');
        for (let pair of formDataObj.entries()) {
            if (pair[0] === 'g-recaptcha-response') {
                console.log(pair[0] + ': ' + pair[1].substring(0, 50) + '... (token length: ' + pair[1].length + ')');
            } else {
                console.log(pair[0] + ': ' + pair[1]);
            }
        }
        
        fetch(form.action, {
            method: 'POST',
            body: formDataObj,
            mode: 'no-cors'
        }).then(() => {
            console.log('✓ Form submitted successfully');
        }).catch((error) => {
            console.error('Error submitting form:', error);
        });
        
        // Reset state
        recaptchaCompleted = false;
        recaptchaResponseToken = null;
        recaptchaTokenTimestamp = null;
        
        // Show Thank You modal
        document.getElementById('thankYouModal').style.display = 'block';
        stepModal.style.display = 'none';
    }
    // Thank You Modal logic
    const thankYouModal = document.getElementById('thankYouModal');
    const thankYouClose = document.querySelector('.thank-you-close');

    if (thankYouModal && thankYouClose) {
        thankYouClose.onclick = function() {
            thankYouModal.style.display = 'none';
        };
        window.addEventListener('click', function(event) {
            if (event.target === thankYouModal) {
                thankYouModal.style.display = 'none';
            }
        });
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                thankYouModal.style.display = 'none';
            }
        });
    }

    // To show the thank you modal, call:
    // thankYouModal.style.display = 'flex';
    // Ensure Back/Next always visible in footer
    prevStepBtn.style.display = 'none';
});