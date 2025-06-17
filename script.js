// Get modal elements
const modal = document.getElementById('simpleModal');
const openBtn = document.getElementById('get-pro-openModal');
const closeBtn = document.getElementsByClassName('close')[0];

// Open modal
openBtn.onclick = function() {
    modal.style.display = 'block';
}

// Close modal when clicking the X
closeBtn.onclick = function() {
    modal.style.display = 'none';
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        modal.style.display = 'none';
    }
});
