import Eitri from "eitri-bifrost"
import { sendPageView, logEvent, trackingViewCart } from "../services/trackingService"
import { useLocalShoppingCart } from "../providers/LocalCart"
import {
  HeaderContentWrapper,
  HeaderReturn,
  HeaderText,
  Loading,
  Spacing,
} from "projeto-ai-shared"
import { saveCartIdOnStorage } from "../services/cartService"
import { useTranslation } from "eitri-i18n"
import Freight from "../components/Freight/Freight"
import Coupon from "../components/Coupon/Coupon"
import CartSummary from "../components/CartSummary/CartSummary"
import CartItemsContent from "../components/CartItemsContent/CartItemsContent"
import { setLanguage, startConfigure } from "../services/AppService"
import IconCart from "../assets/images/new-cart-icon-white.svg"
import { getProductsByFacets } from "../services/ProductServices";

let canSendTracking = false
export default function Home(props) {
  const { t, i18n } = useTranslation()
  const { cart, startCart } = useLocalShoppingCart()
  
  const [openWithBottomBar, setIsOpenWithBottomBar] = useState(false)
  const [appIsLoading, setAppIsLoading] = useState(true)
  const [currentProducts, setCurrentProducts] = useState([]);

  useEffect(() => {
    startHome()

    Eitri.navigation.setOnResumeListener(() => {
      startCart()

      // App aberto pelo clique na BottomBar
      sendPageView("Carrinho", "cart.Home")
      canSendTracking = true
    })
  }, [])

  useEffect(() => {
    if (cart && cart.items.length === 0) {
      Eitri.navigation.navigate({
        path: "EmptyCart",
        replace: true,
      })
    } else if (cart && canSendTracking) {
      canSendTracking = false
      trackingViewCart(cart)
    }
  }, [cart])

  const startHome = async () => {
    const params = await Eitri.getInitializationInfos()

    if (!!params?.tabIndex) {
      setIsOpenWithBottomBar(true)

      // App aberto na bottomBar, e chegou no carrinho vindo de outra tela ou app (ex: fluxo de carrinho vazio)
      if (props?.location?.state?.origin) {
        sendPageView("Carrinho", "cart.Home")
        canSendTracking = true
      }
      
    } else {
      // App aberto por outro fluxo (ex: clique no icone do carrinho)
      sendPageView("Carrinho", "cart.Home")
      canSendTracking = true
    }

    await startConfigure()
    await loadCart()
    setLanguage(i18n)
    setAppIsLoading(false)
    sendPageView("Home")

    const result = await getProductsByFacets("productClusterIds/153", {
      count: 8,
    });
    setCurrentProducts(result)
  }

  const loadCart = async () => {
    const startParams = await Eitri.getInitializationInfos()
    if (startParams?.orderFormId) {
      await saveCartIdOnStorage(startParams?.orderFormId)
    }

    return startCart()
  }

  return (
    <Window bottomInset topInset>
      <Loading fullScreen isLoading={appIsLoading} />

      <HeaderContentWrapper gap={16}>
        {!openWithBottomBar && <HeaderReturn />}
        <View display="flex" alignItems="center">
          <Image src={IconCart} marginRight="extra-small" />
          <HeaderText text={"CARRINHO"} />
        </View>
      </HeaderContentWrapper>

      {/* <InstallmentsMsg /> */}

      <View direction="column" gap={16}>
        <CartItemsContent />
        <View direction="column">
          <Freight />
          <Coupon />
        </View>
        <CartSummary productShelf={currentProducts.products} />
      </View>
    </Window>
  )
}
