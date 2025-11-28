import { getMappedComponent } from "../../utils/getMappedComponent";

export default function HomeTemplate(props) {
  const { cmsContent, reloadKey } = props;

  return (
    <View paddingBottom="large" direction="column" gap={10}>
      {cmsContent?.map((content) => getMappedComponent(content, reloadKey))}
    </View>
  );
}
