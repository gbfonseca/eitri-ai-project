import { useTranslation } from 'eitri-i18n'


export default function OrderStatusBadge(props) {
	const { statusId, statusDescription, ...rest } = props

	const { t } = useTranslation()

	const STATUS_PARAMS = {
		'cancel': {
			backgroundColor: 'negative-300',
			color: 'negative-700',
			label: t('orderStatusBadge.cancel') || 'Cancelando pedido'
		},
		'on-order-completed': {
			backgroundColor: 'neutral-100',
			color: 'primary-500',
			label: t('orderStatusBadge.complete') || 'Pedido completo'
		},
		'payment-approved': {
			backgroundColor: 'neutral-100',
			color: 'primary-500',
			label: t('orderStatusBadge.approved') || 'Pagamento aprovado'
		},
		'payment-pending': {
			backgroundColor: 'tertiary-300',
			color: 'warning-300',
			label: t('orderStatusBadge.pending') || 'Aguardando pagamento'
		},
		'request-cancel': {
			backgroundColor: 'negative-300',
			color: 'negative-700',
			label: t('orderStatusBadge.requestCancel') || 'Pedido cancelamento'
		},
		'canceled': {
			backgroundColor: 'negative-300',
			color: 'negative-700',
			label: t('orderStatusBadge.canceled') || 'Cancelado'
		},
		'waiting-for-authorization': {
			backgroundColor: 'neutral-100',
			color: 'primary-500',
			label: t('orderStatusBadge.waitAuthorization') || 'Esperando autorizaçao'
		},
		'authorize-fulfillment': {
			backgroundColor: 'neutral-100',
			color: 'primary-500',
			label: t('orderStatusBadge.authorizeFulfillment') || 'Autorizado formulario'
		},
		'window-to-cancel': {
			backgroundColor: 'negative-300',
			color: 'negative-700',
			label: t('orderStatusBadge.windowCancel') || 'Janela de cancelamento'
		},
		'ready-for-invoicing': {
			backgroundColor: 'neutral-100',
			color: 'primary-500',
			label: t('orderStatusBadge.readyInvoicing') || 'pronto para nota fiscal'
		},
		'invoiced': {
			backgroundColor: 'neutral-100',
			color: 'secondary-500',
			label: t('orderStatusBadge.invoice') || 'Gerar nota fiscal'
		},
		'order-created': {
			backgroundColor: 'neutral-100',
			color: 'primary-500',
			label: t('orderStatusBadge.created') || 'Criado'
		}
	}

	return (
		<View {...rest}>
			<Text
				fontSize='medium'
				color={STATUS_PARAMS[statusId]?.color || 'accent-light'}
			>
				{statusDescription}
			</Text>
		</View>
	)
}
//
