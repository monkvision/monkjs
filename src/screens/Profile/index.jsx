import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { SafeAreaView, Image, StyleSheet, View, Animated, TouchableOpacity, Dimensions, ScrollView, Easing, Platform } from 'react-native';
import { useTheme, Surface, Button, TextInput, Card, Title, Paragraph } from 'react-native-paper';
import PropTypes from 'prop-types';
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
  editCard: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    ...Platform.select({
      web: {
        boxShadow: '0px 3px 15px 0px #BABABA',
      },
      native: {
        elevation: 22,
      },
    }),
    paddingVertical: spacing(4),
    height,
    position: 'relative',
  },
  animatedView: {
    width: '100%',
    position: 'absolute',
    zIndex: 10,
  },
  divider: {
    width: 100,
    height: 4,
    backgroundColor: 'gray',
    borderRadius: 999,
    alignSelf: 'center',
  },
  dividerLayout: {
    height: 80,
    position: 'absolute',
    width: '100%',
    top: spacing(-4),
    paddingTop: spacing(4),
    zIndex: 11,
  },
  close: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  textInput: {
    marginVertical: spacing(1),
    backgroundColor: '#FFFFFF',
  },
});

function Popup({ accountData, handleClosePopup, handleSave, showPopup }) {
  const { firstName, lastName, company, site, updateAccountData } = accountData;
  const [scrollEnabled, setScrollEnabled] = useState(true);

  const signatureRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (showPopup) { scrollRef.current.scrollTo({ x: 0, y: 0, animated: false }); }
  }, [showPopup]);

  return (

    <Card style={styles.editCard}>
      <TouchableOpacity
        style={styles.dividerLayout}
        onPress={handleClosePopup}
      >
        <View style={styles.divider} />
      </TouchableOpacity>
      <Card.Title title="Edit account data" />

      <ScrollView scrollEnabled={scrollEnabled} ref={scrollRef}>
        <View style={{ height: 900 }}>
          <Card.Content>
            <TextInput style={styles.textInput} label="First name" value={firstName} onChangeText={(val) => updateAccountData({ firstName: val })} />
            <TextInput style={styles.textInput} label="Last name" value={lastName} onChangeText={(val) => updateAccountData({ lastName: val })} />
            <TextInput style={styles.textInput} label="Company" value={company} onChangeText={(val) => updateAccountData({ company: val })} />
            <TextInput style={styles.textInput} label="Site" value={site} onChangeText={(val) => updateAccountData({ site: val })} />
            <Title style={{ marginVertical: spacing(1) }}>
              Edit your signature
            </Title>
            <Signature
              visible
              setScrollEnabled={setScrollEnabled}
              ref={signatureRef}
            />
          </Card.Content>
          <Card.Actions style={styles.actions}>
            <Button
              onPress={() => handleSave(signatureRef.current.getUri())}
              mode="outlined"
              style={[styles.button, { alignSelf: 'center' }]}
              icon="content-save"
            >
              Save
            </Button>
          </Card.Actions>
        </View>
      </ScrollView>
    </Card>
  );
}

Popup.propTypes = {
  accountData: PropTypes.shape({
    company: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    signature: PropTypes.shape({
      isFailed: PropTypes.bool,
      uri: PropTypes.string,
    }),
    site: PropTypes.string,
    updateAccountData: PropTypes.func,
  }).isRequired,
  handleClosePopup: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  showPopup: PropTypes.bool.isRequired,
};

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
  const [showPopup, togglePopup] = useState(false);
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

  const translateY = useRef(new Animated.Value(height)).current;

  const handleOpenPopup = useCallback(() => {
    togglePopup(true);
    Animated.spring(translateY, { duration: 150, ease: Easing.ease, toValue: 50, useNativeDriver: Platform.OS !== 'web' })
      .start();
  }, [translateY]);

  const handleClosePopup = useCallback(() => {
    Animated.timing(translateY, { duration: 150, ease: Easing.ease, toValue: height, useNativeDriver: Platform.OS !== 'web' })
      .start(() => togglePopup(false));
  }, [translateY]);

  const handleSave = useCallback((uri) => {
    updateAccountData({ signature: { isLoading: false, isFailed: false, uri } });
    handleClosePopup();
  }, [handleClosePopup, updateAccountData]);

  useEffect(() => {
    const id = jwtDecode(store.getState().auth.accessToken).sub;
    dispatch(getUserSignature({ id, params: { return_image: true } }));
  }, [dispatch, store]);

  return (
    <SafeAreaView style={styles.root}>
      <Card style={styles.card}>
        <View>
          <Card.Content>
            <Title style={{ textAlign: 'center' }}>
              {`${firstName}  ${lastName}`}
            </Title>
            <Paragraph style={{ textAlign: 'center', color: '#aaaaaa' }}>
              {`${company} - ${site}`}
            </Paragraph>

            <View style={styles.layout}>
              {signature?.isFailed ? <Drawing xml={emptyDrawing} height="200" /> : null}
              <Surface style={styles.surface}>
                {signature?.uri
                  ? (
                    <Image source={signature} style={styles.signature} />
                  )
                  : <ActivityIndicatorView color={colors.primary} light /> }
              </Surface>
            </View>
          </Card.Content>
          <Card.Actions style={[styles.actions, { flexDirection: isDesktopOrLaptop ? 'row' : 'column' }]}>
            <Button
              onPress={handleOpenPopup}
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
      <Animated.View
        style={
          [styles.animatedView, { transform: [{ translateY }], display: showPopup ? 'flex' : 'none' }]
}
      >
        <Popup
          showPopup={showPopup}
          accountData={{ ...accountData, updateAccountData }}
          handleClosePopup={handleClosePopup}
          handleSave={handleSave}
        />
      </Animated.View>
    </SafeAreaView>
  );
}
