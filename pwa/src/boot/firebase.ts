import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { boot } from 'quasar/wrappers';
import { useAppStore } from 'src/stores/app';
import { useUserStore } from 'src/stores/user';
import { setUpPush } from 'src/utils/MessagingHelper';

export default boot(({ router, store }) => {
  initializeApp({
    apiKey: 'AIzaSyCCzyfAlA2hdheQ0k-K8PKUEspLFjiLif0',
    authDomain: 'dhbw-studicar.firebaseapp.com',
    databaseURL: 'https://dhbw-studicar.firebaseio.com',
    projectId: 'dhbw-studicar',
    storageBucket: 'dhbw-studicar.appspot.com',
    messagingSenderId: '640124338592',
    appId: '1:640124338592:web:98c919b490bd03134fa4c5',
    measurementId: 'G-X6BY2RXNBH',
  });

  // Register the Firebase authentication listener
  const userStore = useUserStore(store);
  const appStore = useAppStore(store);
  onAuthStateChanged(getAuth(), (user) => {
    if (user) {
      if (userStore.loggedIn)
        if (appStore.nextPage) {
          router.replace({ path: appStore.nextPage });
          appStore.resetWantedPage();
        } else router.replace({ name: 'marketplace' });
      else {
        userStore.loadDataFromSignedInUser(user.uid).then(() => {
          if (appStore.nextPage) {
            router.replace({ path: appStore.nextPage });
            appStore.resetWantedPage();
          } else router.replace({ name: 'marketplace' });
          setUpPush(user.uid);
        });
      }
    } else {
      // Signed out.
      if (userStore.loggedIn) userStore.$reset();
    }
  });
});
