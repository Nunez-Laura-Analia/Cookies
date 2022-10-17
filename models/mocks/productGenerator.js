import { faker } from "@faker-js/faker";

export default function createFakeProducts(n = 5) {
  let products = [];
  for (let i = 0; i < n; i++) {
    products.push({
      name: faker.commerce.products(),
      price: faker.commerce.price(5000, 5000, 0, "$"),
      thumbnail: faker.image.avatar(),
    });
  }
  return products;
}
