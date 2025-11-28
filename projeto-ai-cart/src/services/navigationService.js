import Eitri from "eitri-bifrost";

export const navigateToCheckout = (orderFormId) => {
  Eitri.nativeNavigation.open({
    slug: "checkout",
    initParams: { orderFormId },
  });
};

export const openProduct = async (product) => {
  try {
    Eitri.nativeNavigation.open({
      slug: "pdp",
      initParams: { product },
    });
  } catch (e) {
    console.error("navigate to PDP: Error trying to open PDP", e);
  }
};

export const openProductById = async (productId) => {
  try {
    Eitri.nativeNavigation.open({
      slug: "pdp",
      initParams: { productId },
    });
    console.log("Navega para PDP");
  } catch (e) {
    console.error("navigate to PDP: Error trying to open PDP", e);
  }
};

export const openCart = async (cart) => {
  try {
    Eitri.nativeNavigation.open({
      slug: "eitri-shop-blackskull-cart",
      initParams: { orderFormId: cart?.orderFormId },
    });
    console.log("Navega para carrinho");
  } catch (e) {
    console.error("navigate to cart: Error trying to open cart", e);
  }
};
