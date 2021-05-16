function downloadChain() {
    var params = new URLSearchParams(window.location.search);
    var filename = params.get("open");

    $.ajax({
        url: `data/${filename}.json`,
        dataType: "text"
    }).done(content => {
        // Get filename based on folder name
        // url = window.location.href; 
        // if(url[url.length-1]==='/') url = url.substr(0, url.length-1); 
        // lastSlash = url.lastIndexOf("/"); 
        // filename = url.substr(lastSlash+1)
        downloadByContent(content, filename); // will popup the download
    }) // ajax
} // downloadChain

function downloadByContent(data, fileName, type="text/plain") {
// Create an invisible A element
const a = document.createElement("a");
a.style.display = "none";
document.body.appendChild(a);

// Set the HREF to a Blob representation of the data to be downloaded
a.href = window.URL.createObjectURL(
    new Blob([data], { type })
);

// Use download attribute to set set desired file name
a.setAttribute("download", fileName);

// Trigger the download by simulating click
a.click();

// Cleanup
window.URL.revokeObjectURL(a.href);
document.body.removeChild(a);
} // downloadByContent