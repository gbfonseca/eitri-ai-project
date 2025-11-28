import { Vtex } from "eitri-shopping-vtex-shared";
import { getProductsByFacets } from "../../services/ProductServices";
import ShelfOfProducts from "../ShelfOfProducts/ShelfOfProducts";


export default function ProductShelf(props) {

  const {products} = props;

  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [searchParams, setSearchParams] = useState();
  
  return (
    <ShelfOfProducts
      gap={15}
      title={"OS MAIS VENDIDOS"}
      isLoading={isLoadingProducts}
      products={products}
      searchParams={{
        "facets": [
          {
            "key": "productClusterIds",
            "value": "153"
          }
        ],
        "count": 8
      }}
      mode={"carousel"}
    />
  );
}
