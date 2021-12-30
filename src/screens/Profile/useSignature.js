import { useCallback, useEffect } from 'react';
import { useStore, useSelector, useDispatch } from 'react-redux';
import jwtDecode from 'jwt-decode';
import { config, setUserSignature, selectAllUser } from '@monkvision/corejs';
import { Platform } from 'react-native';

export default function useSignature({ signature, updateAccountData, handleCloseDrawer }) {
  const store = useStore();
  const dispatch = useDispatch();
  const user = useSelector(selectAllUser);

  useEffect(() => {
    updateAccountData({ signature: { isLoading: true, uri: null } });
    if (user && user[0]?.signature) {
      const reader = new FileReader();
      reader.readAsDataURL(user[0]?.signature);
      reader.onload = () => updateAccountData({
        signature: { isLoading: false, uri: reader.result } });
      reader.onerror = () => updateAccountData({
        signature: { isLoading: false, uri: null } });
    } else {
      updateAccountData({ signature: { isLoading: false, uri: null } });
    }
  }, [updateAccountData, user]);

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

  const handleSave = useCallback((getUri) => {
    getUri().then(
      (uri) => updateAccountData({ signature: {
        isLoading: false,
        uri: Platform.OS === 'web' ? uri : uri?.substring(1, uri.length - 1) } }),
    );
    handleCloseDrawer();
  }, [handleCloseDrawer, updateAccountData]);

  return { handleSubmit, handleSave };
}
