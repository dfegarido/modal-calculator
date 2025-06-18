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
});