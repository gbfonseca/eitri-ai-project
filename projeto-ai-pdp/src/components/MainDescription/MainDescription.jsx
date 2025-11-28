import { Spacing } from "projeto-ai-shared";
import { formatAmount } from "../../utils/utils";
import { useTranslation } from "eitri-i18n";
import SkuSelector from "../SkuSelector/SkuSelector";
import Rating from "../Rating/Rating";
import WishlistIcon from "../WishlistIcon/WishlistIcon";

export default function MainDescription(props) {
  const {
    product,
    currentSku,
    locale,
    currency,
    onSkuChange,
    reviews,
    fetchAndSetReviews,
    loadingWishlistOp,
    isOnWishlist,
    onAddToWishlist,
    onRemoveFromWishlist,
    ratingsData,
  } = props;

  const [showMore, setShowMore] = useState(false);

  const { t } = useTranslation();

  const discoverInstallments = (item) => {
    try {
      const mainSeller = item.sellers.find((seller) => seller.sellerDefault);
      if (mainSeller) {
        const betterInstallment =
          mainSeller.commertialOffer.Installments.reduce((acc, installment) => {
            if (!acc) {
              acc = installment;
              return acc;
            } else {
              if (installment.NumberOfInstallments > acc.NumberOfInstallments) {
                acc = installment;
              }
              return acc;
            }
          }, null);

        return `${t("mainDescription.txtUntil")} ${betterInstallment.NumberOfInstallments
          }x ${formatAmount(
            betterInstallment.Value,
            locale,
            currency
          )} ${t("mainDescription.interestFree")}`;
      }
      return "";
    } catch (error) {
      return "";
    }
  };

  const onPressWishlist = () => {
    if (loadingWishlistOp) return;
    if (isOnWishlist) {
      if (onRemoveFromWishlist && typeof onRemoveFromWishlist === "function") {
        onRemoveFromWishlist();
      } else {
        console.log("onRemoveFromWishlist not implemented");
      }
    } else if (onAddToWishlist && typeof onAddToWishlist === "function") {
      onAddToWishlist();
    } else {
      console.log("onAddToWishlist not implemented");
    }
  };

  function removeTags(description) {
    const regex = /<(strong|h2)>(.*?)<\/\1>/g;

    let descriptionTitle = [];
    let match = "";

    while ((match = regex.exec(description)) !== null) {
      descriptionTitle.push(match[2]);
    }

    const modifiedDescription = description.replace(regex, "");

    return {
      descriptionTitle,
      modifiedDescription,
    };
  }

  const result = removeTags(product?.description);
  const toggleShowMore = () => {
    setShowMore(!showMore);
  };
  const isLongDescription = product.description?.length > 100;

  return (
    <View display="flex" direction="column">
      <Spacing height="10px" />
      <Text color="accent-100" fontSize="big" fontWeight="bold">
        {currentSku?.name}
      </Text>
      <View marginTop="small" display="flex" justifyContent="between">
        <Rating
          ratingValue={ratingsData?.average?.toFixed(1)}
          ratingsCount={ratingsData?.totalCount}
        />
        <Touchable disabled={loadingWishlistOp} onPress={onPressWishlist}>
          <WishlistIcon checked={isOnWishlist} />
        </Touchable>
      </View>
      {/* // TODO: Comunicar que não consegui colocar o Ver mais na mesma linha da descrição */}
      <View marginTop="small">
        <Text display="flex" fontSize="small">
          {showMore || !isLongDescription
            ? result?.modifiedDescription
            : `${result?.modifiedDescription.substring(0, 160)}...`}
          {isLongDescription && (
            <Touchable onPress={toggleShowMore}>
              <Text
                color="secondary-500"
                textDecoration="underline"
                fontWeight="bold"
                marginTop="nano"
              >
                {showMore ? "Ver menos" : "Ver mais"}
              </Text>
            </Touchable>
          )}
        </Text>
      </View>


      {/* {product?.productReference && (
        <>
          <Spacing height="8px" />
          <Text color="neutral-500" fontSize="medium">
            {" "}
            {`ref ${product?.productReference}`}
          </Text>
        </>
      )} */}

      <SkuSelector
        currentSku={currentSku}
        product={product}
        onSkuChange={onSkuChange}
        marginTop={"large"}
      />

      <Spacing height="24px" />

      {currentSku?.sellers[0]?.commertialOffer?.Price <
        currentSku?.sellers[0]?.commertialOffer?.ListPrice && (
          <View display="flex" alignItems="center" gap="4px">
            <Text
              fontSize="medium"
              color="neutral-500"
              textDecoration="line-through"
              gap="4px"
            >
              {`De ${formatAmount(
                currentSku?.sellers[0]?.commertialOffer?.ListPrice,
                locale,
                currency
              )}`}

            </Text>
          </View>
        )}
      <View display="flex" alignItems="center" gap="4px">
        {currentSku?.sellers[0]?.commertialOffer?.Price < currentSku?.sellers[0]?.commertialOffer?.ListPrice && (
          <Text fontSize="extra-large">
            Por
          </Text>
        )}
        <Text fontSize="big" color="accent-100" fontWeight="bold">
          {" "}
          {formatAmount(
            currentSku?.sellers[0]?.commertialOffer?.Price,
            locale,
            currency
          )}
        </Text>
      </View>

      <Spacing height="4px" />
      <Text fontSize="small" color="neutral-500">
        {" "}
        {discoverInstallments(currentSku)}
      </Text>
    </View>
  );
}
