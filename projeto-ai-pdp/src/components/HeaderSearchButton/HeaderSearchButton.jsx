import Eitri from "eitri-bifrost";
import { Icon, Touchable } from "eitri-luminus";
import { navigate } from "../../services/NavigationService";

export default function HeaderSearchButton(props) {
  const { iconColor } = props;

  const onPress = () => {
    Eitri.navigation.open({
      slug: "home",
      replace: true,
      initParams: { route: 'Search' }
    });
  };

  return (
    <Touchable
      display="flex"
      alignItems="center"
      justifyContent="center"
      width="48px"
      height="48px"
      {...props}
      onPress={onPress}
    >
      <Icon iconKey="search" color={iconColor || "white"} width={24} height={24} />
    </Touchable>
  );
}