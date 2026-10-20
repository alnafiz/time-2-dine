document.addEventListener('DOMContentLoaded', () => {
    const optionBtns = document.querySelectorAll('.option-btn');
    const navLinks = document.querySelectorAll('.nav-link');
    const partyInput = document.getElementById('party-size');

    // Option button selection
    optionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons in the same section
            const section = btn.closest('.section');
            section.querySelectorAll('.option-btn').forEach(b => {
                b.classList.remove('active');
            });
            // Add active class to clicked button
            btn.classList.add('active');
        });
    });

    // Navigation active state
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link behavior
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            link.classList.add('active');
            
            // If it's a real link (has href), navigate after a small delay
            const href = link.getAttribute('href');
            if (href && href !== '#') {
                setTimeout(() => {
                    window.location.href = href;
                }, 300); // Delay to show the color change
            }
        });
    });

    // Auto-select table based on party size
    function selectAppropriateTable(partySize) {
        const tableButtons = document.querySelectorAll('.table-options .option-btn');
        
        // Reset all buttons to normal state
        tableButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.removeAttribute('disabled');
            btn.style.opacity = '';
            btn.style.pointerEvents = '';
            btn.style.filter = '';
        });

        // Only proceed if party size is valid and greater than 0
        if (!Number.isFinite(partySize) || partySize <= 0) return;

        // Determine which table size to select based on party size
        let selectedTableSize;
        if (partySize <= 2) {
            selectedTableSize = 2;
        } else if (partySize <= 4) {
            selectedTableSize = 4;
        } else if (partySize <= 6) {
            selectedTableSize = 6;
        } else {
            // For larger parties, select the largest available table (6)
            selectedTableSize = 6;
        }

        // Find and activate the appropriate button
        const targetButton = Array.from(tableButtons).find(btn => 
            btn.textContent.trim().startsWith(selectedTableSize + ' ')
        );

        if (targetButton) {
            targetButton.classList.add('active');
        }

        // Disable other buttons (make them blurred/unclickable)
        tableButtons.forEach(btn => {
            if (btn !== targetButton) {
                btn.setAttribute('disabled', 'true');
                btn.style.opacity = '0.4';
                btn.style.pointerEvents = 'none';
                btn.style.filter = 'blur(1px)';
            }
        });
    }

    function onPartyChange() {
        const partySize = parseInt(partyInput?.value || '0', 10);
        selectAppropriateTable(partySize);
    }
    if (partyInput){
        partyInput.addEventListener('input', onPartyChange);
        // Don't call onPartyChange() on page load - let all tables be visible initially
    }

    // Check if user came from menu page with cart data
    function hasCartData() {
        const cartData = sessionStorage.getItem('cartData');
        return cartData && JSON.parse(cartData).length > 0;
    }

    // Hide pre-order section if user has cart data
    function handlePreOrderVisibility() {
        const preorderSection = document.querySelector('.preorder-options')?.closest('.section');
        if (hasCartData() && preorderSection) {
            preorderSection.style.display = 'none';
            // Auto-select "Yes" for pre-order since they have items
            const yesBtn = document.querySelector('.preorder-options .option-btn:first-child');
            if (yesBtn) {
                yesBtn.classList.add('active');
            }
        }
    }

    // Confirm button -> redirect based on pre-order selection
    const submitBtn = document.querySelector('.submit-btn');
    if (submitBtn) {
        submitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Validate required fields
            const restaurant = document.querySelector('.title')?.textContent?.trim() || 'Restaurant';
            const date = document.querySelector('input[type="date"]')?.value || '';
            const time = document.querySelector('input[type="time"]')?.value || '';
            const name = document.getElementById('reservation-name')?.value?.trim() || '';
            const partySize = parseInt(document.getElementById('party-size')?.value || '0', 10);
            const table = document.querySelector('.table-options .option-btn.active')?.textContent?.trim() || '';
            const seating = document.querySelector('.seating-options .option-btn.active')?.textContent?.trim() || '';
            const preorder = document.querySelector('.preorder-options .option-btn.active')?.textContent?.trim() || '';

            // Check if all required fields are filled (skip preorder if has cart data)
            const requiredFields = !name || !date || !time || !table || !seating;
            const needsPreorderSelection = !hasCartData() && !preorder;
            
            if (requiredFields || needsPreorderSelection) {
                alert('Please fill in all required fields and make all selections before proceeding.');
                return;
            }

            // Store reservation data in sessionStorage for later use
            const reservationData = {
                restaurant,
                date,
                time,
                name,
                table,
                seating,
                partySize
            };
            sessionStorage.setItem('reservationData', JSON.stringify(reservationData));

            // Decide navigation:
            const comingFromMenu = hasCartData();
            const userChosePreorder = (preorder || '').toLowerCase() === 'yes';

            if (comingFromMenu) {
                // Already pre-ordered; go directly to bill
                const params = new URLSearchParams({ restaurant, date, time, name, table, seating });
                window.location.href = `bill.html?${params.toString()}`;
                return;
            }

            if (userChosePreorder) {
                // Redirect to menu page for pre-ordering
                let menuPage = '';
                if (restaurant.toLowerCase().includes('brew')) menuPage = 'brew.html';
                else if (restaurant.toLowerCase().includes('chillox')) menuPage = 'chillox.html';
                else if (restaurant.toLowerCase().includes('kacchi')) menuPage = 'kacchi.html';
                else if (restaurant.toLowerCase().includes('khanas')) menuPage = 'khanas.html';
                else if (restaurant.toLowerCase().includes('lueur')) menuPage = 'lueur.html';
                else if (restaurant.toLowerCase().includes('pizza hut')) menuPage = 'pizzahut.html';
                else if (restaurant.toLowerCase().includes('kudos')) menuPage = 'kudos.html';
                else if (restaurant.toLowerCase().includes('sultan')) menuPage = 'sultan.html';
                else if (restaurant.toLowerCase().includes('chinese')) menuPage = 'chinese_reservation.html';
                else menuPage = 'home.html';
                window.location.href = menuPage;
            } else {
                // No pre-order; go to bill
                const params = new URLSearchParams({ restaurant, date, time, name, table, seating });
                window.location.href = `bill.html?${params.toString()}`;
            }
        });
    }

    // Initialize pre-order visibility on page load
    handlePreOrderVisibility();
});
