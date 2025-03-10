const pathname = window.location.pathname;
console.log("pathname: ", pathname);
async function checkNFTsOwner ()  {
   
  let vipNftsCreatorId = "12494127488416235118" //VIP data wallet
  let dataViews = [];
  let nftsOwnersLists = [];
  if (window.signumLedger){
    let nftStorages = await window.signumLedger.contract.getContractsByAccount({
      accountId: vipNftsCreatorId ,
      machineCodeHash: "15155055045342098571",
    });
   
    nftStorages = nftStorages.ats
    const promises = nftStorages.map((nftStorage) => window.signumLedger.contract.getContract(nftStorage.at))
    const results = await Promise.all(promises);

    dataViews = results.map(result => new sig$contracts.ContractDataView(result) );
    nftsOwnersLists = dataViews.map(dataView => dataView.getVariableAsDecimal(0));
   
    if (nftsOwnersLists.includes(window.walletConnection.accountId)){

     
      return true;
    }
    return false
   
  }

} 
function generateAvatarColor( ){
  const avatars = document.querySelectorAll(".avatar");

  avatars.forEach((a) => {
  const charCodeRed = a.dataset.label.charCodeAt(0);
  const charCodeGreen = a.dataset.label.charCodeAt(1) || charCodeRed;

  const red = Math.pow(charCodeRed, 7) % 200;
  const green = Math.pow(charCodeGreen, 7) % 200;
  const blue = (red + green) % 200;

  a.style.background = `rgb(${red}, ${green}, ${blue})`;
  });


}
//xt-wallet
const connectButton = document.getElementById("xt-wallet");
connectButton.addEventListener('click', () => {
  window.dispatchEvent(new Event(!window.walletConnection ? "wallet-connect" : "wallet-disconnect"));
})

window.addEventListener('wallet-event',async (event) => {
    const {payload, action} = event.detail
  if (action === 'connected') {
    const haveNftpass = await checkNFTsOwner() ;
    const userComponents = document.getElementById('profile-dropdown')
    console.log("haveNftpass: ", haveNftpass);
    if (haveNftpass || window.walletConnection.accountId === "12494127488416235118" || window.walletConnection.accountId === "14679997900395732198" || window.walletConnection.accountId === "9633927829229740965"){
      document.getElementById('xt-wallet').innerHTML = `<span class="material-symbols-outlined margin-right-5px">workspace_premium</span>${payload.address}`;                                                                                                                                                                                                                                                    
      userComponents.innerHTML =  `                    <div class="profile-dropdown0209" id="profile-dropdown">

                        <div class="profile-dropdown-btn0209" id="profile-dropdown-btn">
                            <!-- <div class="profile-img"> -->
                              <div class="avatar" data-label="${payload.address[2]+payload.address[3]}">
                        
                              <!-- </div> -->
                              <!-- <i class="fa-solid fa-circle"></i> -->
                            </div>
                        
                            <span
                              >
                              <i class="fa-solid fa-angle-down"></i>
                            </span>
                          </div>
                        
                          <ul class="profile-dropdown-list0209">
                        
                            <li class="profile-dropdown-list-item0209">
                              <a>
                                  <span class="material-symbols-outlined margin-right-5px">workspace_premium</span> ${payload.address}                          
                              </a>
                            </li>
                            <li class="profile-dropdown-list-item0209">
                              <a href="${"https://explorer.signum.network/address/"+window.walletConnection.accountId}" >
                                <i class="fa-solid fa-link"></i>
                                區塊鏈用戶資訊                           
                              </a>
                            </li>
                            <li class="profile-dropdown-list-item0209">
                              <a href="memberstore.html">
                                <i class="fa-solid fa-store"></i>
                                  會員優惠
                              </a>
                            </li>
                        
                            <li class="profile-dropdown-list-item0209">
                              <a href="https://doorgpt.vercel.app/">
                                <i class="fa-solid fa-door-closed"></i>
                                AI大門
                              </a>
                            </li>
                        
                            
                        
                         
                            <hr />
                        
                            <li class="profile-dropdown-list-item0209">
                              <a id="logout-button">
                                <i class="fa-solid fa-arrow-right-from-bracket"></i>
                                登出
                              </a>
                            </li>
                          </ul>
                      </div>`;
                
      }else {
      document.getElementById('xt-wallet').innerHTML = `${payload.address}`; 
      userComponents.innerHTML =  `                    <div class="profile-dropdown0209" id="profile-dropdown">

                        <div class="profile-dropdown-btn0209" id="profile-dropdown-btn">
                            <!-- <div class="profile-img"> -->
                              <div class="avatar" data-label="${payload.address[2]+payload.address[3]}">
                        
                              <!-- </div> -->
                              <!-- <i class="fa-solid fa-circle"></i> -->
                            </div>
                        
                            <span
                              >
                              <i class="fa-solid fa-angle-down"></i>
                            </span>
                          </div>
                        
                          <ul class="profile-dropdown-list0209">
                        
                            <li class="profile-dropdown-list-item0209">
                              <a>
                                  ${payload.address}                          
                              </a>
                            </li>
                            <li class="profile-dropdown-list-item0209">
                              <a href="${"https://explorer.signum.network/address/"+window.walletConnection.accountId}" >
                                <i class="fa-solid fa-link"></i>
                                區塊鏈用戶資訊                           
                              </a>
                            </li>
                            <li class="profile-dropdown-list-item0209">
                              <a href="memberstore.html">
                                <i class="fa-solid fa-store"></i>
                                  會員優惠
                              </a>
                            </li>
                        
                            <li class="profile-dropdown-list-item0209">
                              <a href="https://doorgpt.vercel.app/">
                                <i class="fa-solid fa-door-closed"></i>
                                AI大門
                              </a>
                            </li>
                        
                            
                        
                         
                            <hr />
                        
                            <li class="profile-dropdown-list-item0209">
                              <a id="logout-button">
                                <i class="fa-solid fa-arrow-right-from-bracket"></i>
                                登出
                              </a>
                            </li>
                          </ul>
                      </div>`;
      }
    localStorage.setItem("walletConnected", true)
  //set the user icon color
  generateAvatarColor();
  //select the profile  dropdown components and add the dropdown and logout functions
  let profileDropdownList = document.querySelector(".profile-dropdown-list0209");
  let btn = document.querySelector(".profile-dropdown-btn0209");
  let logoutBtn = document.querySelector("#logout-button");
  let classList = profileDropdownList.classList;
  btn.addEventListener("click", function (e){
    classList.toggle("active");
  })
  window.addEventListener("click", function (e) {
  if (!btn.contains(e.target)) classList.remove("active");
  });
  logoutBtn.addEventListener("click", function () {
    window.dispatchEvent(new Event("wallet-disconnect"));
    });
  connectButton.style.display = "none";
  userComponents.style.display = "inline";
  //dispatch disconnected event 
  } else if (action === 'disconnected') {
    document.getElementById('xt-wallet').innerHTML = `<div id="P1_hvQIFrP" class="Container-P1_hvQIFrP">
                                        <div id="-i_o19aYCj" class="arial Text--i_o19aYCj">連接區塊鏈會員系統</div>
                                    </div>`
   
    localStorage.removeItem("walletConnected")
    // for(let x = 0; x < membershipLink.length; x++ ){
    //   membershipLink[x].innerHTML = "";
    //   membershipLink[x].style.display = "none";
    // }
    const userComponents = document.getElementById('profile-dropdown')
    userComponents.innerHTML = "";
    connectButton.style.display = "inline";
    userComponents.style.display = "none";
   //Account changed 
  } else if (action === 'accountChanged') {
    document.getElementById('xt-wallet').innerText = "Account Changed"
    const userComponents = document.getElementById('profile-dropdown')
    userComponents.innerHTML = "";
    connectButton.style.display = "inline";
    userComponents.style.display = "none";
    
  }
  else if (action === 'permissionRemoved') {
    document.getElementById('xt-wallet').innerText = "Permission Removed"
    const userComponents = document.getElementById('profile-dropdown')
    userComponents.innerHTML = "";
    connectButton.style.display = "inline";
    userComponents.style.display = "none";
  }

})
if(localStorage.walletConnected){
    setTimeout(function(){window.dispatchEvent(new Event("wallet-connect"))}, 500);

}else {
  
    if(pathname === "/memberstore.html" || pathname.length > 20){
      const alertMessage = document.querySelector(".cid-u0QMahNPVm")
    
      alertMessage.style.display = "block";
    }
}




//google
