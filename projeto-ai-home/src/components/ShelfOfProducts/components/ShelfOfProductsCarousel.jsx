import ProductCardLoading from "./ProductCardLoading";
import ProductCard from "../../ProductCard/ProductCard";
import ProductDetailsModal from "../../ProductDetailsModal/ProductDetailsModal";
import { CustomButton } from "projeto-ai-shared";
import { useTranslation } from "eitri-i18n";

export default function ShelfOfProductsCarousel(props) {
  const { isLoading, products, gap, locale, currency, isFlashPromotion } =
    props;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [productsPage, setProductsPage] = useState([]);
  const [showProductDetailsModal, setShowProductDetailsModal] = useState(false);
  const [productClicked, setProductClicked] = useState();

  const products_per_page = 2;

  useEffect(() => {
    if (Array.isArray(products)) {
      const pages = [];
      for (let i = 0; i < products.length; i += products_per_page) {
        pages.push(products.slice(i, i + products_per_page));
      }
      setProductsPage(pages);
    }
  }, [products]);

  const onChangeSlide = (index) => {
    setCurrentSlide(index);
  };

  const _backgroundColorIsActive = isFlashPromotion
    ? "primary-300"
    : "secondary-500";
  const _backgroundColorIsNotActive = isFlashPromotion
    ? "primary-300"
    : "accent-900";

  const [stateTest, setStateTest] = useState(true);

  return (
    <>
      {isLoading ? (
        <ProductCardLoading gap={gap} />
      ) : (
        <>
          <Carousel
            afterChange={onChangeSlide}
            initialSlide={currentSlide}
            speed={200}
          >
            {productsPage &&
              productsPage
                .map((page) => (
                  <View
                    key={page?.[0]?.productId}
                    paddingVertical="quark"
                    display="flex"
                    justifyContent="center"
                  >
                    <View width="50%" paddingLeft="large" paddingRight="nano">
                      <ProductCard
                        product={page[0]}
                        locale={locale}
                        currency={currency}
                        setShowProductDetailsModal={setShowProductDetailsModal}
                        setProductClicked={setProductClicked}
                      />
                    </View>

                    {page.length > 1 ? (
                      <View width="50%" paddingRight="large" paddingLeft="nano">
                        <ProductCard
                          product={page[1]}
                          locale={locale}
                          currency={currency}
                          setShowProductDetailsModal={
                            setShowProductDetailsModal
                          }
                          setProductClicked={setProductClicked}
                        />
                      </View>
                    ) : (
                      <View height="1px" width="50%" />
                    )}
                  </View>
                ))
                .filter((item) => !!item)}
          </Carousel>

          <ProductDetailsModal
            showModal={showProductDetailsModal}
            onClose={() => setShowProductDetailsModal(false)}
            product={productClicked}
          />
        </>
      )}

      {/* DOTS */}
      <View
        marginTop="large"
        display="flex"
        gap="10px"
        justifyContent="center"
        alignItems="center"
      >
        {products &&
          Array.from({ length: Math.ceil(products.length / 2) }, (_, index) => (
            <View
              key={index}
              borderRadius="pill"
              backgroundColor={
                currentSlide === index
                  ? _backgroundColorIsActive
                  : _backgroundColorIsNotActive
              }
              width={currentSlide === index ? "14px" : "10px"}
              height={currentSlide === index ? "14px" : "10px"}
              transition="width 300ms ease-in-out, background-color 300ms ease-in-out"
            />
          ))}
      </View>
    </>
  );
}
