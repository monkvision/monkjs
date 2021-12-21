import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { SafeAreaView, Image, ScrollView, StyleSheet } from 'react-native';
import { Button, TextInput, Card } from 'react-native-paper';

import jwtDecode from 'jwt-decode';

import { useDispatch, useSelector, useStore } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import { config, getUserSignature, setUserSignature, selectAllUser } from '@monkvision/corejs';

import useAuth from 'hooks/useAuth';
import Signature from 'components/Signature';

export default function Profile() {
  const { signOut } = useAuth();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const store = useStore();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [company, setCompany] = useState('');
  const [site, setSite] = useState('');
  const [signature, setSignature] = useState(null);
  const [visible, setVisible] = useState(false);
  const user = useSelector(selectAllUser);

  const handleSignOut = useCallback(signOut, [signOut]);

  useEffect(() => {
    if (user && user[0]?.signature) {
      const reader = new FileReader();
      reader.onload = () => {
        setSignature({ uri: reader.result });
      };
      reader.readAsDataURL(user[0]?.signature);
    }
  }, [user]);

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

  const styles = StyleSheet.create({
    signature: {
      width: 300,
      height: 300,
      borderWidth: 1,
      borderColor: '#00000048',
    },
  });

  const isEmpty = useMemo(() => !firstName || !lastName || !company || !site || !signature,
    [company, firstName, lastName, signature, site]);

  const handleSave = (image) => {
    setSignature(image);
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
      <ScrollView>
        <Card>
          <Card.Title title={`${firstName} ${lastName}`} subtitle={`${company} ${site}`} />
          <Card.Content>
            <TextInput label="First name" value={firstName} onChangeText={setFirstName} />
            <TextInput label="Last name" value={lastName} onChangeText={setLastName} />
            <TextInput label="Company" value={company} onChangeText={setCompany} />
            <TextInput label="Site" value={site} onChangeText={setSite} />
            {signature && <Image source={signature} style={styles.signature} />}
          </Card.Content>
          <Card.Actions>
            <Button onPress={() => setVisible(true)}>Edit Signature</Button>
            <Button onPress={handleSubmit} disabled={isEmpty}>Submit</Button>
          </Card.Actions>
        </Card>
        <Signature visible={visible} onSave={handleSave} />
      </ScrollView>
    </SafeAreaView>
  );
}
