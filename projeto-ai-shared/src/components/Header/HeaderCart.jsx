import { TOKENS_DEFAULT } from "../../utils/constants"
import { getRemoteAppConfigProperty } from "../../utils/getRemoteConfigStyleProperty"
import cartIcon from "../../assets/icons/cart-01.svg"

export default function HeaderCart(props) {
  const {
    quantityOfItems,
    backgroundColor,
    textColor,
    iconColor,
    onPress,
    width,
    cart,
  } = props

  const [_iconColor, setIconColor] = useState(
    iconColor || TOKENS_DEFAULT.HEADER_CONTENT_COLOR
  )
  const [_textColor, setTextColor] = useState(
    textColor || TOKENS_DEFAULT.HEADER_BACKGROUND_COLOR
  )
  const [_quantityOfItems, setQuantityOfItems] = useState(quantityOfItems ?? 0)

  useEffect(() => {
    loadColor()
  }, [])

  useEffect(() => {
    if (cart) {
      const itemsQuantity = cart.items.reduce(
        (acc, item) => acc + item.quantity,
        0
      )
      setQuantityOfItems(itemsQuantity)
    }
  }, [cart])

  const loadColor = async () => {
    const headerContentColor = await getRemoteAppConfigProperty(
      "headerContentColor"
    )
    const headerBackgroundColor = await getRemoteAppConfigProperty(
      "headerBackgroundColor"
    )
    if (headerContentColor) {
      setIconColor(headerContentColor)
    }
    if (headerBackgroundColor) {
      setTextColor(headerBackgroundColor)
    }
  }

  const handlePress = () => {
    if (onPress) {
      onPress()
      return
    }
  }

  return (
    <Touchable
      position="relative"
      onPress={handlePress}
      width={width}
      backgroundColor={backgroundColor}
    >
      <View>
        {/* <Icon
                    width={24}
                    height={24}
                    color={_iconColor}
                    iconKey='shopping-cart'
                /> */}
        <Image width={24} height={24} src={cartIcon} />
      </View>

      {_quantityOfItems > 0 && (
        <View
          position="absolute"
          top={-10}
          right={-10}
          display="flex"
          backgroundColor={"secondary-500"}
          borderRadius="circular"
          width={20}
          height={20}
          justifyContent="center"
          alignItems="center"
        >
          <Text color={_textColor} fontWeight="bold" fontSize="quark">
            {_quantityOfItems}
          </Text>
        </View>
      )}
    </Touchable>
  )
}
