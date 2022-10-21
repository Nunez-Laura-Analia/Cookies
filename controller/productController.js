import { createFakeProducts } from "../models/mocks/indexjs";

export const productController = {
  getData: async (req, res) => {
    try {
      let products = await createFakeProducts(5);
      if (products.length > 0) {
        res.render("pages/products", {
          products: products,
          productsExist: true,
        });
      } else {
        res.render("pages/products", {
          products: products,
          productsExist: false,
        });
      }
    } catch (e) {
      console.log(e);
    }
  },
};
