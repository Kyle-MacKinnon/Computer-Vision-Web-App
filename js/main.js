/// <reference path="C:\Users\Kyle MacKinnon\Desktop\Module 2\Steam-Web-App\typings\globals\jquery\index.d.ts" />
/*
    Image file submission
*/
$('#image_selection_form').submit(function (event) {
    // Stop page refresh after form submission
    event.preventDefault();
    // Hide selection submission
    $("#image_selection_submit_column").hide();
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
    facesTable(data);
    typeTable(data);
    colorsTable(data);
}
/*
    Description Table
*/
function descriptionTable(data) {
    $("#description_container").show();
    $("#desc_sentence").empty();
    // Make the description look more appealing
    var captionText = data.description.captions[0].text;
    captionText = captionText.charAt(0).toUpperCase() + captionText.slice(1) + ".";
    $("#desc_sentence").append(captionText);
    $("#desc_table_body").empty();
    var tags = arrayToString(data.description.tags);
    $("#desc_table_body").append("<tr><td>Confidence</td><td>" + Math.round(data.description.captions[0].confidence * 100) + "%" + "</td></tr><tr><td>Tags</td><td>" + tags + "</td></tr>");
}
/*
    Categories Table
*/
function categoriesTable(data) {
    $("#categories_container").show();
    $("#categories_table_body").empty();
    var categories = data.categories;
    for (var _i = 0, categories_1 = categories; _i < categories_1.length; _i++) {
        var item = categories_1[_i];
        if (item.name.charAt(item.name.length) == '_') {
            $("#categories_table_body").append("<tr><td>" + item.name.slice(0, item.name.length - 1) + "</td><td>" + Math.round(item.score * 100) + "%" + "</td></tr>");
        }
        else {
            $("#categories_table_body").append("<tr><td>" + item.name + "</td><td>" + Math.round(item.score * 100) + "%" + "</td></tr>");
        }
    }
}
/*
    Faces Table
*/
function facesTable(data) {
    if (data.faces.length) {
        $("#faces_container").show();
        $("#faces_table_body").empty();
        var faces = data.faces;
        var count = 0;
        for (var _i = 0, faces_1 = faces; _i < faces_1.length; _i++) {
            var item = faces_1[_i];
            count++;
            $("#faces_table_body").append("<tr><td>" + count + "</td><td>" + item.age + "</td><td>" + item.gender + "</td></tr>");
        }
    }
}
/*
    Type Table
*/
function typeTable(data) {
    $("#type_container").show();
    $("#type_sentence").empty();
    var clipArt = data.imageType.clipArtType;
    var lineDrawing = data.imageType.lineDrawingType;
    var description = "";
    if (lineDrawing == 1) {
        description += "This image is a line drawing.";
    }
    else {
        if (clipArt == 0) {
            description += "This image is a photograph.";
        }
        if (clipArt == 1) {
            description += "This image might be a photograph or it might be clipart. It is ambigious.";
        }
        if (clipArt > 1) {
            description += "This image is clipart.";
        }
    }
    $('#type_sentence')[0].innerText = description;
}
/*
    Colors Table
*/
function colorsTable(data) {
    $("#colors_container").show();
    $("#colors_table_body").empty();
    $("#colors_sentence").empty();
    var color = data.color;
    $("#colors_table_body").append("<tr><td>" + color.dominantColorForeground + "</td><td>" + color.dominantColorBackground + "</td><td>" + "#" + color.accentColor + "</td></tr>");
    var dominantColors = arrayToString(color.dominantColors);
    $('#colors_sentence')[0].innerText = "Dominant colors: " + dominantColors;
}
/*
    Array to String
*/
function arrayToString(myArray) {
    var myString = "";
    for (var _i = 0, myArray_1 = myArray; _i < myArray_1.length; _i++) {
        var item = myArray_1[_i];
        myString += item;
        myString += ", ";
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
    // Hide the old info if there was some
    $("#description_container").hide();
    $("#categories_container").hide();
    $("#faces_container").hide();
    $("#type_container").hide();
    $("#colors_container").hide();
});
