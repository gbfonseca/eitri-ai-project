import Eitri from 'eitri-bifrost'
import { HeaderContentWrapper, HeaderCart, Loading } from 'projeto-ai-shared'
import { getProductsService } from '../services/ProductService'
import SearchInput from '../components/SearchInput/SearchInput'
import SearchResults from '../components/PageSearchComponents/SearchResults'
import { useLocalShoppingCart } from '../providers/LocalCart'
import InfiniteScroll from '../components/InfiniteScroll/InfiniteScroll'
import TopSearches from '../components/TopSearches/TopSearches'
import { saveSearchHistory } from '../services/CatalogService'
import SearchHistory from '../components/SearchHistory/SearchHistory'
import HeaderFilterModal from '../components/HeaderFilterModal/HeaderFilterModal'
import { logEvent, logScreenView } from '../services/TrackingService'
import { openCart } from '../services/NavigationService'

export default function Search(props) {
  const incomingSearchTerm = props?.history?.location?.state?.searchTerm || props?.location?.state?.searchTerm

  const { cart } = useLocalShoppingCart()

  const [isProductLoading, setIsProductLoading] = useState(false)
  const [page, setPage] = useState(1)

  const [searchResults, setSearchResults] = useState([])
  const [pagesHasEnded, setPageHasEnded] = useState(true)
  const [params, setParams] = useState(null)
  const [initialParams, setInitialParams] = useState(null)

  useEffect(() => {
    if (incomingSearchTerm) {
      setSearchAndGetProducts(incomingSearchTerm)
    }

    logScreenView(`Busca`, "Search")

    Eitri.eventBus.subscribe({
      channel: 'onUserTappedActiveTab',
      callback: _ => {
        Eitri.navigation.backToTop()
      }
    })
  }, [])

  const onScrollEnd = async () => {
    if (!isProductLoading && !pagesHasEnded) {
      const newPage = page + 1
      setPage(newPage)
      getProducts(params, newPage)
    }
  }

  const getProducts = async (params, newPage) => {
    _getProductsByFacets(params, newPage)
  }

  const setSearchAndGetProducts = async incomingSearchTerm => {
    const params = {
      facets: [],
      query: incomingSearchTerm,
      sort: 'orders:desc'
    }

    setParams(params)
    setInitialParams({ ...params })

    _getProductsByFacets(params, 1)
  }

  const handleSearchSubmit = async term => {
    if (term) {
      Eitri.keyboard.dismiss()
      try {
        const params = {
          sort: 'orders:desc',
          facets: [],
          query: term
        }
        setParams(params)
        setInitialParams({ ...params })
        setSearchResults([])
        setPageHasEnded(false)
        setPage(1)
        _getProductsByFacets(params, page)
      } catch (error) {
        console.log('handleSearchSubmit', error)
      }
    }
  }

  const _getProductsByFacets = async (selectedFacets, page) => {
    setIsProductLoading(true)

    try {
      const result = await getProductsService(selectedFacets, page)

      if (result?.products?.length === 0) {
        setIsProductLoading(false)
        setPageHasEnded(true)
        return
      }

      setSearchResults(prev => [...prev, ...result?.products])
      setIsProductLoading(false)

      if (page === 1) {
        logEvent('search', { search_term: selectedFacets?.query })
      }
      
    } catch (e) {
      console.log('erro', e)
    }
  }

  const onApplyFilter = async filters => {
    setPage(1)
    setSearchResults(_ => [])
    setParams(filters)
    _getProductsByFacets(filters, 1)
  }

  const onClearFilter = async () => {
    setParams(initialParams)
    onApplyFilter(initialParams)
  }

  return (
    <Window
      title='Tela de busca'
      bottomInset
      topInset>
      <HeaderContentWrapper>
        <View
          display='flex'
          alignItems='center'
          gap={12}>

          <SearchInput
            incomingValue={params?.query}
            onSubmit={handleSearchSubmit}
          />

          <View
            display='flex'
            gap={12}>
            <HeaderFilterModal
              initialParams={initialParams}
              currentParams={params}
              onApplyFilters={onApplyFilter}
              onClearFilters={onClearFilter}
            />

            <HeaderCart cart={cart} onPress={() => openCart()} />
          </View>
        </View>
      </HeaderContentWrapper>

      {isProductLoading && (
        <View
          display='flex'
          alignItems='center'
          justifyContent='center'>
          <Loading />
        </View>
      )}

      {searchResults.length > 0 && (
        <View padding={'small'}>
          <InfiniteScroll onScrollEnd={onScrollEnd}>
            <SearchResults searchResults={searchResults} />
          </InfiniteScroll>
        </View>
      )}


      {!isProductLoading && searchResults.length === 0 && (
				<>
					<TopSearches
						marginTop='large'
						onSubmit={handleSearchSubmit}
					/>

					<SearchHistory
						marginTop='large'
						onSubmit={handleSearchSubmit}
					/>
				</>
			)}
    </Window>
  )
}
