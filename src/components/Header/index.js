import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Appbar, useTheme } from 'react-native-paper';
import { getHeaderTitle } from '@react-navigation/elements';
import BackAction from 'components/Header/BackAction';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Header({ route, options }) {
  const { backAction, children, leftAction, headerShown, subtitle } = options;

  const { colors } = useTheme();
  const navigation = useNavigation();

  const title = getHeaderTitle(options, route.name);

  const handleMenuPress = useCallback(() => {
    navigation.openDrawer();
  }, [navigation]);

  return headerShown !== false ? (
    <Appbar.Header>
      {leftAction || (!backAction && (
        <Appbar.Action
          onPress={handleMenuPress}
          color={colors.primaryContrastText}
          icon={(props) => <MaterialCommunityIcons name="menu" {...props} />}
        />
      ))}
      {backAction && <BackAction />}
      <Appbar.Content title={title} subtitle={subtitle} />
      {children}
    </Appbar.Header>
  ) : null;
}

Header.propTypes = {
  options: PropTypes.shape({
    backAction: PropTypes.bool,
    children: PropTypes.node,
    headerShown: PropTypes.bool,
    leftAction: PropTypes.node,
    subtitle: PropTypes.string,
  }).isRequired,
  route: PropTypes.shape({ name: PropTypes.string }).isRequired,
};
