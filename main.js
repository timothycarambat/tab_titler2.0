chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action == "rename_tab"){
      tabName = prompt("Please Enter the Tab's new name. To remove all names from a domain type 'delete domain' while on a tab of that domain. To remove the name for a specific page, go to the page and type 'delete'. ")
      exemptions = ['delete','delete domain']

      if(tabName != null) {
        document.title = !exemptions.includes(tabName) ? tabName : document.title;
        sendResponse({tabName: tabName, location: window.location });
      }
    }
  });

  function checkForTabName(){
    var tabURL = window.location.href
    chrome.runtime.sendMessage({action: 'get_tab_name', tabURL: tabURL}, function(response) {
      if( response != undefined ){
        document.title = response.tabName
      }
    });
  }

  checkForTabName()
