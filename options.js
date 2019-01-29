$(document).ready(function(){
  $( ".add" ).click(function(event) {
    var newURL = prompt("Enter the Website address (full!) that you want to make an Alias for!", "https://...");
    var newName = prompt(`Enter the Alias for ${newURL} you want to see.`);
    addEntry(newURL, newName)
    window.location.reload()
  });
  attachHandlers()

  getAllEntries()
})
function attachHandlers() {
  $( "ul > li > a" ).click(function() {
    var aliasToRemove = $(this).parent( "li" ).data('entry')
    removeEntry(aliasToRemove)
    $(this).parent( "li" ).slideUp(200);
  });
}

function getAllEntries(){
  chrome.runtime.sendMessage({action: 'get_all_entries'}, function(response) {
    var entries = response.entries
    if (Object.keys(entries).length != 0 ){
      setRows(entries)
    } else {
      setEmptyRow()
    }
  });
}

function addEntry(url, alias) {
  // construct fake location object so we can reuse delete endpoint
  var data = {
    action: 'delete_entry',
    tabName: alias,
    location: {
      href: url
    }
  }
  chrome.runtime.sendMessage(data);
}

function removeEntry(entry) {
  // construct fake location object so we can reuse delete endpoint
  var data = {
    action: 'delete_entry',
    tabName: 'delete',
    location: {
      href: entry
    }
  }
  chrome.runtime.sendMessage(data);
}

function setRows(entries) {
  Object.keys(entries).map((alias) =>{
    var cutoff = 50
    var alias_mod = (alias.length > cutoff) ? alias.substring(0, cutoff)+"..." : alias
    var element = `
      <li data-entry='${alias}'>
        <a href='#'>
          <div class='fa fa-trash'></div>
        </a>
        <b>Site</b>: ${alias_mod} <b>Alias</b>: ${entries[alias]}
      </li>
    `
    $('ul').append(element)
  })
  attachHandlers()
}

function setEmptyRow() {
  $('ul').append("<li id='emptyRow' style='text-align: center'> <div></div> You Have No Active Aliases :( </li>")
}
