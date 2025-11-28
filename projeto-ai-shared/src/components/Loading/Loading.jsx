export default function Loading(props) {
	const { isLoading, width, fullScreen, height, backgroundColor } = props

	if (typeof isLoading === 'boolean' && !isLoading) return null

	if (fullScreen) {
		return (
			<View
				position='fixed'
				top={0}
				left={0}
				right={0}
				bottom={0}
				zIndex='999'
				backgroundColor='primary-500'
				display='flex'
				justifyContent='center'
				alignItems='center'>
				<Spinner
					backgroundColor={backgroundColor || 'secondary-500'}
					width={width || '50px'}
					height={height || '50px'}
				/>
			</View>
		)
	}

	return (
		<View>
			<Spinner
				backgroundColor={backgroundColor || 'secondary-500'}
				width={width || '50px'}
				height={height || '50px'}
			/>
		</View>
	)
}
