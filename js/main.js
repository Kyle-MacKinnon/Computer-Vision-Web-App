/// <reference path="C:\Users\Kyle MacKinnon\Desktop\Module 2\Steam-Web-App\typings\globals\jquery\index.d.ts" />
/*
    Image file submission
*/
$('#image_selection_form').submit(function (event) {
    // Stop page refresh after form submission
    event.preventDefault();
    // Hide selection submission
    $("#image_selection_submit_column").hide();
    // Hide the old description if there was one
    $("#description_container").hide();
    // Show loading message
    $("#load_container").show();
    // Get image file
    var file = this[0].files[0];
    // Parameters for the POST request
    var params = {
        "visualFeatures": "Categories, Tags, Description, Faces, ImageType, Color",
        "details": "Celebrities"
    };
    // Setup request
    var settings = {
        url: "https://api.projectoxford.ai/vision/v1.0/analyze?" + $.param(params),
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
/*
    Image file description
*/
function describeImage(data) {
    $("#load_container").hide();
    descriptionTable(data);
    categoriesTable(data);
}
function descriptionTable(data) {
    $("#description_container").show();
    $("#desc_sentence").empty();
    // Make the description look more appealing
    var captionText = data.description.captions[0].text;
    captionText = captionText.charAt(0).toUpperCase() + captionText.slice(1) + ".";
    $("#desc_sentence").append(captionText);
    $("#desc_table_body").empty();
    var tags = listToString(data.description.tags);
    $("#desc_table_body").append("<tr><td>Confidence</td><td>" + Math.round(data.description.captions[0].confidence * 100) + "%" + "</td></tr><tr><td>Tags</td><td>" + tags + "</td></tr>");
}
function categoriesTable(data) {
    $("#categories_container").show();
    $("#categories_table_body").empty();
    var categories = data.categories;
    for (var _i = 0, categories_1 = categories; _i < categories_1.length; _i++) {
        var item = categories_1[_i];
        $("#categories_table_body").append("<tr><td>" + item.name.slice(0, item.name.length - 1) + "</td><td>" + Math.round(item.score * 100) + "%" + "</td></tr>");
    }
}
function listToString(myList) {
    var myString = "";
    for (var _i = 0, myList_1 = myList; _i < myList_1.length; _i++) {
        var item = myList_1[_i];
        myString += item;
        if (item != myList[myList.length]) {
            myString += ", ";
        }
    }
    myString = myString.substring(0, myString.length - 2);
    return myString;
}
/*
    Image selection form update
*/
$('#image_selection_form').on('change', function () {
    var file = this[0].files[0];
    $('#image_selection_label')[0].innerText = file.name;
    $('#image_selection_label').show();
    $('#image_selection_submit').show();
    $('#image_selection_chosen_image').show();
    var reader = new FileReader();
    reader.onload = function (e) {
        $('#image_selection_chosen_image').attr("src", e.target.result);
    };
    reader.readAsDataURL(this[0].files[0]);
    $("#image_selection_submit_column").show();
});
