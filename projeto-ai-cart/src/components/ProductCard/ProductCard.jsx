import { useLocalShoppingCart } from "../../providers/LocalCart";
import { openProduct } from "../../services/NavigationService";
import {
  addToWishlist,
  productOnWishlist,
  removeItemFromWishlist,
} from "../../services/customerService";
import { formatPrice } from "../../utils/utils";
import { App } from "eitri-shopping-vtex-shared";
import {
  ProductCardFullImage,
  ProductCardConvenience,
  ProductCardDefault,
} from "projeto-ai-shared";
import { useTranslation } from "eitri-i18n";

export default function ProductCard(props) {
  /*
   *  Aos poucos modificando esse componente para quebrar ele em mais componentes funcionais
   * */

  const { t } = useTranslation();
  const {
    product,
    width,
    onAddToCartSuccess,
    setShowProductDetailsModal,
    setProductClicked,
  } = props;
  const { addItem, removeItem, updateItemQuantity, cart } =
    useLocalShoppingCart();

  const [loadingCartOp, setLoadingCartOp] = useState(false);
  const [loadingWishlistOp, setLoadingWishlistOp] = useState(true);

  const [isOnWishlist, setIsOnWishlist] = useState(false);
  const [wishListId, setWishListId] = useState(null);

  const [itemQuantity, setItemQuantity] = useState(1);

  const item = product?.items?.[0];
  const sellerDefault =
    item?.sellers?.find((seller) => seller.sellerDefault) || item?.sellers?.[0];

  useEffect(() => {
    checkItemOnWishlist();
    const itemIndex = cart?.items?.findIndex(
      (cartItem) => cartItem.id === item?.itemId
    );
    if (itemIndex > -1) {
      setItemQuantity(cart?.items?.[itemIndex].quantity);
    }
  }, []);

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
      return `${discount.toFixed(0)}% off`;
    } else {
      return "";
    }
  };

  // Cart
  const addToCart = async () => {
    setLoadingCartOp(true);
    const newCart = await addItem({ ...item, quantity: itemQuantity });
    const itemIndex = newCart?.items?.findIndex(
      (cartItem) => cartItem.id === item?.itemId
    );

    if (itemIndex > -1) {
      setItemQuantity(cart?.items?.[itemIndex]?.quantity);
    }

    setLoadingCartOp(false);
    onAddToCartSuccess();
  };

  const removeFromCart = async () => {
    setLoadingCartOp(true);
    const index = cart?.items?.findIndex(
      (cartItem) => cartItem.id === item?.itemId
    );
    await removeItem(index);
    setLoadingCartOp(false);
  };

  const isItemOnCart = () => {
    return cart?.items?.some((cartItem) => cartItem.id === item?.itemId);
  };

  const onChangeQuantity = async (newQuantity) => {
    if (newQuantity === 0) {
      return removeFromCart();
    }
    if (isItemOnCart()) {
      const itemIndex = cart?.items?.findIndex(
        (cartItem) => cartItem.id === item?.itemId
      );
      await updateItemQuantity(itemIndex, newQuantity);
      setItemQuantity(newQuantity);
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

  const hasMultipleVariationValues = () => {
    if (!product?.items) return false;

    const variationsMap = {};

    product.items.forEach((item) => {
      item.variations?.forEach((_variation) => {
        const variationName =
          typeof _variation === "string" ? _variation : _variation.name;
        const valuesArray = Array.isArray(item[variationName])
          ? item[variationName]
          : [];

        valuesArray.forEach((v) => {
          if (v && v.trim().toUpperCase() !== "N/A") {
            if (!variationsMap[variationName])
              variationsMap[variationName] = new Set();
            variationsMap[variationName].add(v);
          }
        });
      });
    });

    return Object.values(variationsMap).some((set) => set.size > 1);
  };

  // Navigation
  const onPressOnCard = () => {
    openProduct(product);
    // setProductClicked(product);
    // setShowProductDetailsModal(true);
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

    const hasMultiple = hasMultipleVariationValues();

    if (hasMultiple) {
      setProductClicked(product);
      setShowProductDetailsModal(true);
    } else {
      if (isItemOnCart()) {
        removeFromCart();
      } else {
        addToCart();
      }
    }
  };

  let productVideo = "";
  if (App?.configs?.appConfigs?.productCard?.productVideoTag) {
    const productVideoTag =
      App?.configs?.appConfigs?.productCard?.productVideoTag;
    const property = product?.properties?.find(
      (prop) => prop.name === productVideoTag
    );
    if (property) {
      productVideo = property.values?.[0];
    }
  }

  const params = {
    name: item?.nameComplete || item?.name,
    image: item?.images?.[0]?.imageUrl,
    video: productVideo,
    badge: getBadge(),
    listPrice: getListPrice(),
    showListItem: App?.configs?.appConfigs?.productCard?.showListPrice ?? true,
    price: formatPrice(sellerDefault?.commertialOffer.Price),
    installments: formatInstallments(sellerDefault),
    isInCart: isItemOnCart(),
    isOnWishlist: isOnWishlist,
    loadingWishlistOp: loadingWishlistOp,
    loadingCartOp: loadingCartOp,
    width: width,
    itemQuantity: itemQuantity,
    onPressOnCard: onPressOnCard,
    onPressCartButton: onPressCartButton,
    onPressOnWishlist: onPressOnWishlist,
    onChangeQuantity: onChangeQuantity,
    t: t,
  };

  const implementations = {
    fullImage: ProductCardFullImage,
    default: ProductCardDefault,
    convenience: ProductCardConvenience,
  };

  const rcProductCardStyle = App?.configs?.appConfigs?.productCard?.style;

  const Implementation =
    rcProductCardStyle && implementations[rcProductCardStyle]
      ? implementations[rcProductCardStyle]
      : ProductCardDefault;

  /*prettier-ignore*/
  return React.createElement(Implementation, params)
}
