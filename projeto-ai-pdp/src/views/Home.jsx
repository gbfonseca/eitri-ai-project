import Eitri from "eitri-bifrost";
import {
  Loading,
  HeaderShare,
  HeaderContentWrapper,
  HeaderReturn,
  HeaderCart,
  Spacing,
  AddedToCartModal,
} from "projeto-ai-shared";
import { Icon, Touchable, View } from "eitri-luminus";
import { Vtex } from "eitri-shopping-vtex-shared";
import { useTranslation } from "eitri-i18n";

import ActionButton from "../components/ActionButton/ActionButton";
import BottomFixed from "../components/BottomFixed/BottomFixed";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import DescriptionComponent from "../components/Description/DescriptionComponent";
import Freight from "../components/Freight/Freight";
import HeaderSearchButton from "../components/HeaderSearchButton/HeaderSearchButton";
import ImageCarousel from "../components/ImageCarousel/ImageCarousel";
import MainDescription from "../components/MainDescription/MainDescription";
import RelatedProducts from "../components/RelatedProducts/RelatedProducts";
import Reviews from "../components/Reviews/Reviews";
import RichContent from "../components/RichContent/RichContent";
import {
  addToWishlist,
  productOnWishlist,
  removeItemFromWishlist,
} from "../services/customerService";
import {
  crash,
  crashLog,
  sendPageView,
  sendViewItem,
} from "../services/trackingService";
import {
  getProductById,
  markLastViewedProduct,
} from "../services/productService";
import { getRatings } from "../services/ratings";
import { openCart } from "../services/NavigationService";
import { setLanguage, startConfigure } from "../services/AppService";
import { useLocalShoppingCart } from "../providers/LocalCart";

export default function Home() {
  const { startCart, addItem, cart } = useLocalShoppingCart();
  const { i18n } = useTranslation();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [configLoaded, setConfigLoaded] = useState(false);
  const [loadingWishlistOp, setLoadingWishlistOp] = useState(true);
  const [isOnWishlist, setIsOnWishlist] = useState(false);
  const [wishListId, setWishListId] = useState(null);
  const [currentSku, setCurrentSku] = useState(null);
  const [showAddedToCartModal, setShowAddedToCartModal] = useState(false);
  const [ratingsData, setRatingsData] = useState(null);
  const [titleBackButton, setTitleBackButton] = useState("");

  useEffect(() => {
    window.scroll(0, 0);
    startHome();
    checkItemOnWishlist();
    Eitri.navigation.setOnResumeListener(() => {
      startHome();
    });

  }, []);

  const startHome = async () => {
    setIsLoading(true);

    const startParams = await Eitri.getInitializationInfos();

    let product = startParams?.product;

    if (product) {
      setProduct(product);
      setCurrentSku(product.items[0]);
      setIsLoading(false);
      const ratings = await getRatings(product?.productId);
      setRatingsData(ratings);
    }

    await loadConfigs();
    setLanguage(i18n);

    const _product = await loadProduct(startParams);
    if (_product) {
      setProduct(_product);
      setCurrentSku(_product.items[0]);
      setIsLoading(false);
      const ratings = await getRatings(_product?.productId);
      setRatingsData(ratings);
    }
    loadTitleBackButton(_product?.categories || product?.categories);
    setConfigLoaded(true);

    await loadCart(startParams);

    try {
      sendPageView("PDP", "pdp.Home");
      sendViewItem(_product || product);
      markLastViewedProduct(_product || product);
    } catch (e) {
      console.error("Erro ao enviar item visto", e);
    }
  };

  const loadTitleBackButton = (categories) => {
    if (categories && categories.length > 0) {
      const paths = categories[0].split("/").filter((path) => path !== "" && path !== "/");
      if (paths.length > 0) {
        setTitleBackButton(paths[paths.length - 1]);
      }
    }
  };

  const loadProduct = async (startParams) => {
    try {
      if (startParams?.productId) {
        const product = await getProductById(startParams.productId);
        setProduct(product);
        const ratings = await getRatings(startParams?.productId);
        setRatingsData(ratings);
        return product;
      }
    } catch (e) {
      console.error("loadProduct: Error", e);
      return null;
    }
  };

  const loadCart = async (startParams) => {
    if (startParams?.orderFormId) {
      await Eitri.sharedStorage.setItem(
        "vtex_cart_key",
        startParams?.orderFormId
      );
    }
    await startCart();
  };

  const loadConfigs = async () => {
    try {
      await startConfigure();
    } catch (e) {
      crashLog("Erro ao buscar configurações", e);
      crash();
    }
  };

  const onSkuChange = (skuId) => {
    const productSku = product.items.find((item) => item.itemId === skuId);
    if (productSku) {
      setCurrentSku(productSku);
    }
  };

  const handleActionPress = async (quantity) => {
    if (!currentSku) return;

    const seller = currentSku.sellers?.[0];
    const isInStock = seller?.commertialOffer?.AvailableQuantity > 0;

    if (!isInStock) return;


    await addItem({ ...currentSku, quantity });

    setShowAddedToCartModal(true);
  };

  const handleOpenCart = () => {
    openCart();
    setShowAddedToCartModal(false);
  };

  const handleKeepShopping = () => {
    Eitri.navigation.close();
  };

  const checkItemOnWishlist = async () => {
    try {
      const { inList, listId } = await productOnWishlist(product.productId);
      if (inList) {
        setIsOnWishlist(true);
        setWishListId(listId);
      }
      setLoadingWishlistOp(false);
    } catch (e) {
      setLoadingWishlistOp(false);
    }
  };

  const onAddToWishlist = async () => {
    try {
      if (!product.productId) return;
      setLoadingWishlistOp(true);
      await addToWishlist(product, currentSku?.name, currentSku?.itemId);
      setIsOnWishlist(true);
      setLoadingWishlistOp(false);
    } catch (error) {
      setLoadingWishlistOp(false);
    }
  };

  const onRemoveFromWishlist = async () => {
    setLoadingWishlistOp(true);
    await removeItemFromWishlist(wishListId);
    setLoadingWishlistOp(false);
    setIsOnWishlist(false);
  };

  // console.log("product", product);



  return (
    <Window title="[pdp] - Home" bottomInset>
      <View paddingTop="jumbo">
        <HeaderContentWrapper gap={16}>
          <View
            justifyContent="between"
            width={"100%"}
            display="flex"
            flexDirection="row"
            alignItems="center"
          >
            <View
              justifyContent="start"
              display="flex"
              flexDirection="row"
              alignItems="center"
              gap={22}
            >
              <HeaderReturn iconColor="secondary-500" />
              <View
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
              >
                <Text
                  maxWidth={"200px"}
                  fontSize="display"
                  textAlign="start"
                  fontWeight="bold"
                  whiteSpace="nowrap"
                  overflow="hidden"
                  textOverflow="ellipsis"
                >
                  {titleBackButton || ""}
                </Text>
              </View>
            </View>
            <View display="flex" justifyContent="end" alignItems="center" gap={16}>
              <HeaderSearchButton iconColor="accent-100" />
              <HeaderCart cart={cart} onPress={() => openCart()} />
            </View>
          </View>
        </HeaderContentWrapper>

        <Loading isLoading={isLoading} fullScreen />

        {product && (
          <View>
            <View marginHorizontal="medium" marginBottom="medium">
              <Breadcrumb currentPath={product?.productName} allPath={product?.categories[0]} />
            </View>
            <View marginHorizontal="medium" marginBottom="medium">
              <ImageCarousel currentSku={currentSku} />
            </View>

            <View
              backgroundColor="primary-100"
              borderRadius="small"
              padding="large"
              marginHorizontal="medium"
            >
              <MainDescription
                product={product}
                currentSku={currentSku}
                onSkuChange={onSkuChange}
                loadingWishlistOp={loadingWishlistOp}
                isOnWishlist={isOnWishlist}
                onAddToWishlist={onAddToWishlist}
                onRemoveFromWishlist={onRemoveFromWishlist}
                ratingsData={ratingsData}
              // reviewAverage={average}
              // reviewCount={count}
              />
              <Spacing height="24px" />
              <Freight currentSku={currentSku} />
            </View>

            <RichContent product={product} />



            <DescriptionComponent
              marginTop="small"
              product={product}
              currentSku={currentSku}
            />

            <Reviews />

            <View marginTop="medium">
              {configLoaded && <RelatedProducts product={product} />}
            </View>

            <Spacing height="78px" />

            <BottomFixed>
              <ActionButton
                currentSku={currentSku}
                onPress={handleActionPress}
              />
            </BottomFixed>
          </View>
        )}
      </View>

      <AddedToCartModal
        showModal={showAddedToCartModal}
        onClose={() => setShowAddedToCartModal(false)}
        onPressOpenCart={handleOpenCart}
        onPressKeepShopping={handleKeepShopping}
      />
    </Window>
  );
}
