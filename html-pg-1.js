
// Check for online status but don't block the whole script loading
// We can handle offline status gracefully within functions if needed

const hotels = [
  {
    id: 1,
    name: "Ganesh PG",
    city: "Mysore,Gokulam",
    price: 4500,
    image: "pg_building.png",
    location: "https://maps.app.goo.gl/8YQVGKkUomk3AmS16"
  },
  {
    id: 2,
    name: "Friends PG",
    city: "Mysore,Gokulam",
    price: 5500,
    image: "pg_building.png", // Added image
    location: "https://maps.app.goo.gl/CESFky3zrwAFCaxq5"
  },
  {
    id: 3,
    name: "Nanda-Deepa PG",
    city: "Mysore,Gokulam",
    price: 5500,
    image: "pg_building.png", // Added image
    location: "https://maps.app.goo.gl/37XBXjb9bcYu9ZgcA"
  },
  {
    id: 4,
    name: "Ramesh PG",
    city: "Mysore,Vijaynagar",
    price: 5500,
    image: "pg_building.png", // Added image
    location: "https://maps.app.goo.gl/37XBXjb9bcYu9ZgcA"
  }
];

function displayHotels(hotelArray) {
  const list = document.getElementById("hotelList");
  if (!list) return; // Guard clause
  list.innerHTML = "";

  hotelArray.forEach((hotel, index) => {
    // Note: passing index to bookHotel might be risky if array is filtered. 
    // Better to pass ID, but keeping index for now to minimize refactor risk if index is used directly.
    // However, if search filters the array, index changes. 
    // Let's attach the click listener properly or ensure filtered index matches.
    // simpler: Use event delegation or closure.

    // Creating element to attach event listener more safely or stringify correctly
    // The previous onclick="bookHotel('${index}')" refers to original array index ONLY if we are careful.
    // If we filter, we must look up the original item.

    // For this simple app, we will pass the hotel ID and find it.

    const hotelCard = document.createElement('div');
    hotelCard.className = 'hotel';
    hotelCard.innerHTML = `
      <img id="img-cont" src="${hotel.image}" alt="${hotel.name}">
      <div class="hotel-details">
        <h3>${hotel.name}</h3>
        <p>City: ${hotel.city}</p>
        <a href="${hotel.location}" target="_blank">Navigation</a>
        <p>Price Per Month: ₹${hotel.price}</p>
        <button class="book-btn">Book Now</button>
      </div>
    `;

    const btn = hotelCard.querySelector('.book-btn');
    btn.onclick = () => bookHotel(hotel); // Pass the hotel object directly

    list.appendChild(hotelCard);
  });
}

function searchHotels() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const filtered = hotels.filter(hotel =>
    hotel.name.toLowerCase().includes(query) ||
    hotel.city.toLowerCase().includes(query)
  );
  displayHotels(filtered);
}


function bookHotel(hotel) {
  if (!navigator.onLine) {
    alert("You appear to be offline. Booking requires an internet connection.");
    return;
  }

  const askingSection = document.getElementById('asking');
  const detailsSection = document.getElementById('asking-details');
  const submitBtn = document.getElementById('submit-btn');
  const otpBtn = document.getElementById('otp-btn');
  const closeBtn = document.getElementById('asking-close-btn');

  askingSection.style.display = "flex"; // Use flex to center with modal-overlay class
  // detailsSection.style.display = "block"; // Already visible inside

  // Clear previous listeners to avoid duplicates (naive approach is to clone or just use onclick)
  // Since we are using onclick assignments below, it overrides previous ones, which is fine here.

  let generatedOTP = null;

  // OTP Function
  otpBtn.onclick = () => {
    let userContact = document.getElementById('user-contact').value.trim();
    let userName = document.getElementById('user-name').value.trim();

    if (userContact.length === 10 && userName.length > 1) {
      generatedOTP = Math.floor(10000 + Math.random() * 30000);
      alert(`(Simulation) Your OTP is: ${generatedOTP}`);
      console.log("Current OTP", generatedOTP);
    } else {
      alert('Please enter a valid Name and 10-digit Contact Number!');
    }
  }

  // Close Function
  closeBtn.onclick = () => {
    askingSection.style.display = "none";
  }

  // Submit Button
  submitBtn.onclick = () => {
    let enteredOTP = document.getElementById('otp-recive').value;
    let userName = document.getElementById('user-name').value.trim();
    let userContact = document.getElementById('user-contact').value.trim();
    const now = new Date();

    if (generatedOTP && parseInt(enteredOTP) === generatedOTP) {
      console.log("Registered Successful");

      // Show Booking Details
      askingSection.style.display = "none"; // Hide asking

      const bookingDetails = document.getElementById("bookingDetails");
      bookingDetails.style.display = "block"; // Keep block or use a class toggle if preferre

      document.getElementById("bookedHotelInfo").innerHTML = `
        <img id="right-img" src="image2.png" alt="Success"><br>
        <strong>PG ID:</strong> ${hotel.id} <br>
        <strong>PG Name:</strong> ${hotel.name} <br>
        <strong>City:</strong> ${hotel.city}
        <p>Take a Photo for Your Confirmation</p>
        <p>Name: ${userName}<br>Contact: ${userContact}<br></p>
        <p>${now.toString()}</p>
        <button id="booking-close-btn">Close</button>
      `;

      // Close Booking Details
      document.getElementById('booking-close-btn').onclick = () => {
        bookingDetails.style.display = "none";
      }

    } else {
      alert('Invalid OTP or OTP not generated yet!');
    }
  }
}

// Initial display
displayHotels(hotels);

// Offline Check (Optional Toast)
window.addEventListener('offline', () => {
  // Optional: alert or show toast
  console.log("Network lost.");
});
