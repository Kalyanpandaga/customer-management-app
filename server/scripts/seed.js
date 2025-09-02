import db from "../src/config/database.js";

const firstNames = [
  "Alice",
  "Bob",
  "Charlie",
  "David",
  "Eva",
  "Frank",
  "Grace",
  "Harry",
  "Ivy",
  "Jack",
  "Kathy",
  "Leo",
  "Mona",
  "Nina",
  "Oscar",
  "Peter",
  "Quinn",
  "Rita",
  "Sam",
  "Tina",
  "Uma",
  "Victor",
  "Wendy",
  "Xander",
  "Yara",
  "Zane",
  "Angela",
  "Brian",
  "Cathy",
  "Denis",
  "Eliyah",
  "Fiona",
  "Gia",
  "Hugo",
  "Irvin",
];

const lastNames = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Miller",
  "Davis",
  "Garcia",
  "Rodriguez",
  "Martinez",
  "Hernandez",
  "Lopez",
  "Gonzalez",
  "Wilson",
  "Anderson",
  "Thomas",
  "Taylor",
  "Moore",
  "Jackson",
  "Martin",
  "Lee",
  "Perez",
  "Thompson",
  "White",
  "Harris",
  "Sanchez",
  "Clark",
  "Ramirez",
  "Lewis",
  "Robinson",
  "Walker",
  "Young",
  "Allen",
  "King",
  "Wright",
];

const cities = [
  "Mumbai",
  "Pune",
  "Thane",
  "Nashik",
  "Nagpur",
  "Aurangabad",
  "Kolhapur",
  "Solapur",
  "Amravati",
  "Jalgaon",
];

const states = ["Maharashtra", "Gujarat", "Punjab", "Rajasthan"];

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomPinCode() {
  return (400000 + Math.floor(Math.random() * 999)).toString();
}

// Begin the seed
db.serialize(() => {
  db.run("DELETE FROM addresses");
  db.run("DELETE FROM customers");

  let customerAddressMap = {}; // customerId: number of addresses

  // Insert 35 customers
  for (let i = 0; i < 35; i++) {
    let firstName = firstNames[i % firstNames.length];
    let lastName = lastNames[i % lastNames.length];
    let phoneNumber = (9123456700 + i).toString();

    db.run(
      "INSERT INTO customers (first_name, last_name, phone_number) VALUES (?, ?, ?)",
      [firstName, lastName, phoneNumber]
    );

    customerAddressMap[i + 1] = 1 + (i % 3); // cyclic: 1,2,3 addresses
  }

  // Insert addresses
  let addressDetails = [
    "Flat 101, Green Residency",
    "Villa 202, Blue Valley",
    "Office 303, Red Tower",
    "House 12C, Sunshine Colony",
    "Apartment 55A, River View",
    "Unit 6, Tech Park",
    "Suite 9B, Lake Residency",
    "Cottage 7, Hill View",
  ];

  let addressCounter = 0;
  for (let customerId = 1; customerId <= 35; customerId++) {
    let addrCount = customerAddressMap[customerId];
    for (let j = 0; j < addrCount; j++) {
      let adDetails =
        addressDetails[(addressCounter + j) % addressDetails.length];
      db.run(
        "INSERT INTO addresses (customer_id, address_details, city, state, pin_code) VALUES (?, ?, ?, ?, ?)",
        [customerId, adDetails, random(cities), random(states), randomPinCode()]
      );
    }
    addressCounter += addrCount;
  }

  console.log("✅ Seeded 35 customers with 1-3 addresses each.");
  db.close();
});
