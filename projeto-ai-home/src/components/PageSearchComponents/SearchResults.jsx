import Eitri from "eitri-bifrost";
import { Loading, AddedToCartModal } from "projeto-ai-shared";
import { useTranslation } from "eitri-i18n";
import ProductCard from "../ProductCard/ProductCard";
import { openCart } from "../../services/NavigationService";
import ProductDetailsModal from "../ProductDetailsModal/ProductDetailsModal";

export default function SearchResults(props) {
  const { searchResults, isLoading, ...rest } = props;

  const [showAddedToCartModal, setShowAddedToCartModal] = useState(false);
  const [showProductDetailsModal, setShowProductDetailsModal] = useState(false);
  const [productClicked, setProductClicked] = useState();

  const { t } = useTranslation();

  if (searchResults.length === 0 && !isLoading) {
    return <Text>{t("searchResults.resultNotFound")}</Text>;
  }

  const handleShowModal = () => {
    setShowAddedToCartModal(true);
  };

  const handleOpenCart = () => {
    openCart();
    setShowAddedToCartModal(false);
  };

  const handleKeepShopping = () => {
    setShowAddedToCartModal(false);
  };

  return (
    <View direction="column" gap={16} {...rest}>
      {searchResults.map(
        (product, index) =>
          index % 2 === 0 && (
            <View key={searchResults[index].productId} display="flex">
              <View width="50%" paddingRight="nano">
                <ProductCard
                  product={searchResults[index]}
                  onAddToCartSuccess={handleShowModal}
                  setShowProductDetailsModal={setShowProductDetailsModal}
                  setProductClicked={setProductClicked}
                />
              </View>
              {searchResults[index + 1] && (
                <View width="50%" paddingLeft="nano">
                  <ProductCard
                    product={searchResults[index + 1]}
                    onAddToCartSuccess={handleShowModal}
                    setShowProductDetailsModal={setShowProductDetailsModal}
                    setProductClicked={setProductClicked}
                  />
                </View>
              )}
            </View>
          )
      )}
      {isLoading && (
        <View display="flex" alignItems="center" justifyContent="center">
          <Loading />
        </View>
      )}
      <ProductDetailsModal
        showModal={showProductDetailsModal}
        onClose={() => setShowProductDetailsModal(false)}
        product={productClicked}
      />
      <AddedToCartModal
        showModal={showAddedToCartModal}
        onClose={() => setShowAddedToCartModal(false)}
        onPressOpenCart={handleOpenCart}
        onPressKeepShopping={handleKeepShopping}
      />
    </View>
  );
}
