import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { SafeAreaView, Image, StyleSheet, View } from 'react-native';
import { useTheme, Surface, Button, TextInput, Card, Title, Paragraph } from 'react-native-paper';

import jwtDecode from 'jwt-decode';

import { useDispatch, useSelector, useStore } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import { config, getUserSignature, setUserSignature, selectAllUser } from '@monkvision/corejs';
import { ActivityIndicatorView } from '@monkvision/react-native-views';

import useAuth from 'hooks/useAuth';
import Signature from 'components/Signature';
import { spacing } from 'config/theme';
import Drawing from 'components/Drawing';

import emptyDrawing from 'assets/emptyDocument.svg';
import { useMediaQuery } from 'react-responsive';

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing(2),
    marginVertical: spacing(2),
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
  },
  actions: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-wround',
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

  const [accountData, setAccountData] = useState({ firstName: 'John', lastName: 'Doe', company: 'Monk AI', site: 'France Paris', signature: { isFailed: false, uri: null } });
  const { firstName, lastName, company, site, signature } = accountData;

  const [visible, setVisible] = useState(false);
  const user = useSelector(selectAllUser);

  const handleSignOut = useCallback(signOut, [signOut]);

  const updateAccountData = useCallback(
    (args) => setAccountData((prev) => ({ ...prev, ...args })), [],
  );
  useEffect(() => {
    if (user && user[0]?.signature) {
      const reader = new FileReader();
      reader.readAsDataURL(user[0]?.signature);
      reader.onload = () => updateAccountData({
        signature: { isFailed: false, uri: reader.result } });
      reader.onerror = () => updateAccountData({
        signature: { isFailed: true, uri: null } });
    } else {
      updateAccountData({ signature: { isFailed: false, uri: null } });
    }
  }, [updateAccountData, user]);

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

  const handleSave = (uri) => {
    updateAccountData({ signature: { isLoading: false, isFailed: false, uri } });
    setVisible(false);
  };

  const handleSubmit = useCallback(() => {
    const id = jwtDecode(store.getState().auth.accessToken).sub;

    const baseParams = {
      id,
      headers: { ...config.axiosConfig, 'Content-Type': 'multipart/form-data' },
    };

    const multiPartKeys = {
      image: 'image',
      json: 'json',
      filename: `signature-${id}.png`,
      type: 'image/png',
    };

    const jsonData = JSON.stringify({
      acquisition: {
        strategy: 'upload_multipart_form_keys',
        file_key: multiPartKeys.image,
      },
    });

    fetch(signature).then((res) => res.blob())
      .then((buf) => new File(
        [buf], multiPartKeys.filename,
        { type: multiPartKeys.type },
      ))
      .then((imageFile) => {
        const data = new FormData();
        data.append(multiPartKeys.json, jsonData);
        data.append(multiPartKeys.image, imageFile);

        dispatch(setUserSignature({ ...baseParams, data })).unwrap();
      });
  }, [dispatch, signature, store]);

  useEffect(() => {
    const id = jwtDecode(store.getState().auth.accessToken).sub;
    dispatch(getUserSignature({ id, params: { return_image: true } }));
  }, [dispatch, store]);

  return (
    <SafeAreaView>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={{ textAlign: 'center' }}>
            {`${firstName}  ${lastName}`}
          </Title>
          <Paragraph style={{ textAlign: 'center', color: '#aaaaaa' }}>
            {`${company} - ${site}`}
          </Paragraph>

          <View style={styles.layout}>
            {signature?.isFailed ? <Drawing xml={emptyDrawing} height="200" /> : null}
            {signature?.uri
              ? (
                <Surface style={styles.surface}>
                  <Image source={signature} style={styles.signature} />
                </Surface>
              )
              : <ActivityIndicatorView color={colors.primary} light /> }
          </View>
        </Card.Content>
        <Card.Actions style={[styles.actions, { flexDirection: isDesktopOrLaptop ? 'row' : 'column' }]}>
          <Button onPress={() => setVisible(true)} mode="contained" style={styles.button} icon="account-edit">Edit</Button>
          <Button onPress={handleSubmit} disabled={isEmpty} mode="outlined" style={[styles.button, { borderColor: colors.primary }]} icon="send">Submit</Button>
        </Card.Actions>
      </Card>
      {/* this to be animated */}
      <Card>
        <Card.Content>
          <TextInput label="First name" value={firstName} onChangeText={(val) => updateAccountData({ firstName: val })} />
          <TextInput label="Last name" value={lastName} onChangeText={(val) => updateAccountData({ lastName: val })} />
          <TextInput label="Company" value={company} onChangeText={(val) => updateAccountData({ company: val })} />
          <TextInput label="Site" value={site} onChangeText={(val) => updateAccountData({ site: val })} />
          <Signature visible={visible} onSave={handleSave} />
        </Card.Content>
        <Card.Actions>
          <Button onPress={() => setVisible(true)}>Edit Signature</Button>
          <Button onPress={handleSubmit} disabled={isEmpty}>Submit</Button>
        </Card.Actions>
      </Card>
    </SafeAreaView>
  );
}
