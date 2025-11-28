import { TOKENS_DEFAULT } from '../../utils/constants'
import { getRemoteAppConfigProperty } from '../../utils/getRemoteConfigStyleProperty'

export default function HeaderText(props) {
	const { text, contentColor, ...rest } = props

	const [_contentColor, setContentColor] = useState(contentColor || TOKENS_DEFAULT.HEADER_CONTENT_COLOR)

	useEffect(() => {
		loadColor()
	}, [])

	const loadColor = async () => {
		if (contentColor) return
		const headerContentColor = await getRemoteAppConfigProperty('headerContentColor')
		if (headerContentColor) {
			setContentColor(headerContentColor)
		}
	}

	return (
		<Text
			lineClamp={1}
			color={_contentColor}
			fontSize='extra-large'
			fontWeight={'bold'}
			width='100%'
			block
			{...rest}>
			{text}
		</Text>
	)
}
