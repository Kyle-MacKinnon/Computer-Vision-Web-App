/// <reference path="C:\Users\Kyle MacKinnon\Desktop\Module 2\Steam-Web-App\typings\globals\jquery\index.d.ts" />
// Submit image
$('#image_selection_form').submit(function (event) {
    // Stop page refresh after form submission
    event.preventDefault();
    // Get image file
    var file = this[0].files[0];
    // Setup request
    var settings = {
        url: "https://api.projectoxford.ai/vision/v1.0/analyze",
        beforeSend: function (xhrObj) {
            xhrObj.setRequestHeader("Content-Type", "application/octet-stream");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "cc5ae4826fb44527be4e0c96cfb951b5");
        },
        type: "POST",
        data: file,
        processData: false
    };
    // Make request
    $.ajax(settings)
        .done(function (data) {
        if (data.length != 0) {
            describeImage(data);
        }
        else {
            alert("Found nothing.");
        }
    })
        .fail(function (error) { alert("Request failed. Possibly too many requests? Try wait a little bit."); });
});
function describeImage(data) {
    alert(data);
}
$('#image_selection_form').on('change', function () {
    var file = this[0].files[0];
    $('#image_selection_label')[0].innerText = file.name;
    $('#image_selection_label').show();
    $('#image_selection_submit').show();
});
