import {
  HeaderLogo,
  HeaderCart,
  HeaderMenu,
  HeaderContentWrapper,
  HeaderSearchIcon,
} from "projeto-ai-shared";
import MenuIcon from "../../assets/icons/menu-icon.svg";
import DrawerContent from "../DrawerContent/DrawerContent";

export default function Header(props) {
  const { cart, navigateToCart, navigateToSearch, drawerContent, startParams, safeAreaTop = false } =
    props;

  const [isOpenDrawer, setIsOpenDrawer] = useState(false);

  const handleOpenDrawer = () => {
    setIsOpenDrawer(true);
  };

  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
  };

  return (
    <HeaderContentWrapper safeAreaTopProps={safeAreaTop}>
      <View block width="100%">
        <View display="flex" justifyContent="between" alignItems="center">
          <HeaderMenu
            showDrawer={isOpenDrawer}
            onPressOpenButton={handleOpenDrawer}
            onCloseDrawer={handleCloseDrawer}
            iconColor="accent-100"
            content={
              isOpenDrawer && (
                <DrawerContent
                  data={drawerContent}
                  closeDrawer={handleCloseDrawer}
                  page={"Home"}
                  startParams={startParams}
                  navigateToSearch={navigateToSearch}
                />
              )
            }
          />

          <HeaderLogo />

          <HeaderCart cart={cart} onPress={navigateToCart} />
        </View>

        <View display="flex" alignItems="center">
          <HeaderSearchIcon onPress={navigateToSearch} />
        </View>
      </View>
    </HeaderContentWrapper>
  );
}
