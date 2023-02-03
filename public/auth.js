$(document).ready(function () {
    var islogin = Cookies.get('login')
    if (islogin !== undefined) {
        if (islogin == 'true') {
            swScreen2()
        }
    }
    else {
        swScreen1()
    }
});


$("button#login").click(function () {
    var username = $("input#username").val();
    var password = $("input#password").val();
    if ((username == "thanhgiau") && (password == "123456789")) {
        swScreen2()
        Cookies.set('login', 'true', { expires: 1, secure: true })
    } else {
        $("#alert").text("Đăng nhập thất bại")
        setTimeout(function () {
            $("#alert").text("")
        }, 5000)
    }
})

$("button#logout").click(function () {
    swScreen1()
    Cookies.remove('login')

})

function swScreen1() {
    $("#screen2").addClass("notlogin");
    $("#screen1").removeClass("login");
}
function swScreen2() {
    $("#screen2").removeClass("notlogin");
    $("#screen1").addClass("login");
}