function downloadChain() {
    var params = new URLSearchParams(window.location.search);
    var oriFilename = params.get("open");

    /** 
        @subprocess
        url is what's currently saved
    */
    $.ajax({
        url: `data/${oriFilename}.json`,
        dataType: "text"
    }).done(content => {
        // Get oriFilename based on folder name
        // url = window.location.href; 
        // if(url[url.length-1]==='/') url = url.substr(0, url.length-1); 
        // lastSlash = url.lastIndexOf("/"); 
        // oriFilename = url.substr(lastSlash+1)
        downloadByContent(content, oriFilename); // will popup the download
    }) // ajax
} // downloadChain

function downloadByContent(data, oriFilename, type="text/plain") {
// Create an invisible A element
const a = document.createElement("a");
a.style.display = "none";
document.body.appendChild(a);

// Set the HREF to a Blob representation of the data to be downloaded
a.href = window.URL.createObjectURL(
    new Blob([data], { type })
);

// Use download attribute to set set desired file name

let today = ((myDate) => { return `${String(myDate.getMonth()+1).padStart(2, "0")}-${String(myDate.getDate()).padStart(2, "0")}-${myDate.getFullYear()}`;  })(new Date());
let newFilename = `backup-${today}__persist-tally-${oriFilename}.json`;
a.setAttribute("download", newFilename);

// Trigger the download by simulating click
a.click();

// Cleanup
window.URL.revokeObjectURL(a.href);
document.body.removeChild(a);
} // downloadByContent