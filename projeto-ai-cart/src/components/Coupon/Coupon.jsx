import Eitri from "eitri-bifrost";
import {
  Spacing,
  Loading,
  CustomInput,
  CustomButton,
} from "projeto-ai-shared";
import { useTranslation } from "eitri-i18n";
import { useLocalShoppingCart } from "../../providers/LocalCart";
import IconCoupon from "../../assets/images/new-tag-coupon-icon-white.svg";

export default function Coupon(props) {
  const { cart, applyCouponToCart, removeCouponToCart } =
    useLocalShoppingCart();

  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [invalidCoupon, setInvalidCoupon] = useState(false);
  const [couponTextAlert, setCouponTextAlert] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { t } = useTranslation();

  useEffect(() => {
    if (cart?.marketingData?.coupon) {
      setInvalidCoupon(false);
      setAppliedCoupon(cart.marketingData.coupon);

      if (coupon === cart?.marketingData?.coupon) {
        setCouponTextAlert(t("coupon.txtAppliedCoupon"));
      }
    } else {
      const errorMessage = cart?.messages || [];
      const couponError =
        coupon && errorMessage.find((message) => message.text.includes(coupon));

      if (couponError) {
        if (couponError.code === "couponNotFound") {
          setCouponTextAlert(t("coupon.txtInvalidCoupon"));
        } else if (couponError.code === "couponExpired") {
          setCouponTextAlert(t("coupon.txtExpiredCoupon"));
        }
        setInvalidCoupon(true);
      } else {
        setInvalidCoupon(false);
        setAppliedCoupon("");
      }
    }
  }, [cart]);

  const inputOnChange = (value) => {
    setCoupon(value.toUpperCase());
  };

  const onPressAddCoupon = () => {
    setIsLoading(true);
    applyCouponToCart(coupon);
    setIsLoading(false);
  };

  const onPressRemoveCoupon = () => {
    setCoupon("");
    setCouponTextAlert("");
    removeCouponToCart();
  };

  if (!cart) return null;

  return (
    <View direction="column" padding="medium" backgroundColor="primary-100">
      <View display="flex">
        <Image src={IconCoupon} />
        <Text
          color="accent-100"
          fontSize="medium"
          fontWeight="bold"
          marginLeft="small"
        >
          {t("coupon.txtCoupon")}
        </Text>
      </View>
      <View
        marginTop="extra-small"
        display="flex"
        gap={8}
        justifyContent="between"
        alignItems="center"
      >
        {appliedCoupon ? (
          <>
            <View
              display="flex"
              marginVertical="small"
              paddingVertical="medium"
              paddingHorizontal="small"
              borderWidth="hairline"
              borderColor="neutral-300"
              borderRadius="small"
              width="90%"
            >
              <Text>{appliedCoupon}</Text>
            </View>
            <Touchable onPress={onPressRemoveCoupon}>
              <View paddingHorizontal="medium">
                <Icon iconKey="trash-2" color={"accent-100"} width={24} />
              </View>
            </Touchable>
          </>
        ) : (
          <>
            <CustomInput
              width="60%"
              color="secondary-500"
              placeholder={t("coupon.labelInsertCode")}
              value={coupon}
              onChange={(value) => inputOnChange(value)}
              onFocus={() => window.scroll(0, 0)}
            />
            <CustomButton
              color="accent-100"
              backgroundColor="secondary-500"
              onPress={onPressAddCoupon}
              isLoading={isLoading}
              label={"ADICIONAR"}
              width="40%"
            />
          </>
        )}
      </View>
      {couponTextAlert && (
        <View paddingHorizontal="medium">
          <Text color={invalidCoupon ? "tertiary-500" : "secondary-500"}>
            {couponTextAlert}
          </Text>
        </View>
      )}
    </View>
  );
}
