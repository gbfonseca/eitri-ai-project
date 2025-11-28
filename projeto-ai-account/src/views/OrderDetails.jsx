import Eitri from 'eitri-bifrost'
import React, { useState, useEffect } from 'react'
import { Vtex } from 'eitri-shopping-vtex-shared'
import {
	HeaderContentWrapper,
	HeaderReturn,
	HeaderText,
	Loading
} from 'projeto-ai-shared'
import formatDate, { formatDateDaysMonthYear } from '../utils/Date'
import OrderProductCard from '../components/OrderList/OrderProductCard'
import ProtectedView from '../components/ProtectedView/ProtectedView'
import { sendPageView } from '../services/TrackingService'
import OrderTimeline from '../components/OrderList/OrderTimeline'
import OrderDeliveryStatus from '../components/OrderList/OrderDeliveryStatus'
import creditCard from '../assets/icons/credit-card.svg'
import masterCardIcon from '../assets/icons/master-card-icon.svg'
import PaymentDetails from '../components/PaymentDetails/PaymentDetails'

export default function OrderDetails(props) {
	const [order, setOrders] = useState(props?.history?.location?.state?.orderId)
	const [adress, setAdress] = useState('')
	const [products, setProducts] = useState('')
	const [orderSumary, setOrderSumary] = useState('')
	const [paymentDetails, setPaymentDetails] = useState('')
	const [isLoading, setIsLoading] = useState(true)

	const [cancelConfirmation, setCancelConfirmation] = useState(false)
	const [cancelReason, setCancelReason] = useState('')

	useEffect(() => {
		try {
			const orderId = props?.history?.location?.state?.orderId
			if (!orderId) {
				Eitri.navigation.navigate({ path: 'OrderList', replace: true })
			}
			handleOrder(orderId)
			sendPageView('Detalhes do pedido', 'OrderDetails')
		} catch (error) {
			console.error('deu erro', error)
		}
	}, [])

	const formatAmountInCents = amount => {
		if (typeof amount !== 'number') {
			return ''
		}
		if (amount === 0) {
			return 'Grátis'
		}
		return (amount / 100).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
	}

	const handleOrder = async id => {
		try {
			const orders = await Vtex.customer.getOrderById(id)
			setOrders(orders)
			setProducts(orders.items)
			setAdress(orders.shippingData.address)
			setPaymentDetails(orders.paymentData.transactions[0].payments[0])
			setOrderSumary(orders.totals)
			setIsLoading(false)
		} catch (error) {
			console.log('Erro ao pegar orders', error)
			Eitri.navigation.navigate({ path: 'OrderList', replace: true })
		}
	}

	const cancelOrder = async () => {
		try {
			setIsLoading(true)
			if (!cancelReason) {
				return
			}
			const payload = { reason: cancelReason }
			await Vtex.customer.cancelOrder(order.orderId, payload)
			Eitri.navigation.back()
		} catch (e) {
			console.log('Erro ao cancelar pedido', e)
		}
	}

	return (
		<ProtectedView
			afterLoginRedirectTo={'OrderDetails'}
			redirectState={{ orderId: props?.history?.location?.state?.orderId }}
		>
			<Window bottomInset topInset backgroundColor="primary-500">
				<HeaderContentWrapper
					gap={16}
					borderBottomWidth='hairline'
					borderColor="primary-300"
				>
					<HeaderReturn iconColor="secondary-500" />
					<HeaderText text={'MEUS PEDIDOS'} />
				</HeaderContentWrapper>

				<View
					padding='large'
				>
					{isLoading ? (
						<Loading fullScreen />
					) : (
						<View
							backgroundColor='primary-100'
							padding='medium'
							paddingVertical='large'
						>
							<PaymentDetails order={order} orderSumary={orderSumary} products={products} />

							{order?.allowCancellation && (
								<View padding='large'>
									<View
										display='flex'
										alignItems='center'
										width='100%'>
										{cancelConfirmation ? (
											<View>
												<Text
													block
													fontSize='small'
													fontWeight='bold'>
													Selecione o motivo para o cancelamento
												</Text>
												<Dropdown
													value={cancelReason}
													placeholder='Selecione o motivo'
													onChange={value => setCancelReason(value)}>
													<Dropdown.Item
														value='Não quero mais este produto.'
														label='Não quero mais este produto.'
													/>
													<Dropdown.Item
														value='Comprei sem querer.'
														label='Comprei sem querer.'
													/>
													<Dropdown.Item
														value='A entrega vai demorar demais.'
														label='A entrega vai demorar demais.'
													/>
													<Dropdown.Item
														value='Encontrei um preço melhor em outro lugar.'
														label='Encontrei um preço melhor em outro lugar.'
													/>
													<Dropdown.Item
														value='Prefiro não informar.'
														label='Prefiro não informar.'
													/>
													<Dropdown.Item
														value='Outro'
														label='Outro'
													/>
												</Dropdown>
												<View
													display='flex'
													justifyContent='between'
													marginTop='small'>
													<Touchable onPress={() => setCancelConfirmation(false)}>
														<Text
															block
															color='primary-700'
															fontSize='small'
															fontWeight='bold'>
															Voltar
														</Text>
													</Touchable>
													<Touchable onPress={cancelOrder}>
														<Text
															block
															color={cancelReason ? 'negative-700' : ''}
															fontSize='small'
															fontWeight='bold'>
															Continuar cancelamento
														</Text>
													</Touchable>
												</View>
											</View>
										) : (
											<Touchable onPress={() => setCancelConfirmation(true)}>
												<Text
													block
													color='negative-700'
													fontWeight='bold'>
													Cancelar pedido
												</Text>
											</Touchable>
										)}
									</View>
								</View>
							)}
						</View>
					)}
				</View>
			</Window>
		</ProtectedView>
	)
}
