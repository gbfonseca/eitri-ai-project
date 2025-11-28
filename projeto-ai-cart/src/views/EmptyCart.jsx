import Eitri from "eitri-bifrost"
import { useTranslation } from "eitri-i18n"
import iconCart from "../assets/images/cart-01-yellow.svg"
import { HeaderContentWrapper, HeaderReturn, HeaderText, CustomButton, Loading } from "projeto-ai-shared"

import { useLocalShoppingCart } from '../providers/LocalCart'
import { getProductsByFacets } from "../services/ProductServices";

import ProductShelf from "../components/ProductShelf/ProductShelf"
import { sendPageView } from "../services/trackingService"

export default function EmptyCart(props) {
  const [openWithBottomBar, setIsOpenWithBottomBar] = useState(false)
  const { cart, startCart } = useLocalShoppingCart()
  const [appIsLoading, setAppIsLoading] = useState(false)
  const [currentProducts, setCurrentProducts] = useState([]);

  useEffect(() => {
    getStartParams()

    Eitri.navigation.setOnResumeListener(() => {
      setAppIsLoading(true)
			startCart()
    })
    
    sendPageView("Carrinho vazio", "EmptyCart")
  }, [])

  useEffect(() => {
		if (cart && cart.items.length > 0) {
			Eitri.navigation.navigate({
				path: 'Home',
        replace: true,
        state: { origin: 'EmptyCart' }
			})
    } else {
      setAppIsLoading(false)
    }

  }, [cart])

  const getStartParams = async () => {
    const params = await Eitri.getInitializationInfos()

    if (!!params.tabIndex) {
      setIsOpenWithBottomBar(true)
    }

    const result = await getProductsByFacets("productClusterIds/153", {
      count: 8,
    });
    setCurrentProducts(result)
  }

  const { t } = useTranslation()

  const closeEitriApp = () => {
    Eitri.navigation.close()
  }

  return (
    <Window bottomInset topInset>
      <HeaderContentWrapper gap={16}>
        {!openWithBottomBar && <HeaderReturn />}
        <HeaderText text={t("home.title")} />
      </HeaderContentWrapper>

      <Loading
        fullScreen
        isLoading={appIsLoading}
      />

      <View
        grow="1"
        direction="column"
        paddingVertical="giant"
        paddingHorizontal="large"
        justifyContent="center"
        alignItems="center"
      >
        <View
          direction="column"
          alignItems="center"
          justifyContent="center"
          gap="20px"
          marginBottom="medium"
        >
          <Image src={iconCart} width={"101px"} />
          <View
            display="flex"
            direction="column"
            justifyContent="start"
            alignSelf="center"
          >
            <Text
              fontWeight="bold"
              color="accent-100"
              fontSize="extra-large"
              textAlign="center"
            >
              {t("emptyCart.txtEmptyCart")}
            </Text>
            <Text
              marginTop="large"
              color="accent-100"
              fontSize="medium"
              textAlign="center"
            >
              {t("emptyCart.txtMessageList")}
            </Text>
          </View>
          {!openWithBottomBar && (
            <CustomButton
              wide
              label={t("emptyCart.labelButton")}
              onPress={closeEitriApp}
              color="accent-100"
              fontWeight="700"
              fontSize="extra-small"
            />
          )}
        </View>

      </View>

      <View
        backgroundColor="primary-100"
        paddingVertical="big"
      >
        <ProductShelf products={currentProducts.products} />
      </View>
    </Window>
  )
}
