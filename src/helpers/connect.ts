import Wallet, { AddressPurpose } from 'sats-connect';

export const ConnectWalletSats = async() => {

    const data = await Wallet.request('getAccounts', { purposes: [AddressPurpose.Ordinals,AddressPurpose.Stacks,AddressPurpose.Payment]});
    console.log(data);
    
};


export default ConnectWalletSats;