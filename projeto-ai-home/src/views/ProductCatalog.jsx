import Eitri from "eitri-bifrost";
import {
  Loading,
  HeaderText,
  HeaderReturn,
  HeaderContentWrapper,
  HeaderSearchIcon,
} from "projeto-ai-shared";

import { getProductsService } from "../services/ProductService";
import SearchResults from "../components/PageSearchComponents/SearchResults";
import { useTranslation } from "eitri-i18n";
import InfiniteScroll from "../components/InfiniteScroll/InfiniteScroll";
import HeaderFilterModal from "../components/HeaderFilterModal/HeaderFilterModal";
import { logEvent, logScreenView } from "../services/TrackingService";
import { slugify } from "../utils/utils";

export default function ProductCatalog(props) {
  const { location } = props;

  const title = location.state.title;

  // indicador de que foi aberto pela barra de navegação
  const openInBottomBar = !!location.state.openInBottomBar;

  const { t } = useTranslation();

  const [initialLoading, setInitialLoading] = useState(true);
  const [productLoading, setProductLoading] = useState(false);

  const [products, setProducts] = useState([]);
  const [initialFilters, setInitialFilters] = useState(null);
  const [appliedFacets, setAppliedFacets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagesHasEnded, setPageHasEnded] = useState(false);

  useEffect(() => {
    const params = location?.state?.params || location?.state;

    resolveProducts(params);

    logScreenView(`Catalogo ${title}`, "ProductCatalog")

    // Se aberto pela barrra de navegação, adicionar evento ao clicar novamente no icone de navegação
    if (!openInBottomBar) {
      Eitri.eventBus.subscribe({
        channel: "onUserTappedActiveTab",
        callback: (_) => {
          Eitri.navigation.back();
        },
      });
    }
  }, []);

  const onScrollEnd = async () => {
    if (!initialLoading && !productLoading && !pagesHasEnded) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      _getProductsByFacets(appliedFacets, newPage);
    }
  };

  const resolveProducts = async (params) => {
    setAppliedFacets(params);
    setInitialFilters(params);

    await _getProductsByFacets(params, currentPage);

    setInitialLoading(false);
  };

  const _getProductsByFacets = async (selectedFacets, page) => {
    if (productLoading || pagesHasEnded) return;

    setProductLoading(true);

    const result = await getProductsService(selectedFacets, page);

    if (result?.products?.length === 0) {
      setProductLoading(false);
      setPageHasEnded(true);
      return;
    }

    if (result?.products) {
      setProducts((prev) => [...prev, ...result.products]);
    }

    if (result?.products?.length > 0) {
      const trackingListName = title || `Catalogo genérico`
      logEvent('view_item_list', {
        currency: 'BRL',
        item_list_id: slugify(trackingListName),
        item_list_name: trackingListName,
        items: result.products.map(item => ({
          item_id: item.productId,
          item_name: item.name || item.productName || item.nameComplete
        }))
      })
    }

    setProductLoading(false);
  };

  const goToSearch = () => {
    Eitri.navigation.navigate({ path: "Search" });
  };

  const filterProductsSubmit = async (filters) => {
    setCurrentPage(1);
    setProducts((_) => []);
    setPageHasEnded(false);
    _getProductsByFacets(filters, 1);
  };

  const onClearFilter = async () => {
    setAppliedFacets(initialFilters);
    filterProductsSubmit(initialFilters);
  };

  return (
    <Window topInset bottomInset>
      <>
        <HeaderContentWrapper justifyContent="between" gap={16}>
          <View display="flex" alignItems="center" gap={12}>
            {!openInBottomBar && <HeaderReturn />}

            <HeaderText text={title || t("productCatalog.title")} />
          </View>

          <View display="flex" alignItems="center" gap={12}>
            <HeaderSearchIcon onPress={goToSearch} />

            <HeaderFilterModal
              initialParams={initialFilters}
              currentParams={appliedFacets}
              onApplyFilters={filterProductsSubmit}
              onClearFilters={onClearFilter}
            />
          </View>
        </HeaderContentWrapper>

        <Loading isLoading={initialLoading} fullScreen />

        {!initialLoading && (
          <InfiniteScroll
            padding={"small"}
            onScrollEnd={onScrollEnd}
            marginTop="display"
          >
            <SearchResults
              searchResults={products}
              isLoading={productLoading}
            />
          </InfiniteScroll>
        )}
      </>
    </Window>
  );
}
