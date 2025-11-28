import Eitri from "eitri-bifrost";

export const getRatings = async (productId) => {
  const response = await Eitri.http.get(
    `https://blackskullusa.myvtex.com/reviews-and-ratings/api/rating/${productId}`
  );

  return response.data;
};
