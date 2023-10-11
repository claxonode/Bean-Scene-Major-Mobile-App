export function filterItems(items, query) {
  query = query.toLowerCase();
  return items.filter(item =>
    item.name.split(' ').some(word =>
      word.toLowerCase().startsWith(query)
    )
  );
}


export function sortByAscend(a, b,) {
  const x = a
  const y = b
  if (x < y) {
    return -1;
  } if (x > y) {
    return 1;
  } else {
    return 0
  }
}
export function sortByDescend(a, b) {
  const x = a
  const y = b
  if (x > y) {
    return -1;
  } if (x < y) {
    return 1;
  } else {
    return 0
  }
}

export function transformArray(array) {
  return array.sort((a, b) => sortByAscend(a["category"], b["category"]))
    .reduce((acc, item, index, array) => {
      const object = new Object();
      object["title"] = item.category

      if (index === 0) {
        object["data"] = array.filter(x => x.category === item.category)
        acc.push(object)
        return acc;
      }
      //run for the second time
      let previous = acc[acc.length - 1]

      if (previous["title"] !== object["title"]) {
        object["data"] = array.filter(x => x.category === item.category)
        acc.push(object);
      }

      return acc;
    }, [])

}
export function sortTransformed(array, sortBy) {
  let sortFunction;
  let property;
  switch (sortBy) {
    case "sortAscendName":
      sortFunction = sortByAscend
      property = "name"
      break
    case "sortDescendName":
      sortFunction = sortByDescend
      property = "name"
      break
    case "sortAscendPrice":
      sortFunction = sortByAscend
      property = "price"
      break
    case "sortDescendPrice":
      sortFunction = sortByDescend
      property = "price"
      break
    default:
      return array
  }

  return array.reduce((acc, item) => {
    const object = new Object();
    object["title"] = item.title
    if (sortFunction == null || property == null) {
      object["data"] = item.data
    }
    else {
      object["data"] = item.data.sort((a, b) => sortFunction(a[property], b[property]))
    }
    acc.push(object);
    return acc
  }, [])
}
export const transformMenuForSectionList = (array,filterSearch,sortBy,filterCategory) => {
  let filtered = filterItems(array,filterSearch)
  let transform = transformArray(filtered)

  let sortTransform = sortTransformed(transform,sortBy)
  filterCategory = filterCategory.toUpperCase()
  if (filterCategory === "ALL") {
    return sortTransform
  }
  sortTransform = sortTransform.filter(x=>x.title === filterCategory)
  return sortTransform
}
export const MENULIST = [
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
]