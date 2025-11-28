import { useState } from "react";

import { Text, Touchable, View } from "eitri-luminus";

export default function Breadcrumb(props) {
  const { currentPath, allPath } = props;
  const [paths, setPaths] = useState([]);
  useEffect(() => {
    let pathArray = allPath.split("/");
    pathArray = pathArray.filter((path) => path !== "/" && path !== "");
    setPaths(pathArray);

    return () => {
      setPaths([]);
    }
  }, [allPath]);

  const handleClick = (path) => {
    goToCategoryPage(path);
  }

  const goToCategoryPage = (category) => {
    console.log("Navegando para a categoria:", category);
  }


  return (
    <View>
      <View gap={4} display="flex" flexDirection="row" alignItems="center">
        {paths.map((route, index) => (
          <Touchable
            key={index}
            gap={4}
            display="flex"
            flexDirection="row"
            alignItems="center"
            onPress={() => handleClick(route)}
          >
            <Text
              fontSize="extra-small"
              textTransform="uppercase"
              whiteSpace="nowrap"
            >
              {route}
            </Text>
            <Text
              color="secondary-500"
              fontSize="medium"
            >
              /
            </Text>
          </Touchable>
        ))}
        <Text
          fontSize="extra-small"
          textTransform="uppercase"
          fontWeight="bold"
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
        >
          {currentPath}
        </Text>
      </View>
    </View>
  );
}