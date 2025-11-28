import { DIMENSIONS } from "../../utils/constants";

export default function HeaderOffset(props) {

  const { topInset, height, safeAreaTop } = props

  return (
    <>
      {
        topInset && <View topInset />
      }
      <View height={safeAreaTop || height || DIMENSIONS.HEADER_HEIGHT} />
    </>
  )
}
