import Eitri from 'eitri-bifrost'
import { Vtex } from 'eitri-shopping-vtex-shared'
import { clearCart, getCart } from '../services/cartService'
import { navigate } from '../services/navigationService'

export default function ExternalProviderOrder(props) {
	useEffect(() => {
		if (props.location?.state?.paymentResult) {
			const paymentResult = props.location?.state?.paymentResult

			const paymentAuthorizationApp = paymentResult.paymentAuthorizationAppCollection[0]
			const url = paymentAuthorizationApp.appPayload

			openProvider(url)

			Eitri.navigation.setOnResumeListener(() => checkOrderStatus())
		}
	}, [props.location?.state?.paymentResult])

	const openProvider = async url => {
		Eitri.openBrowser({
			url: url,
			inApp: true
		})
	}

	async function checkOrderStatus(transactionId, paymentId) {
		try {
			const cart = await getCart()

			if (cart?.items?.length > 0) {
				navigate('ExternalProviderOrderFinished', {}, true)
			} else {
				clearCart()
				navigate('OrderCompleted', {
					orderValue: cart.value,
					orderId: props.location?.state?.paymentResult?.orderId
				})
			}
		} catch (error) {
			console.log('Erro ao buscar carrinho', error)
		}
	}

	return <Page></Page>
}
