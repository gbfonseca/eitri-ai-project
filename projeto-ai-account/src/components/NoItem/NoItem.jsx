import imgBox from '../../assets/icons/empty-orders-icon.svg'

export default function NoItem(props) {
	const { title, subtitle } = props

	return (
		<View
			display='flex'
			direction='column'
			justifyContent='center'
			alignItems='center'
			gap='16px'
			padding='large'>
			<Image src={imgBox} width={48} height={48} />
			<Text
				block
				color='accent-100'
				textAlign='center'
				fontWeight='bold'
				fontSize='large'
			>
				{title}
			</Text>
			<Text
				block
				color='accent-100'
				textAlign='center'
				fontWeight='medium'
				fontSize='small'>
				{subtitle}
			</Text>
		</View>
	)
}
