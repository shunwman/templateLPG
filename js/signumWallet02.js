let walletListener = null;
const Networks = {
  MainNet: 'Signum',
  TestNet: 'Signum-TESTNET'
}

window.wallet = new sig$wallets.GenericExtensionWallet()
window.walletConnection = null
window.signumLedger = null
window.network = Networks.MainNet

function getReedSolomonAddress(publicKey) {
  return sig$.Address.fromPublicKey(publicKey, window.network === Networks.MainNet ? 'S' : 'TS').getReedSolomonAddress()
}

function createLedgerClient(nodeHost){
  window.signumLedger = sig$.LedgerClientFactory.createClient({
    nodeHost
  })
}


function dispatchWalletEvent(action, data){
  window.dispatchEvent(new CustomEvent('wallet-event', {detail: {
    action,
      payload: {...data}
    }}))
}

function onNetworkChange(args) {
  dispatchWalletEvent('networkChanged', {...args})
  if (args.networkName === window.network) {
    if (!window.walletConnection) {
      window.dispatchEvent(new Event("wallet-connect"));
    } else{
      createLedgerClient(args.nodeHost)
    }
  } else {
    Swal.fire({
      icon: "warning",
      title: "xt-Wallet 錢包變更到另一個節點",
      confirmButtonColor: "#b49b6a",
        cancelButtonColor: "#b6babe",
    });
    alert("Wallet changed to another network")
    window.dispatchEvent(new Event("wallet-disconnect"));
  }
}

function onAccountChange(args) {
  
  dispatchWalletEvent('accountChanged', {
    ...args,
    address: getReedSolomonAddress(args.accountPublicKey)
  })
}

function onPermissionOrAccountRemoval() {
  dispatchWalletEvent('permissionRemoved', {...args})
  Swal.fire({
    icon: "warning",
    title: "xt-wallet `移除此 DApps 權限",
    confirmButtonColor: "#b49b6a",
        cancelButtonColor: "#b6babe",
  });
  document.getElementById('xt-wallet').innerHTML = `<div id="P1_hvQIFrP" class="Container-P1_hvQIFrP">
                                        <div id="-i_o19aYCj" class="arial Text--i_o19aYCj">連接區塊鏈會員系統</div>
                                    </div>`
  // alert("Wallet removed this DApps permission")
  handleDisconnectWallet();
}



async function handleConnectWallet(appName) {
  if (window.walletConnection) return;
  document.getElementById('xt-wallet').innerHTML = `<div id="P1_hvQIFrP" class="Container-P1_hvQIFrP"><div id="-i_o19aYCj" class="arial Text--i_o19aYCj"><span class="spinner-grow spinner-grow-sm" aria-hidden="true"></span>
  <span role="status">Loading...</span></div></div>`;
  try {
    const connection = await window.wallet.connect({
      appName,
      networkName: Networks.MainNet
    })

    if (walletListener) {
      walletListener.unlisten();
    }

    walletListener = connection.listen({
      onNetworkChanged: onNetworkChange,
      onAccountChanged: onAccountChange,
      onPermissionRemoved: onPermissionOrAccountRemoval,
      onAccountRemoved: onPermissionOrAccountRemoval,
    });

   
    window.walletConnection = connection;
    createLedgerClient(connection.currentNodeHost)
    dispatchWalletEvent('connected', {
      accountId: connection.accountId,
      publicKey: connection.publicKey,
      address: getReedSolomonAddress(connection.publicKey), // attention: address is not part of the connection!
      host: connection.currentNodeHost
    })


  } catch (e) {
    // alert(e.message)
  
    if (e.message === "Could not find a compatible wallet"){
      Swal.fire({
        title: "找不到xt-wallet",
        text: "您可以在 chrome web store 上安裝 XT-wallet",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#b49b6a",
        cancelButtonColor: "#b6babe",
        confirmButtonText: "進入 chrome web store"
      }).then((result) => {
        if (result.isConfirmed) {
          window.open("https://chromewebstore.google.com/detail/signum-xt-wallet/kdgponmicjmjiejhifbjgembdcaclcib", '_blank').focus();
        }
      });
      document.getElementById('xt-wallet').innerHTML = `<div id="P1_hvQIFrP" class="Container-P1_hvQIFrP">
                                        <div id="-i_o19aYCj" class="arial Text--i_o19aYCj">連接區塊鏈會員系統</div>
                                    </div>`
    }else{
      if (e.message === `The selected network/node of the wallet does not match the applications required network. Please select another network/node in your wallet`){
        console.log("same");
        Swal.fire({
          icon: "warning",
          text: "xt-wallet 所選的網路/節點與應用程式所需的網路不匹配。請在 xt-wallet 中選擇其他網路/節點",
          confirmButtonColor: "#b49b6a",
          cancelButtonColor: "#b6babe",
        });
      }else{
      Swal.fire({
        icon: "warning",
        text: `錯誤發生： ${e.message}`,
        confirmButtonColor: "#b49b6a",
        cancelButtonColor: "#b6babe",
      });
    }
      document.getElementById('xt-wallet').innerHTML = `<div id="P1_hvQIFrP" class="Container-P1_hvQIFrP">
                                        <div id="-i_o19aYCj" class="arial Text--i_o19aYCj">連接區塊鏈會員系統</div>
                                    </div>`
    }
  
    localStorage.removeItem("walletConnected");
  }
}

async function handleDisconnectWallet() {
  window.wallet = new sig$wallets.GenericExtensionWallet();
  window.walletConnection = null;
  window.signumLedger = null;
  dispatchWalletEvent('disconnected')
  walletListener.unlisten();
}

async function initWallet(appName) {
  window.addEventListener("wallet-connect", handleConnectWallet.bind(null, appName));
  window.addEventListener("wallet-disconnect", handleDisconnectWallet);
  
 
}

initWallet('寶龍木業')
