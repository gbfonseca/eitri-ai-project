import Eitri from 'eitri-bifrost'
import { Vtex } from 'eitri-shopping-vtex-shared'
import { Loading, HeaderText, HeaderContentWrapper, HeaderReturn, CustomButton } from 'projeto-ai-shared'
import formatDate, { formatDateDaysMonthYear } from '../utils/Date'
import OrderListDetails from '../components/OrderList/OrderListDetails'
import NoItem from '../components/NoItem/NoItem'
import { sendPageView } from '../services/TrackingService'
import { useTranslation } from 'eitri-i18n'

export default function OrderList(props) {
	const { t } = useTranslation()
	const [orders, setOrders] = useState([])

	const [loading, setLoading] = useState(true)

	const [isLoading, setIsLoading] = useState(false)

	const [productItems, setProductItems] = useState([])
	const [scrollEnded, setScrollEnded] = useState(false)

	const [page, setPage] = useState(1)
	const [maxPages, setMaxPages] = useState(2)

	const numberItemsLoadedOnEnter = 3

	useEffect(() => {
		handleOrders()
		sendPageView('Pedidos', 'OrderList')
	}, [])

	useEffect(() => {
		const handleScroll = () => {
			if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
				setScrollEnded(true)
			}
		}
		window.addEventListener('scroll', handleScroll)
		return () => {
			window.removeEventListener('scroll', handleScroll)
		}
	}, [])

	useEffect(() => {
		if (scrollEnded) {
			handleMoreOrders()
		}
	}, [scrollEnded])

	const formatAmountInCents = amount => {
		if (typeof amount !== 'number') {
			return ''
		}
		if (amount === 0) {
			return 'Grátis'
		}
		return (amount / 100).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
	}

	const handleMoreOrders = async () => {
		if (maxPages >= page) {
			if (isLoading) return
			setIsLoading(true)
			const willLoadPage = page + 1
			try {
				const moreOrders = await Vtex.customer.listOrders(willLoadPage)
				const moreOrdersList = moreOrders?.list
        if (moreOrdersList && moreOrdersList.length > 0) {
          setOrders(prevOrders => [...prevOrders, ...moreOrdersList])
          setPage(willLoadPage)
        }
			} catch (error) {
				console.error('erro ao buscar novas ordens  ->', error)
			}
			setScrollEnded(false)
			setIsLoading(false)
		}
	}

	const handleOrders = async () => {
		try {
			const orders = await Vtex.customer.listOrders()
			setMaxPages(orders.paging.pages)
			const firstIds = orders.list.slice(0, numberItemsLoadedOnEnter)
			const productItems = await Promise.all(
				firstIds.map(async orderItem => {
					const orderProducts = await Vtex.customer.getOrderById(orderItem.orderId)
					return orderProducts
				})
			)
			setProductItems(productItems)
			setOrders(orders.list)
			setLoading(false)
		} catch (error) {
			console.log('erro ao buscar orders', error)
		}
	}

	return (
		<ProtectedView afterLoginRedirectTo={'OrderList'}>
			<Window bottomInset topInset>
				<HeaderContentWrapper gap={16} borderBottomWidth='hairline'
					borderColor="primary-300">
					<HeaderReturn iconColor="secondary-500" />
					<HeaderText text={'MEUS PEDIDOS'} />
				</HeaderContentWrapper>

				<View padding='small'>
					{loading ? (
						<Loading fullScreen />
					) : (
						<>
							{orders && orders.length >= 1 ? (
								orders.map((item, key) => (
									<View
										marginBottom='medium'
										backgroundColor='primary-100'
										borderRadius='small'
										key={item.orderId}
									>
										<View
											padding='medium'
										>
											<OrderListDetails
												creationDate={formatDateDaysMonthYear(item.creationDate)}
												order={item.orderId}
												totalItems={item.totalItems}
												totalValue={formatAmountInCents(item.totalValue)}
												statusId={item.status}
												statusDescription={item.statusDescription}
												imageUrl={productItems[key]?.items[0]?.imageUrl}
											/>
											<CustomButton
												width='100%'
												variant='outlined'
												color='secondary-500'
												label={t('orderList.seeDetails')}
												onPress={() =>
													Eitri.navigation.navigate({
														path: '/OrderDetails',
														state: { orderId: item.orderId }
													})
												}
											/>
										</View>
									</View>
								))
							) : (
								<NoItem
									title='Você não possui nenhum pedido'
									subtitle='Quando você fizer uma compra, ela será listada aqui.'
								/>
							)}
						</>
					)}
					{isLoading && <Loading inline={true} />}
				</View>
			</Window>
		</ProtectedView>
	)
}