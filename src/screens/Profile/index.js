import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { SafeAreaView, Image, StyleSheet, View, Dimensions } from 'react-native';
import { useTheme, Surface, Button, Card, Title, Paragraph } from 'react-native-paper';
import jwtDecode from 'jwt-decode';

import { useDispatch, useStore } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import { getUserSignature } from '@monkvision/corejs';
import { ActivityIndicatorView } from '@monkvision/react-native-views';

import useAuth from 'hooks/useAuth';
import { spacing } from 'config/theme';

import { useMediaQuery } from 'react-responsive';

import useToggle from 'hooks/useToggle/index';
import EditSignatureForm from './EditSignatureForm';
import useSignature from './useSignature';

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  root: {
    position: 'relative',
    overflow: 'hidden',
    height,
  },
  card: {
    marginHorizontal: spacing(2),
    marginVertical: spacing(2),
    paddingVertical: spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signature: {
    width: 300,
    height: 300,
    borderRadius: 4,
  },
  surface: {
    elevation: 3,
    width: 300,
    height: 300,
  },
  layout: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing(2),
    height: 300,
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  button: {
    margin: spacing(1),
    width: 200,
  },
});

export default function Profile() {
  const { colors } = useTheme();
  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-device-width: 1224px)',
  });
  const { signOut } = useAuth();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const store = useStore();

  const [accountData, setAccountData] = useState({ firstName: '', lastName: '', company: '', site: '', signature: { isLoading: false, uri: null } });
  const { firstName, lastName, company, site, signature } = accountData;
  const [drawerIsOpen, handleOpenDrawer, handleCloseDrawer] = useToggle();

  const handleSignOut = useCallback(signOut, [signOut]);

  const updateAccountData = useCallback(
    (args) => setAccountData((prev) => ({ ...prev, ...args })), [],
  );

  const { handleSave, handleSubmit } = useSignature({
    signature,
    updateAccountData,
    handleCloseDrawer,
  });

  useLayoutEffect(() => {
    if (navigation) {
      navigation?.setOptions({
        title: 'Profile',
        headerRight: () => (
          <Button onPress={handleSignOut} accessibilityLabel="Sign out">
            Sign out
          </Button>
        ),
      });
    }
  }, [handleSignOut, navigation]);

  const isEmpty = useMemo(() => !firstName || !lastName || !company || !site || !signature,
    [company, firstName, lastName, signature, site]);

  useEffect(() => {
    const id = jwtDecode(store.getState().auth.accessToken).sub;
    dispatch(getUserSignature({ id, params: { return_image: true } }));
  }, [dispatch, store]);

  return (
    <SafeAreaView>
      <EditSignatureForm
        accountData={{ ...accountData, updateAccountData }}
        handleSave={handleSave}
        isOpen={drawerIsOpen}
        handleClose={handleCloseDrawer}
      />
      <View style={styles.root}>
        <Card style={styles.card}>
          <View>
            <Card.Content>
              <Title style={{ textAlign: 'center' }}>
                {`${lastName || firstName ? firstName : 'Anonymous user'}  ${lastName}`}
              </Title>
              <Paragraph style={{ textAlign: 'center', color: '#aaaaaa' }}>
                {company && site ? `${company} - ${site}`
                  : company || (site ? `Anonymous company - ${site}` : 'Anonymous company')}
              </Paragraph>

              <View style={styles.layout}>
                <Surface style={styles.surface}>
                  {signature?.uri
                    ? <Image source={signature} style={styles.signature} width={300} height={300} />
                    : null }
                  {signature?.isLoading ? <ActivityIndicatorView color={colors.primary} light />
                    : null }
                </Surface>

              </View>
            </Card.Content>
            <Card.Actions style={[styles.actions, { flexDirection: isDesktopOrLaptop ? 'row' : 'column' }]}>
              <Button
                onPress={handleOpenDrawer}
                mode="contained"
                style={styles.button}
                icon="account-edit"
              >
                Edit
              </Button>
              <Button onPress={handleSubmit} disabled={isEmpty} mode="outlined" style={[styles.button, { borderColor: colors.primary }]} icon="send">Submit</Button>
            </Card.Actions>
          </View>
        </Card>
      </View>
    </SafeAreaView>
  );
}
