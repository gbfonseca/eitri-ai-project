import Eitri from "eitri-bifrost";
import SliderHero from "./SliderHero";
import BannerList from "./BannerList";
import {
  openBrand,
  openProductById,
  resolveNavigation,
  openBrowser,
} from "../../services/NavigationService";
import FitOnScreen from "./FitOnScreen";
import GridList from "./GridList";
import RoundedBannerList from "./RoundedBannerList";
import SingleBanner from "./SingleBanner";
import FullScreen from "./FullScreen";
import { logEvent } from "../../services/TrackingService";

export default function MultipleImageBanner(props) {
  const { data } = props;

  const mode = data.mode;

  useEffect(() => {
		// GA de banners promocionais
		data?.images?.map(banner => {
			if (banner.mktTag) {
				logEvent('view_promotion', {
					promotion_id: banner.mktTag,
					promotion_name: banner.mktTag,
					creative_name: banner.mktTag
				})
			}
		})
	}, [])

  const handleLegacySearchAction = (value, title) => {
    Eitri.navigation.navigate({
      path: "ProductCatalog",
      state: {
        facets: value,
        title: title,
      },
    });
  };

  const handleSearchAction = (value) => {
    Eitri.navigation.navigate({
      path: "Search",
      state: {
        searchTerm: value,
      },
    });
  };

  const handleCollectionAction = (value, title) => {
    Eitri.navigation.navigate({
      path: "ProductCatalog",
      state: {
        facets: `productClusterIds/${value}`,
        title: title,
      },
    });
  };

  const handlePageAction = (value, title) => {
    Eitri.navigation.navigate({
      path: "LandingPage",
      state: {
        landingPageName: value,
        pageTitle: title,
      },
    });
  };

  const handleCategoryAction = (value) => {
    resolveNavigation(value);
  };

  const handleProductAction = (value) => {
    openProductById(value);
  };

  function processActions(sliderData) {
    const action = sliderData?.action;

    if (sliderData.mktTag) {
      logEvent('select_promotion', {
        promotion_id: sliderData.mktTag,
        promotion_name: sliderData.mktTag,
        creative_name: sliderData.mktTag
      })
    }

    switch (action?.type) {
      case "legacySearch":
        handleLegacySearchAction(action.value, action.title);
        break;
      case "search":
        handleSearchAction(action.value);
        break;
      case "collection":
        handleCollectionAction(action.value, action.title);
        break;
      case "page":
        handlePageAction(action.value, action.title);
        break;
      case "category":
        handleCategoryAction(action.value);
        break;
      case "product":
        handleProductAction(action.value);
        break;
      case "path":
        resolveNavigation(action.value, action.title);
        break;
      case "brand":
        openBrand(action.value, action.title);
        break;
      case "link":
        openBrowser(action.value, true);
        break;
      default:
        console.log(`Unknown action type: ${action.type}`);
    }
  }

  if (mode === "SliderHero") {
    // return <SliderHero data={data} onPress={processActions} />;
    return <BannerList data={data} onPress={processActions} />;
  }

  if (mode === "BannerList") {
    return <BannerList data={data} onPress={processActions} />;
  }

  if (mode === "RoundedBannerList") {
    return <RoundedBannerList data={data} onPress={processActions} />;
  }

  if (mode === "GridList") {
    return <GridList data={data} onPress={processActions} />;
  }

  if (mode === "SingleBanner") {
    return <SingleBanner data={data} onPress={processActions} />;
  }

  if (mode === "FitOnScreen") {
    return (
      <View>
        <FitOnScreen data={data} onPress={processActions} />
      </View>
    );
  }

  if (mode === "FullScreen") {
    return <FullScreen data={data} onPress={processActions} />;
  }

  return <SliderHero data={data} onPress={processActions} />;
}
