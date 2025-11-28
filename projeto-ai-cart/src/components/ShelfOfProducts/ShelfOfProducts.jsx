import Eitri from "eitri-bifrost";
import { Loading, AddedToCartModal } from "projeto-ai-shared";
import ShelfOfProductsCarousel from "./components/ShelfOfProductsCarousel";
import { useTranslation } from "eitri-i18n";
import ProductCard from "../ProductCard/ProductCard";
import { App } from "eitri-shopping-vtex-shared";
import { openCart } from "../../services/navigationService";

export default function ShelfOfProducts(props) {
  const {
    products,
    title,
    gap,
    paddingHorizontal,
    isLoading,
    searchParams,
    mode,
    ...rest
  } = props;

  const [showAddedToCartModal, setShowAddedToCartModal] = useState(false);
  const { t } = useTranslation();

  const seeMore = () => {
    Eitri.navigation.navigate({
      path: "ProductCatalog",
      state: { params: searchParams, title: title },
    });
  };

  // const newMode = App.configs?.appConfigs?.productShelfMode ?? "carousel";
  const newMode = mode
    ? mode
    : App.configs?.appConfigs?.productShelfMode ?? "carousel";

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

  const isFlashPromotion = title === "PROMOÇÃO RELÂMPAGO";

  return (
    <View
      {...rest}
      marginTop="huge"
      marginBottom={isFlashPromotion ? "none" : "huge"}
      paddingVertical={isFlashPromotion ? "display" : "none"}
      backgroundColor={isFlashPromotion ? "secondary-500" : "none"}
    >
      {title && (
        <View
          paddingHorizontal={paddingHorizontal || "large"}
          display="flex"
          justifyContent="between"
          alignItems="center"
          marginBottom="large"
        >
          <Text color="accent-100" fontWeight="bold" fontSize="large">
            {isLoading ? t("shelfOfProducts.loading") : title}
          </Text>

        </View>
      )}

      {newMode === "carousel" && (
        <ShelfOfProductsCarousel
          paddingTop="extra-large"
          paddingBottom="nano"
          isLoading={isLoading}
          products={products}
          gap={gap}
          isFlashPromotion={isFlashPromotion}
        />
      )}

      {newMode !== "carousel" && (
        <Stack
          direction="row"
          overflowX="scroll"
          paddingTop="extra-large"
          paddingBottom="nano"
          gap={gap}
          scrollSnapType="x mandatory"
        >
          {gap && <View width={gap} height="1px" />}
          {isLoading && (
            <View direction="row" display="flex" gap={gap}>
              <View
                width="188px"
                minHeight="288px"
                borderRadius="small"
                padding="extra-small"
                borderColor="tertiary-700"
                borderWidth="hairline"
                backgroundColor="neutral-100"
              >
                <View
                  direction="column"
                  justifyContent="center"
                  borderRadius="micro"
                  alignItems="center"
                  padding="small"
                  paddingTop="jumbo"
                >
                  <Loading inline width="80px" />
                </View>
              </View>
              <View
                width="188px"
                minHeight="288px"
                borderRadius="small"
                padding="extra-small"
                borderColor="tertiary-700"
                borderWidth="hairline"
                backgroundColor="neutral-100"
              >
                <View
                  direction="column"
                  justifyContent="center"
                  borderRadius="micro"
                  alignItems="center"
                  padding="small"
                  paddingTop="jumbo"
                >
                  <Loading inline width="80px" />
                </View>
              </View>
            </View>
          )}
          {!isLoading &&
            products &&
            products.map((product, index) => {
              const isFirst = index === 0;
              const isLast = index === products.length - 1;

              return (
                <View
                  key={product?.productId}
                  paddingLeft={isFirst ? "large" : undefined}
                  paddingRight={isLast ? "large" : undefined}
                  scrollSnapAlign="start"
                >
                  <ProductCard
                    product={product}
                    width="188px"
                    onAddToCartSuccess={handleShowModal}
                  />
                </View>
              );
            })}
          {gap && <View width={gap} height="1px" />}
        </Stack>
      )}

      <AddedToCartModal
        showModal={showAddedToCartModal}
        onClose={() => setShowAddedToCartModal(false)}
        onPressOpenCart={handleOpenCart}
        onPressKeepShopping={handleKeepShopping}
      />
    </View>
  );
}
