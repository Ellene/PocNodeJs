$(document).ready(function () {
    $("button").click(function () {
        $('.team').val($(this).val());
        $('form').submit();
    });
});
