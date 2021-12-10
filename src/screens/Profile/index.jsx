import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useHeaderHeight } from '@react-navigation/elements';
import jwtDecode from 'jwt-decode';
import { useDispatch, useSelector, useStore } from 'react-redux';

import { config, getUserSignature, setUserSignature, selectAllUser } from '@monkvision/corejs';

import Signature from 'components/Signature';

export default function Profile() {
  const store = useStore();
  const dispatch = useDispatch();
  const headerHeight = useHeaderHeight();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [company, setCompany] = useState('');
  const [site, setSite] = useState('');
  const [signature, setSignature] = useState(null);
  const [visible, setVisible] = useState(false);
  const user = useSelector(selectAllUser);

  useEffect(() => {
    if (user && user[0]?.signature) {
      const reader = new FileReader();
      reader.onload = () => {
        setSignature({ uri: reader.result });
      };
      reader.readAsDataURL(user[0]?.signature);
    }
  }, [user]);

  const styles = StyleSheet.create({
    form: { width: '80%',
      height: Dimensions.get('window').height - headerHeight,
      alignSelf: 'center',
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    inputs: {
      width: '100%',
      height: 400,
      justifyContent: 'space-around',
    },
    signature: {
      width: 300,
      height: 300,
      borderWidth: 1,
      borderColor: '#00000048',
    },
    element: {
      width: '100%',
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

  React.useEffect(() => {
    const id = jwtDecode(store.getState().auth.accessToken).sub;
    dispatch(getUserSignature({ id, params: { return_image: true } }));
  }, [dispatch, store]);

  return (
    <ScrollView>
      {!visible
        && (
          <View style={styles.form}>
            <View style={styles.inputs}>
              <TextInput label="First name" value={firstName} onChangeText={setFirstName} />
              <TextInput label="Last name" value={lastName} onChangeText={setLastName} />
              <TextInput label="Company" value={company} onChangeText={setCompany} />
              <TextInput label="Site" value={site} onChangeText={setSite} />
              <Button mode="outlined" onPress={() => setVisible(true)}>Edit Signature</Button>
            </View>
            {signature && <Image source={signature} style={styles.signature} />}
            <Button mode="contained" onPress={handleSubmit} style={styles.element} disabled={isEmpty}>Submit</Button>
          </View>
        )}
      <Signature visible={visible} onSave={handleSave} />
    </ScrollView>
  );
}
