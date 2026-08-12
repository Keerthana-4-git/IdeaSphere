window.addEventListener("load", function () {

    setTimeout(function () {

        document.body.style.opacity = "0";

        document.body.style.transition = "opacity 0.7s ease";

        setTimeout(function () {

            window.location.href = "welcome.html";

        }, 700);

    }, 2500);

});