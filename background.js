// On Load get all entries
ENTRIES = {}
syncEntries()


chrome.commands.onCommand.addListener(function (command) {
    if (command === "rename_tab") {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "rename_tab"}, function(response) {
          handleResponse(response)
        });
      });
    }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action == "get_tab_name"){
        var tabName = getTabName(request.tabURL)
        if( tabName != undefined ){
          sendResponse({tabName: tabName});
        }
    }else if (request.action == 'get_all_entries') {
      sendResponse({entries: ENTRIES});
    }else if (request.action == 'delete_entry') {
      handleResponse(request)
    }else if (request.action == 'add_entry') {
      saveData(request)
    }
      return true
  });

  // Perform a reload any time the user saves a tab
  chrome.storage.onChanged.addListener(function(changes, namespace) {
    syncEntries()
  });


function syncEntries() {
  chrome.storage.sync.get(function(results){getEntries(results)})
}
function getEntries(results) {
  ENTRIES = results
}

function handleResponse(data) {
  syncEntries()

  if( data.tabName == 'delete domain') {
    deleteDomain(data.location.host)
  }else if (data.tabName == 'delete') {
    deletePage(data.location.href)
  }else {
    saveData(data)
  }

  showCurrentStorage()
  return true
}

function deleteDomain(host) {
  let removedKeys = []
  let tabNames = Object.keys(ENTRIES)

  //dont continue if there are no saved entries
  if (tabNames.length == 0){ return true }

  // iterate over saved keys and place them on array
  Object.keys(ENTRIES).map((key) => {
    if(key.includes(host)){
      removedKeys.push(key)
    }
  })

  chrome.storage.sync.remove(removedKeys, function() {
    console.log("Following Tab Names Removed:")
    console.log(removedKeys)
  })
}

function deletePage(page) {
  chrome.storage.sync.remove(page, function() {
    console.log(`Page ${page} removed from tabNames`)
  })
}

function saveData(data) {
  var obj = {}
  obj[data.location.href] = data.tabName
  chrome.storage.sync.set(obj, function() {
          console.log(`record saved for ${data.location.href}`);
  });
}

function getTabName(key) {
  return ENTRIES[key]
}

function showCurrentStorage() {
  console.log("Current Storage:")
  chrome.storage.sync.get(function(result){console.log(result)})
}
