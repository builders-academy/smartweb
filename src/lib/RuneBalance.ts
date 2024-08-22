import PermissonRequest from '@/helpers/AddPermissons';
import  Wallet from 'sats-connect';

 async function RuneBalance() {
    const req = await PermissonRequest
    const response = await Wallet.request('runes_getBalance', null);
    if (response.status === 'success') {
    console.log(response.result);
    } else {
    console.error(response.error);
    }
}
export default RuneBalance;