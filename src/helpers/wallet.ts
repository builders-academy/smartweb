// import {
//   Address,
//   AddressPurpose,
//   BitcoinNetworkType,
//   getAddress,
// } from "sats-connect";

// export const connectWallet = async (
//   network: BitcoinNetworkType,
//   setAddressInfo: (addresses: Address[]) => void
// ) => {
//   try {
//     getAddress({
//       payload: {
//         purposes: [
//           AddressPurpose.Stacks,
//           AddressPurpose.Payment,
//           AddressPurpose.Ordinals,
//         ],
//         message: "Smart Wallet needs your address info.",
//         network: {
//           type: network,
//         },
//       },
//       onFinish: (response) => {
//         setAddressInfo(response.addresses);
//       },
//       onCancel: () => {
//         alert("User cancelled the request");
//       },
//     });
//   } catch (error) {
//     console.error("Error connecting wallet:", error);
//   }
// };

// export const disconnectWallet = (
//   setAddressInfo: (addresses: Address[]) => void,
//   setBalanceData: (balanceData: null) => void
// ) => {
//   setAddressInfo([]);
//   setBalanceData(null);
// };

// export const fetchBalance = async (
//   stackAddress: string,
//   setBalanceData: (balanceData: any) => void
// ) => {
//   try {
//     const res = await fetch(
//       `https://api.mainnet.hiro.so/v2/accounts/${stackAddress}`
//     );
//     const data = await res.json();
//     setBalanceData(data);
//   } catch (error) {
//     console.error("Error fetching balance:", error);
//   }
// };
