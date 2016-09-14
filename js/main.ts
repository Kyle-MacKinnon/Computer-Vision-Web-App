
/// <reference path="C:\Users\Kyle MacKinnon\Desktop\Module 2\Steam-Web-App\typings\globals\jquery\index.d.ts" />

/* 
    Image file submission 
*/
 $('#image_selection_form').submit(

    function( event : Event ) : void {

        // Stop page refresh after form submission
        event.preventDefault();

        // Hide selection submission
        $("#image_selection_submit_column").hide();

        // Hide the old description if there was one
        $("#image_description_container").hide();

        // Show loading message
        $("#image_descrption_load_container").show();

        // Get image file
        var file : File = (<HTMLInputElement> this[0]).files[0];
        
        // Parameters for the POST request
        var params = {
            "visualFeatures": "Categories, Tags, Description, Faces, ImageType, Color",
            "details": "Celebrities",
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
        }

        // Make request
        $.ajax(settings)

        // Request finished successfully
        .done(function (data) : void {
            if (data.length != 0)   { describeImage(data); } 
            else                    { alert("Found nothing."); }
        })

        // There was an error with the request
        .fail(function (error : Error) : void { alert("Request failed. Possibly too many requests? Try wait a little bit."); });
    }
);

/*
    Image file description
*/
function describeImage(data) : void {

    $("#image_descrption_load_container").hide();
    $("#image_description_container").show();

    $("#desc_sentence").empty();

    // Make the description look more appealing
    var captionText : string = data.description.captions[0].text;
    captionText = captionText.charAt(0).toUpperCase() + captionText.slice(1) + ".";

    $("#desc_sentence").append(captionText);

    $("#desc_table_body").empty();

    var tags : string = "";
    for (let tag of data.description.tags) {
        tags += tag;
        if(tag != data.description.tags[data.description.tags.length]) {
            tags += ", ";
        }
    }
    tags = tags.substring(0,tags.length -2)
    
    $("#desc_table_body").append("<tr><td>Confidence:</td><td>" + data.description.captions[0].confidence + "</td></tr><tr><td>Tags:</td><td>" + tags + "</td></tr>");
}

/*
    Image selection form update
*/
 $('#image_selection_form').on('change', function() : void {

    var file : File = (<HTMLInputElement> this[0]).files[0];

    $('#image_selection_label')[0].innerText = file.name;
    $('#image_selection_label').show();
    $('#image_selection_submit').show();
    $('#image_selection_chosen_image').show();

    var reader = new FileReader();
    reader.onload = function (e : any) {
        $('#image_selection_chosen_image').attr("src", e.target.result);
    };
    reader.readAsDataURL(this[0].files[0]);

    $("#image_selection_submit_column").show();
});
