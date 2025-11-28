import FacetsModal from "../FacetsModal/FacetsModal";
import { HeaderFilter } from "projeto-ai-shared";

export default function HeaderFilterModal(props) {
  const { initialParams, currentParams, onApplyFilters, onClearFilters } =
    props;

  const [facetsModalReady, setFacetsModalReady] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleFilterModal = () => {
    setShowModal(true);
  };

  const _onApplyFilters = (filters) => {
    onApplyFilters(filters);
    setShowModal(false);
  };

  const _onRemoveFilters = () => {
    onClearFilters();
    setShowModal(false);
  };

  const hasAppliedFilters = () => {
    return JSON.stringify(currentParams) !== JSON.stringify(initialParams);
  };
  return (
    <>
      <View position="relative" opacity={facetsModalReady ? "solid" : "light"}>
        <HeaderFilter
          hasFilters={hasAppliedFilters()}
          onPress={handleFilterModal}
        />
      </View>

      <FacetsModal
        show={showModal}
        initialFilters={currentParams}
        onApplyFilters={_onApplyFilters}
        onRemoveFilters={_onRemoveFilters}
        modalReady={() => setFacetsModalReady(true)}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}
