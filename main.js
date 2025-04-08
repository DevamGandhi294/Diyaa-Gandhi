// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDn9jgvHY-B8JeedeSD26-jFO4VqmD1XSw",
    appId: "1:43779460989:web:9b5b2c2b8b2ad2f4900614",
    messagingSenderId: "43779460989",
    projectId: "bbyd-bc3a8",
    authDomain: "bbyd-bc3a8.firebaseapp.com",
    storageBucket: "bbyd-bc3a8.firebasestorage.app",
    measurementId: "G-FSWYGGNN1Q",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Load cakes from Firebase
async function loadCakes() {
    try {
        const cakesSnapshot = await db.collection('cakes').get();
        const cakesContainer = document.getElementById('cakes-container');
        const cakeTypeSelect = document.getElementById('cake-type');
        const uniqueTypes = new Set();

        cakesContainer.innerHTML = '';
        cakeTypeSelect.innerHTML = '<option value="">Select Cake Type</option>';

        cakesSnapshot.forEach(doc => {
            const cake = doc.data();
            uniqueTypes.add(cake.type);

            // Create table row
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><img src="${cake.image}" alt="${cake.name}"></td>
                <td>${cake.name}</td>
                <td>${cake.type}</td>
                <td>${cake.flavor}</td>
                <td>₹${cake.price}</td>
            `;
            cakesContainer.appendChild(row);
        });

        // Populate cake types dropdown
        uniqueTypes.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            cakeTypeSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error loading cakes:", error);
    }
}

// Update cake names based on selected type
async function updateCakeNames(selectedType) {
    try {
        const cakesSnapshot = await db.collection('cakes')
            .where('type', '==', selectedType)
            .get();

        const cakeNameSelect = document.getElementById('cake-name');
        const flavorSelect = document.getElementById('flavor');
        
        cakeNameSelect.innerHTML = '<option value="">Select Cake</option>';
        flavorSelect.innerHTML = '<option value="">Select Flavor</option>';

        const uniqueFlavors = new Set();

        cakesSnapshot.forEach(doc => {
            const cake = doc.data();
            
            // Add cake name option
            const nameOption = document.createElement('option');
            nameOption.value = cake.name;
            nameOption.textContent = cake.name;
            cakeNameSelect.appendChild(nameOption);

            // Collect unique flavors
            uniqueFlavors.add(cake.flavor);
        });

        // Populate flavors dropdown
        uniqueFlavors.forEach(flavor => {
            const option = document.createElement('option');
            option.value = flavor;
            option.textContent = flavor;
            flavorSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error updating cake names:", error);
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadCakes();

    // Update cake names when type is selected
    document.getElementById('cake-type').addEventListener('change', (e) => {
        if (e.target.value) {
            updateCakeNames(e.target.value);
        }
    });

    // Handle form submission
    document.getElementById('order-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const orderData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            cakeType: document.getElementById('cake-type').value,
            cakeName: document.getElementById('cake-name').value,
            weight: document.getElementById('weight').value,
            flavor: document.getElementById('flavor').value,
            description: document.getElementById('description').value,
            orderDate: new Date(),
        };

        try {
            await db.collection('orders').add(orderData);
            alert('Order placed successfully!');
            e.target.reset();
        } catch (error) {
            console.error("Error placing order:", error);
            alert('Error placing order. Please try again.');
        }
    });
});