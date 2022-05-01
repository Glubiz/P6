window.onload = function() {
    fetch('https://api.ipify.org/?format=json')
    .then(response => response.json())
    .then(json => {
        var ip = json.ip
        var port = "3033"
        document.querySelector("#IP").value = ip

        // fetch('/api/')
        console.log(json.ip)
    })
};