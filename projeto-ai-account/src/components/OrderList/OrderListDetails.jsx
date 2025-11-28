import Eitri from 'eitri-bifrost'
import { useTranslation } from 'eitri-i18n'

export default function OrderListDetails(props) {
	const { creationDate, totalItems, totalValue, statusId, statusDescription, order, labelOrderDate, labelTotal, labelOrderNumber, imageUrl } = props
	const { t } = useTranslation()
	const [colorButtonCopy, setColorButtonCopy] = useState('neutral-900')

	const copyOrderNumber = async orderNumber => {
		await Eitri.clipboard.setText({
			text: orderNumber
		})
		setColorButtonCopy('positive-700')
	}

	return (
		<View
			justifyContent='between'
			display='flex'
			marginBottom='medium'
		>
			<View
				width={88}
				height={88}
				alignItems='center'
				justifyContent='center'
				display='flex'
				marginRight='medium'
			>
				<Image
					src={imageUrl}
					maxWidth='100%'
					maxHeight='100%'
				/>
			</View>

			<View
				display='flex'
				direction='column'
				width='100%'
			>
				<Text
					fontSize='medium'
					fontWeight='bold'
					marginBottom='small'
				>
					{t('orderList.orderNumber') + ': ' + order}
				</Text>
				<Text
					fontSize='nano'
					marginBottom='small'
				>
					{t('orderList.orderDate') + ': ' + creationDate}
				</Text>

				<View
					display='flex'
					direction='row'
					justifyContent='between'
				>
					<View>
						<Text
							fontSize='small'
							fontWeight='bold'
						>
							{t('orderList.price') + ':'}
						</Text>
						{' '}
						<Text
							fontSize='small'
							fontWeight='bold'
							color='secondary-500'
						>
							{totalValue}
						</Text>
					</View>
					<View>
						<Text
							fontSize='small'
							fontWeight='bold'
						>
							{t('orderList.totalItems') + ': ' + totalItems}
						</Text>
					</View>
				</View>
			</View>
		</View>
	)
}
