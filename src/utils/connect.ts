import { showConnect, UserSession } from '@stacks/connect';

const connectWallet = (userSession: UserSession): Promise<void> => {
  return new Promise((resolve, reject) => {
    showConnect({
      appDetails: {
        name: 'My App',
        icon: 'next.svg',
      },
      onFinish: () => {
        console.log(userSession.loadUserData())
        if (userSession.isUserSignedIn()) {
          resolve(); 
        } else {
          reject('User is not signed in');
        }
      },
    });
  });
};

export default connectWallet;
