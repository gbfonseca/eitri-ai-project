export default function CInput(props) {
	const { icon, type, backgroundColor, mask, ...rest } = props

	return (
		<View
			//borderColor='neutral-300'
			//borderBottomWidth='hairline'
			borderRadius='small'
			backgroundColor='neutral-900'
			height='40px'
			width='100%'
			display='flex'
			alignItems='center'
			color='accent-100'
			paddingHorizontal='large'>
			{mask ? (
				<MaskedInput
					borderHidden={true}
					mask={mask}
					{...rest}
				/>
			) : (
				<Input
					borderHidden={true}
					type={type || 'text'}
					{...rest}
				/>
			)}
			{icon && (
				<View>
					<Image
						src={icon}
						width='16px'
					/>
				</View>
			)}
		</View>
	)
}
