export default function RichText(props) {
	const { data } = props

	const content = (() => {
		try {
			return JSON.parse(data?.content)
		} catch (e) {
			return null
		}
	})()

	return (
		<View paddingHorizontal='large'>
			<Text
				fontWeight='bold'
				fontSize='big'>
				{data.title}
			</Text>
			<View
				direction='column'
				marginTop='extra-small'
				gap={10}>
				{content?.blocks?.map((cont, index) => (
					<Text
						key={index}
						color='neutral-700'>
						{cont.text}
					</Text>
				))}
			</View>
		</View>
	)
}
