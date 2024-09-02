import { useMonkState } from "@monkvision/common"
import { useEffect, useMemo } from "react";
import { useInspectionGalleryStyles } from "./hooks";
import { styles } from "./Gallery.styles";


// export function GalleryItemCard() {
//
//         return <button style={}  onClick={() => handleItemClick(item)}>
//           <div style={{backgroundImage: item.thumbnailPath}} data-testid='preview'> </div>
//         </button>
//         </div>
// }

export interface GalleryProps {

}

export function Gallery ({}: GalleryProps) {
  const {state} = useMonkState();

  const items = useMemo(() => state.images, [state])
  useEffect(() => {
    console.log(state.images, items)
  }, [state])

  const { containerStyle, itemListStyle, itemStyle, fillerItemStyle, emptyStyle } =
    useInspectionGalleryStyles();

  const handleItemClick = (item: any) => {console.log('clicked on image', item)}

  return <div >
    {items.map((item, index) => (
      <div style={styles['item']} key={index}>
        <button style={styles['card']}  onClick={() => handleItemClick(item)}>
          <div style={{...styles['preview'], backgroundImage: item.thumbnailPath}} data-testid='preview'> </div>
        </button>
        </div>
    ))}
    </div>
}
