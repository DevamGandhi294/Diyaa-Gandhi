import { db } from 'firebase-config.js';
import { collection, getDocs, addDoc } from 'firebase/firestore';

async function loadCakeTypes() {
  try {
    const cakesCollection = collection(db, 'cakes');
    const cakesSnapshot = await getDocs(cakesCollection);
    const cakeTypeSelect = document.getElementById('cake-type');
    
    cakesSnapshot.forEach((doc) => {
      const cake = doc.data();
      const option = document.createElement('option');
      option.value = cake.name;
      option.textContent = `${cake.name} (${cake.type})`;
      cakeTypeSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error loading cake types:", error);
  }
}

async function handleOrderSubmit(event) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const orderData = {
    customerName: formData.get('name'),
    cakeType: formData.get('cakeType'),
    phoneNumber: formData.get('phone'),
    address: formData.get('address'),
    weight: formData.get('weight'),
    flavor: formData.get('flavor'),
    orderDate: new Date(),
    status: 'pending'
  };

  try {
    const ordersCollection = collection(db, 'orders');
    await addDoc(ordersCollection, orderData);
    alert('Order placed successfully!');
    event.target.reset();
  } catch (error) {
    console.error("Error submitting order:", error);
    alert('Error placing order. Please try again.');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadCakeTypes();
  document.getElementById('order-form').addEventListener('submit', handleOrderSubmit);
});