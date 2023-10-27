const { MongoClient } = require('mongodb');

async function seedData() {
  const uri = 'mongodb://0.0.0.0:27017'; 
  const client = new MongoClient(uri);

  try {
    await client.connect();

    const database = client.db('BeanSceneMobileApp');
    const menuItems = [
        {
            _id: 1,
            name: "Latte",
            description: "A smooth milky latte",
            price: 4.30,
            category: "DRINK",
            ingredients: [
              "Milk",
              "Coffee",
              "Water"
            ],
            dietary: [
              "Milk"
            ]
          }
          , {
            _id: 2,
            name: "Pad Thai",
            description: "Pad Thai is a Thai dish of stir-fried rice noodles with eggs, vegetables and tofu in a sauce of tamarind, fish, dried shrimp, garlic, red chilli pepper and sugar.",
            price: 13.9,
            category: "MAIN",
            ingredients: [
              "Egg",
              "Flour",
              "Tofu",
              "Fish",
              "Dried shrimp",
              "Garlic",
              "Sugar",
              "Red Chilli pepper"
            ],
            dietary: [
              "Egg", "Fish"
            ]
          }, {
            _id: 3,
            name: "Tom yum",
            description: "A well known Thai dish, spicy, sour, and aromatic soup that is traditionally served with rice.",
            price: 14.00,
            category: "MAIN",
            ingredients: [
              "Shallot",
              "Lemongrass",
              "Fish sauce",
              "Minced flesh",
              "Ginger",
              "Galangal",
              "Thai chilli peppers",
              "Shrimp",
              "Mushroom",
              "Kaffir lime leaves"
            ],
            dietary: [
              "Meat"
            ]
          }, {
            _id: 4,
            name: "Strawberry Milkshake",
            description: "Strawberries that is blended with milk, served cold.",
            price: 6.00,
            category: "DRINK",
            ingredients: [
              "Milk",
              "Strawberry",
              "Vanilla Icecream",
              "Whipped Cream",
            ],
            dietary: [
              "Milk"
            ]
          }, {
            _id: 5,
            name: "Spaghetti",
            description: "Some Italian food",
            price: 15,
            category: "MAIN",
            ingredients: [
              "Pasta",
              "Tomato",
              "Meat",
            ],
            dietary: [
              "Meat"
            ]
          }
      ];
    
    

    await database.collection('menuItems').insertMany(menuItems);

    console.log('Data seeded successfully');
  } finally {
    await client.close();
  }
}

seedData().catch(console.error);
