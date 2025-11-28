import { getOrders, isLoggedIn } from '../../services/CustomerService'
import Eitri from 'eitri-bifrost'

export default function MyOrders() {
	const [isLogged, setIsLogged] = useState(false)
	const [order, setOrder] = useState(null)

	useEffect(() => {
		init()
	}, [])

	useEffect(() => {
		if (isLogged) {
			loadOrders()
		}
	}, [isLogged])

	const init = async () => {
		isLoggedIn().then(logged => {
			setIsLogged(true)
		})
	}

	const loadOrders = async () => {
		try {
			const orders = await getOrders()
			setOrder(orders?.list?.[0])
		} catch (e) {
			console.error('loadOrders: Error', e)
		}
	}

	const openAccount = () => {
		Eitri.nativeNavigation.open({
			slug: 'eitri-shop-blackskull-account'
		})
	}

	if (!isLogged || !order) {
		return null
	}

	return (
		<View padding='large'>
			<Touchable
				onPress={openAccount}
				padding='large'
				elevation='low'
				direction='column'
				gap={8}
				borderRadius='small'>
				<Text
					block
					fontWeight='bold'
					fontSize='large'>
					{`Pedido ${order?.orderId}`}
				</Text>
				<Text
					block
					fontSize='small'>
					{`Status do pedido: ${order?.statusDescription}`}
				</Text>
			</Touchable>
		</View>
	)
}
