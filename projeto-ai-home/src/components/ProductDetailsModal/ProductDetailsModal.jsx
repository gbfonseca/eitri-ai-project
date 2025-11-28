import { useTranslation } from "eitri-i18n";
import { Alert, CustomButton, Loading } from "projeto-ai-shared";
import { App } from "eitri-shopping-vtex-shared";
import { useLocalShoppingCart } from "../../providers/LocalCart";
import {
  addToWishlist,
  productOnWishlist,
  removeItemFromWishlist,
} from "../../services/CustomerService";
import { openProduct } from "../../services/NavigationService";
import { formatPrice } from "../../utils/utils";
import ImagesModal from "../ImagesModal/ImagesModal";
import SkuSelector from "../SkuSelector/SkuSelector";

export default function ProductDetailsModal(props) {
  const { onClose, showModal, product } = props;

  const { addItem, removeItem, updateItemQuantity, cart } =
    useLocalShoppingCart();

  const { t } = useTranslation();

  const [loadingCartOp, setLoadingCartOp] = useState(false);
  const [loadingWishlistOp, setLoadingWishlistOp] = useState(true);

  const [isOnWishlist, setIsOnWishlist] = useState(false);
  const [wishListId, setWishListId] = useState(null);
  const [itemQuantity, setItemQuantity] = useState(1);

  const [currentSku, setCurrentSku] = useState(null);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const item = product?.items?.[0];

  const name = item?.nameComplete || item?.name;
  const sellerDefault =
    item?.sellers?.find((seller) => seller.sellerDefault) || item?.sellers?.[0];

  useEffect(() => {
    checkItemOnWishlist();
    setCurrentSku(product?.items?.[0]);

    const itemIndex = cart?.items?.findIndex(
      (cartItem) => cartItem.id === item?.itemId
    );

    if (itemIndex > -1) {
      setItemQuantity(cart?.items?.[itemIndex].quantity);
    }
  }, [product]);

  useEffect(() => {
    const itemIndex = cart?.items?.findIndex(
      (cartItem) => cartItem.id === currentSku?.itemId
    );

    if (itemIndex > -1) {
      setItemQuantity(cart?.items?.[itemIndex].quantity);
    } else {
      setItemQuantity(1);
    }
  }, [currentSku]);

  // Loaders
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

  // Formatters
  const formatInstallments = (seller) => {
    const installments = seller?.commertialOffer.Installments;

    const maxInstallments = installments?.reduce((acc, curr) => {
      return curr.NumberOfInstallments > acc.NumberOfInstallments ? curr : acc;
    }, installments[0]);

    if (!maxInstallments || maxInstallments?.NumberOfInstallments === 1)
      return "";

    return `em até ${maxInstallments?.NumberOfInstallments}x ${formatPrice(
      maxInstallments?.Value
    )}`;
  };

  const getListPrice = () => {
    if (
      sellerDefault?.commertialOffer.Price ===
      sellerDefault?.commertialOffer.ListPrice
    ) {
      return "";
    } else {
      return formatPrice(sellerDefault?.commertialOffer.ListPrice);
    }
  };

  const getBadge = () => {
    const price = sellerDefault?.commertialOffer?.Price;
    const listPrice = sellerDefault?.commertialOffer?.ListPrice;

    if (price !== listPrice) {
      const discount = ((listPrice - price) / listPrice) * 100;
      return `-${discount.toFixed(0)}%`;
    } else {
      return "";
    }
  };

  const findAvailableQuantitySKU = (sellers) => {
    return sellers.some(
      (seller) => seller?.commertialOffer?.AvailableQuantity > 0
    );
  };

  // Cart
  const addToCart = async () => {
    setLoadingCartOp(true);
    const isAvailableQuantity = findAvailableQuantitySKU(currentSku?.sellers);

    if (!isAvailableQuantity) {
      setShowErrorAlert(true);
      setLoadingCartOp(false);
      return;
    }

    const itemIndex = cart?.items?.findIndex(
      (cartItem) => cartItem.id === currentSku?.itemId
    );

    if (itemIndex > -1) {
      onChangeQuantity(itemQuantity + 1);
    } else {
      const newCart = await addItem({ ...currentSku, quantity: itemQuantity });
    }

    setLoadingCartOp(false);
    // onAddToCartSuccess();
  };

  const removeFromCart = async () => {
    setLoadingCartOp(true);

    const index = cart?.items?.findIndex(
      (cartItem) => cartItem.id === currentSku?.itemId
    );

    await removeItem(index);
    setLoadingCartOp(false);
  };

  const isItemOnCart = () => {
    return cart?.items?.some((cartItem) => cartItem.id === currentSku?.itemId);
  };

  const onChangeQuantity = async (newQuantity) => {
    if (newQuantity === 0) {
      return removeFromCart();
    }

    if (isItemOnCart()) {
      const itemIndex = cart?.items?.findIndex(
        (cartItem) => cartItem.id === currentSku?.itemId
      );
      if (itemIndex > -1) {
        await updateItemQuantity(itemIndex, newQuantity);
        setItemQuantity(newQuantity);
      }
    }
  };

  // Wishlist
  const onAddToWishlist = async () => {
    try {
      if (!product.productId) return;
      setLoadingWishlistOp(true);
      await addToWishlist(product.productId, item?.name, item?.itemId);
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

  const onPressOnCard = () => {
    openProduct(product);
  };

  const onPressOnWishlist = () => {
    if (loadingWishlistOp) return;
    if (isOnWishlist) {
      onRemoveFromWishlist();
    } else {
      onAddToWishlist();
    }
  };

  const onPressCartButton = () => {
    if (App?.configs?.appConfigs?.productCard?.buyGoesToPDP) {
      openProduct(product);
      return;
    }
    if (loadingCartOp) return;

    if (isItemOnCart()) {
      removeFromCart();
    } else {
      addToCart();
    }
  };

  const onSkuChange = (skuId) => {
    const productSku = product?.items.find((item) => item.itemId === skuId);

    if (productSku) {
      setCurrentSku(productSku);
    }
  };

  const listPrice = getListPrice();
  const price = formatPrice(sellerDefault?.commertialOffer.Price);
  const installments = formatInstallments(sellerDefault);
  const isInCart = isItemOnCart();
  const currentName = currentSku?.nameComplete || currentSku?.name

  return (
    <Modal onClose={onClose} show={showModal} position="bottom">
      <View
        direction="column"
        gap={8}
        width="100vw"
        padding="large"
        backgroundColor="neutral-900"
        borderRadiusLeftTop="medium"
        borderRadiusRightTop="medium"
        backgroundColor="primary-100"
      >
        <ImagesModal currentSku={currentSku} />

        {getBadge() && (
          <View
            maxHeight="27px"
            minHeight="20px"
            borderRadius="pill"
            width="fit-content"
            backgroundColor="positive-300"
            paddingHorizontal="large"
            paddingVertical="quark"
          >
            <Text fontWeight="bold" color="accent-100">
              {getBadge()}
            </Text>
          </View>
        )}

        <Text
          color="accent-100"
          fontWeight="bold"
          marginTop="nano"
          marginBottom="quark"
        >
          {currentName}
        </Text>

        <View direction="column" gap={2} marginBottom="nano">
          {listPrice && (
            <Text
              textDecoration="line-through"
              color="accent-100"
              fontSize="nano"
            >
              {listPrice}
            </Text>
          )}

          <Text fontWeight="bold" color="secondary-500" fontSize="medium">
            {price}

            {installments && (
              <Text paddingLeft="quark" color="accent-100" fontSize="nano">
                {installments}
              </Text>
            )}
          </Text>
        </View>

        <SkuSelector
          currentSku={currentSku}
          product={product}
          onSkuChange={onSkuChange}
          marginTop={"large"}
        />

        <Touchable
          marginTop="nano"
          height={40}
          width="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
          borderRadius="small"
          backgroundColor={loadingCartOp ? "neutral-100" : "secondary-500"}
          zIndex={99}
          onPress={onPressCartButton}
        >
          {loadingCartOp ? (
            <Loading width="36px" />
          ) : (
            <Text color="accent-100" fontWeight="bold">
              {!isInCart ? "ADICIONAR AO CARRINHO" : "REMOVER DO CARRINHO"}
            </Text>
          )}
        </Touchable>

        <CustomButton
          label={"VER DETALHES DO PRODUTO"}
          width="100%"
          height={40}
          variant="outlined"
          color="secondary-500"
          onPress={onPressOnCard}
        />
      </View>

      <Alert
        type="negative"
        backgroundColor="accent-300"
        show={showErrorAlert}
        onDismiss={() => setShowErrorAlert(false)}
        duration={7}
        message={t("home.messageErrorToUnavailableSku")}
      />

      <View position="relative" bottomInset />
    </Modal>
  );
}
