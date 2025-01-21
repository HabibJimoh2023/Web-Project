let icon = document.getElementById("icon");

icon.onclick = function () {
    document.body.classList.toggle("dark-theme");
    if (document.body.classList.contains("dark-theme")) {
        icon.src = "images2/Vector (8).png";
    } else {
        icon.src = "images2/Vector (6).png";
    }
}