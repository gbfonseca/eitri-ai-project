import { Spacing, Divisor } from "projeto-ai-shared"
import { useTranslation } from "eitri-i18n"

export default function Description(props) {
  const { description } = props

  const [collapsed, setCollapsed] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const isLongDescription = description?.length > 100

  const { t } = useTranslation()

  const toggleCollapsedState = () => {
    setCollapsed(!collapsed)
  }

  const toggleShowMore = () => {
    setShowMore(!showMore)
  }

  function removeTags(description) {
    const regex = /<(strong|h2)>(.*?)<\/\1>/g

    let descriptionTitle = []
    let match = ""

    while ((match = regex.exec(description)) !== null) {
      descriptionTitle.push(match[2])
    }

    const modifiedDescription = description.replace(regex, "")

    return {
      descriptionTitle,
      modifiedDescription,
    }
  }
  const result = removeTags(description)

  return (
    <View>
      <Touchable onPress={() => toggleCollapsedState()}>
        <View
          display="flex"
          alignItems="center"
          justifyContent="between"
          width="100%"
        >
          <Text color="accent-100" fontSize="large" fontWeight="bold">
            {t("description.txtDescription")}
          </Text>
          <Icon
            color="secondary-500"
            iconKey={collapsed ? "minus" : "plus"}
            width={26}
          />
        </View>
      </Touchable>
      {collapsed && (
        <View>
          <Divisor backgroundColor="accent-900" />
          <Spacing height="16px" />

          <Text
            color="accent-100"
            fontWeight="bold"
            fontSize="medium"
          >
            {result.descriptionTitle}
          </Text>
          <Text
            color="accent-100"
            fontSize="medium"
            textAlign="justify"
          >
            {showMore || !isLongDescription
              ? result?.modifiedDescription
              : `${result?.modifiedDescription.substring(0, 220)}...`}
          </Text>
          {isLongDescription && (
            <Touchable onPress={toggleShowMore}>
              <Text
                color="secondary-500"
                textDecoration="underline"
                fontWeight="bold"
                marginTop="nano"
              >
                {showMore
                  ? t("description.labelSeeLess")
                  : t("description.labelSeeMore")}
              </Text>
            </Touchable>
          )}
          <Spacing height="20px" />
        </View>
      )}
    </View>
  )
}
