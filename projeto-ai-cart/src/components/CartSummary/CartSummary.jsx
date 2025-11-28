import { CustomButton, Spacing, Divisor } from "projeto-ai-shared"
import { useTranslation } from "eitri-i18n"
import { formatAmountInCents } from "../../utils/utils"
import { useLocalShoppingCart } from "../../providers/LocalCart"
import { navigateToCheckout } from "../../services/navigationService"
import ProductShelf from "../ProductShelf/ProductShelf"

export default function CartSummary(props) {
  const { productShelf } = props
  const { cart } = useLocalShoppingCart()

  const [itemsValue, setItemsValue] = useState({ value: null })
  const [shipping, setShipping] = useState({ value: null })
  const [discounts, setDiscounts] = useState({ value: null })

  const { t } = useTranslation()

  useEffect(() => {
    if (!cart) return
    setItemsValue(getTotalizerById(cart.totalizers, "Items"))
    setShipping(getTotalizerById(cart.totalizers, "Shipping"))
    setDiscounts(getTotalizerById(cart.totalizers, "Discounts"))
  }, [cart])

  const getTotalizerById = (totalizers, id) =>
    totalizers.find((item) => item.id === id)

  const goToCheckout = async () => {
    if (isValidToProceed(cart)) {
      navigateToCheckout(cart?.orderFormId)
    }
  }

  const isValidToProceed = (cart) => {
    if (!cart) return false
    if (!cart?.items) return false
    if (cart?.shipping?.shippingUnavailable) return false
    return cart?.items.length !== 0
  }

  return (
    <View direction="column" gap="16px">
      <View
        display="flex"
        direction="column"
        backgroundColor="primary-100"
        padding="small"
      >
        {itemsValue?.value && (
          <View
            display="flex"
            justifyContent="between"
            paddingTop="nano"
            borderColor="primary-300"
            borderBottomWidth="hairline"
            paddingBottom="nano"
          >
            <Text color="accent-100" fontSize="small">
              SUBTOTAL
            </Text>
            <Text color="secondary-500" fontWeight="bold" fontSize="medium">
              {formatAmountInCents(itemsValue.value)}
            </Text>
          </View>
        )}
        {discounts?.value && (
          <View
            display="flex"
            justifyContent="between"
            paddingTop="nano"
            borderColor="primary-300"
            borderBottomWidth="hairline"
            paddingBottom="nano"
          >
            <Text color="accent-100" fontSize="small">
              {t("cartSummary.txtDiscount")}
            </Text>
            <Text color="secondary-500" fontWeight="bold" fontSize="medium">
              {formatAmountInCents(discounts.value)}
            </Text>
          </View>
        )}
        {shipping && (
          <View
            display="flex"
            justifyContent="between"
            paddingTop="nano"
            borderColor="primary-300"
            borderBottomWidth="hairline"
            paddingBottom="nano"
          >
            <Text color="accent-100" fontSize="small">
              ENTREGA
            </Text>
            <Text color="secondary-500" fontWeight="bold" fontSize="medium">
              {formatAmountInCents(shipping.value)}
            </Text>
          </View>
        )}
        {cart?.value && (
          <View display="flex" justifyContent="between" paddingTop="nano">
            <Text
              color="accent-100"
              //fontWeight='bold'
              fontSize="medium"
            >
              TOTAL
            </Text>
            <Text fontSize="medium" fontWeight="bold" color="secondary-500">
              {formatAmountInCents(cart.value)}
            </Text>
          </View>
        )}
      </View>

      <View backgroundColor="primary-100">
        <ProductShelf products={productShelf} />
      </View>

      <Spacing height={"75px"} />

      <View
        position="fixed"
        bottom={0}
        backgroundColor="primary-100"
        width="100vw"
        padding="large"
        borderTopWidth="hairline"
      >
        <CustomButton
          color="accent-100"
          backgroundColor="secondary-500"
          borderRadius="small"
          label={"FINALIZAR PEDIDO"}
          onPress={goToCheckout}
        />
        <View bottomInset />
      </View>
    </View>
  )
}
