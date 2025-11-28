import Eitri from 'eitri-bifrost'
import {getRemoteAppConfigProperty} from "../../utils/getRemoteConfigStyleProperty";
import {TOKENS_DEFAULT} from "../../utils/constants";

export default function HeaderShare(props) {
	const { iconColor, url } = props

  const [_iconColor, setIconColor] = useState(iconColor || TOKENS_DEFAULT.HEADER_BACKGROUND_COLOR);

  useEffect(() => {
    loadColor()
  }, []);

  const loadColor = async () => {
    if (iconColor) return
    const headerContentColor = await getRemoteAppConfigProperty("headerContentColor")
    if (headerContentColor) {
      setIconColor(headerContentColor)
    }
  }

  const handleShare = async () => {
    await Eitri.share.link({
      url: url
    })
  }

	return (
		<Touchable onPress={handleShare}>
			<Icon
				color={_iconColor}
				iconKey='share-2'
				width={24}
				height={24}
			/>
		</Touchable>
	)
}
