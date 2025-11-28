import { getProductsByFacets } from "../../services/ProductService";
import { logEvent } from "../../services/TrackingService";
import { slugify } from "../../utils/utils";
import SearchResults from "../PageSearchComponents/SearchResults";

export default function ProductInfiniteScroll(props) {
  const { data } = props;

  const [scrollEnded, setScrollEnded] = useState(false);
  const [productLoading, setProductLoading] = useState(false);

  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagesHasEnded, setPageHasEnded] = useState(false);

  useEffect(() => _getProductsByFacets(data, currentPage), []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 300
      ) {
        setScrollEnded(true);
      }
    };

    if (products?.length >= 24) {
      window.addEventListener("scroll", handleScroll);
    } else {
      window.removeEventListener("scroll", handleScroll);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [products]);

  useEffect(() => {
    if (!productLoading && scrollEnded && !pagesHasEnded) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      _getProductsByFacets(data, newPage);
    }
    setScrollEnded(false);
  }, [scrollEnded]);

  const _getProductsByFacets = async (selectedFacets, page) => {
    try {
      if (productLoading || pagesHasEnded) return;

      setProductLoading(true);

      const facetsPath = selectedFacets?.facets
        ?.map((facet) => `${facet.key}/${facet.value}`)
        .join("/");

      const result = await getProductsByFacets(facetsPath, {
        sort: selectedFacets.sort,
        query: selectedFacets?.query || selectedFacets?.q || "",
        page: page,
      });

      if (result.products.length === 0) {
        setProductLoading(false);
        setPageHasEnded(true);
        return;
      }

      const onlyDiscounted = result.products.filter((product) => {
        const item = product?.items?.[0];
        const sellerDefault =
          item?.sellers?.find((seller) => seller.sellerDefault) ||
          item?.sellers?.[0];

        const price = sellerDefault?.commertialOffer?.Price;
        const listPrice = sellerDefault?.commertialOffer?.ListPrice;
        const isAvailable = product.items?.some((sku) =>
          sku.sellers?.some(
            (seller) => seller?.commertialOffer?.AvailableQuantity > 0
          )
        );

        return (
          isAvailable &&
          price != null &&
          listPrice != null &&
          price !== listPrice
        );
      });

      setProducts((prev) => [...prev, ...onlyDiscounted]);
      setProductLoading(false);

      if (result?.products?.length > 0) {
        const trackingListName = data?.title || facetsPath || `Lista genérica`;
        logEvent("view_item_list", {
          currency: "BRL",
          item_list_id: slugify(trackingListName),
          item_list_name: trackingListName,
          items: result.products.map((item) => ({
            item_id: item.productId,
            item_name: item.name || item.productName || item.nameComplete,
          })),
        });
      }
    } catch (error) {
      console.log("Error getProductsByFacets:", error);
    }
  };

  return (
    <View paddingHorizontal={"large"}>
      {data?.title && (
        <View
          display="flex"
          justifyContent="between"
          alignItems="center"
          marginBottom="extra-small"
        >
          <Text fontWeight="bold" fontSize="extra-large">
            {data?.title}
          </Text>
        </View>
      )}

      <SearchResults searchResults={products} isLoading={productLoading} />
    </View>
  );
}
