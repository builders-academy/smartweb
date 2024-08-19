import { showConnect, UserSession } from '@stacks/connect';

import userSession from "../app/page";
const connectWallet = ( userinfo:UserSession ) => {
    const userSession = new UserSession();

    showConnect({
        appDetails: {
            name: 'APp', 
            icon: 'next.svg',            
        },
        onFinish: () => { 
            console.log(userinfo.loadUserData());
        }
    });
};

export default connectWallet;
