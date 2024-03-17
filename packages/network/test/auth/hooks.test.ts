import { STORAGE_KEY_AUTH_TOKEN, useMonkAppParams } from '@monkvision/common';
import { useAuth0 } from '@auth0/auth0-react';
import { act, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { useAuth } from '../../src';

describe('Authentication hooks', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('useAuth hook', () => {
    it('should fetch the token from the local storage if asked to', () => {
      const token = 'test-token-test';
      const spy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => token);
      const { result, unmount } = renderHook(useAuth, { initialProps: { storeToken: true } });

      expect(useMonkAppParams).toHaveBeenCalled();
      const { setAuthToken } = (useMonkAppParams as jest.Mock).mock.results[0].value;
      expect(spy).toHaveBeenCalledWith(STORAGE_KEY_AUTH_TOKEN);
      expect(setAuthToken).toHaveBeenCalledWith(token);
      expect(result.current.authToken).toEqual(token);

      unmount();
    });

    it('should not fetch the token from the local storage if not asked to', () => {
      const spy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => 'test');
      const { result, unmount } = renderHook(useAuth, { initialProps: { storeToken: false } });

      expect(useMonkAppParams).toHaveBeenCalled();
      const { setAuthToken } = (useMonkAppParams as jest.Mock).mock.results[0].value;
      expect(setAuthToken).not.toHaveBeenCalled();
      expect(spy).not.toHaveBeenCalled();
      expect(result.current.authToken).toBeNull();

      unmount();
    });

    it('should properly set the token after the login function is called', async () => {
      const token = 'test-token-test';
      const getAccessTokenWithPopup = jest.fn(() => Promise.resolve(token));
      (useAuth0 as jest.Mock).mockImplementation(() => ({ getAccessTokenWithPopup }));
      const { result, unmount } = renderHook(useAuth, { initialProps: { storeToken: false } });

      expect(useMonkAppParams).toHaveBeenCalled();
      const { setAuthToken } = (useMonkAppParams as jest.Mock).mock.results[0].value;
      expect(setAuthToken).not.toHaveBeenCalled();
      expect(result.current.authToken).toBeNull();
      expect(getAccessTokenWithPopup).not.toHaveBeenCalled();

      let resultToken = null;
      await act(async () => {
        resultToken = await result.current.login();
      });

      expect(getAccessTokenWithPopup).toHaveBeenCalled();
      expect(resultToken).toEqual(token);
      expect(setAuthToken).toHaveBeenCalledWith(token);
      expect(result.current.authToken).toEqual(token);

      unmount();
    });

    it('should store the token in the local storage after a login if asked to', async () => {
      jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => null);
      const spy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});
      const token = 'test-token-test';
      const getAccessTokenWithPopup = jest.fn(() => Promise.resolve(token));
      (useAuth0 as jest.Mock).mockImplementation(() => ({ getAccessTokenWithPopup }));
      const { result, unmount } = renderHook(useAuth, { initialProps: { storeToken: true } });

      expect(spy).not.toHaveBeenCalled();

      await act(async () => {
        await result.current.login();
      });

      await waitFor(() => {
        expect(spy).toHaveBeenCalledWith(STORAGE_KEY_AUTH_TOKEN, token);
      });

      unmount();
    });

    it('should not store the token in the local storage after a login if not asked to', async () => {
      jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => null);
      const spy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});
      const getAccessTokenWithPopup = jest.fn(() => Promise.resolve(''));
      (useAuth0 as jest.Mock).mockImplementation(() => ({ getAccessTokenWithPopup }));
      const { result, unmount } = renderHook(useAuth, { initialProps: { storeToken: false } });

      await act(async () => {
        await result.current.login();
      });

      expect(spy).not.toHaveBeenCalled();

      unmount();
    });

    it('should properly clear the token after the logout function is called', async () => {
      const token = 'test-token-test';
      jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => token);
      const spy = jest.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {});
      const logout = jest.fn(() => Promise.resolve());
      (useAuth0 as jest.Mock).mockImplementation(() => ({ logout }));
      const { result, unmount } = renderHook(useAuth, { initialProps: { storeToken: true } });

      expect(result.current.authToken).toEqual(token);

      await act(async () => {
        await result.current.logout();
      });

      expect((useMonkAppParams as jest.Mock).mock.results.length).toBeGreaterThan(1);
      const { setAuthToken } = (useMonkAppParams as jest.Mock).mock.results[1].value;
      expect(logout).toHaveBeenCalledWith({ logoutParams: { returnTo: window.location.origin } });
      expect(result.current.authToken).toBeNull();
      expect(setAuthToken).toHaveBeenCalledWith(null);
      expect(spy).toHaveBeenCalledWith(STORAGE_KEY_AUTH_TOKEN);

      unmount();
      (useAuth0 as jest.Mock).mockRestore();
    });
  });
});
