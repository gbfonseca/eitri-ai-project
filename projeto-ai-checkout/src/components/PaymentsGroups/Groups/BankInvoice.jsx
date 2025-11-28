import { useLocalShoppingCart } from '../../../providers/LocalCart'
import Boleto from '../../Icons/MethodIcons/Boleto'
import GroupsWrapper from './GroupsWrapper'
import { trackAddPaymentInfo } from '../../../services/Tracking'
import { navigate } from '../../../services/navigationService'

export default function BankInvoice(props) {
	const { cart } = useLocalShoppingCart()
	const { systemGroup, onSelectPaymentMethod } = props

	const onSelectThisGroup = async () => {
		try {
			await onSelectPaymentMethod([
				{
					paymentSystem: systemGroup?.paymentSystems?.[0]?.stringId,
					installmentsInterestRate: 0,
					installments: 1,
					referenceValue: cart.value,
					value: cart.value,
					hasDefaultBillingAddress: true
				}
			])
			trackAddPaymentInfo(cart, 'Pix')
			navigate('CheckoutReview')
		} catch (e) {
			console.error('Error: ', e.message, '')
		}
	}

	return (
		<GroupsWrapper
			title='Boleto Bancário'
			icon={<Boleto />}
			onPress={onSelectThisGroup}
		/>
	)
}
