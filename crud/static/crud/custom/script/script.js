let table = null;

/*  ready event occurs when the DOM (document object model) has been loaded.
    It tells the browser to wait for all the HTML to be rendered before executing the code.
*/
$(document).ready(function() {
    // add date sorting for "Mon date, Year" & "Mon Year" formats
    $.fn.dataTable.moment( ['ll', 'MMM, YYYY'] );

    // initialize datatable
    table = $('#table_id').DataTable( {
        // Disable ordering on columns which have a class of 'nosort'
        "columnDefs": [ {
            "targets": 'nosort',
            "orderable": false
        }],

        // Change values of show entries & set the dafault length of items per page
        "aLengthMenu": [[5, 10, 20, -1], [5, 10, 20, "All"]],
        "pageLength": 5,

        /* --- hide controls --- */
        //"lengthChange": false,    // hide show x entries select 
        //"filter": false,          // hide filter (search) control
        //"ordering": false,        // hide the sorting icon
        //"info": false,            // hide showing x to y of z entries info
        //"paging": false,          // hide pagination + show x entries

        // change label for controls
        "oLanguage": {
            "sLengthMenu": "Entries per page _MENU_",
            "sSearch": "",
        },
    } );

    // Add placeholder to search (filter) input & change size
    $('.dataTables_filter input[type="search"]').
    attr("placeholder", "seach record").
    css({'width':'350px','display':'inline-block'});
})


/* $(function(){}); - jQuery shortcut for ready event */
$(function(){
    /* hooking into the click event of the element with class "js-create" (Add New Record) button */
    $(".js-create").click(function(){
        /* When the user clicks "js-create" button, 
            this anonymous function with the $.ajax call will be executed */
        $.ajax({
            url: 'product/create/',     // the resource wanted is in this path
            type: 'get',                // request data using the HTTP GET method
            dataType: 'json',           // receive the data in JSON format
            // open the Bootstrap Modal before the Ajax request starts.
            beforeSend: function(){
                $("#modal").modal("show");
            },
            // after receiving data, render the partial form defined to partial_product_form.html
            success: function(data){
                $("#modal .modal-content").html(data.html_form)
            }
        });
    })
});


/* hook on the create-form submit event */
/*
    The element with class ".js-create-form" didn’t exist on the initial page load of the template. 
    Thus, we can’t register a listener to an element that doesn’t exists. 
    So, we need to until the modal pops up.
*/
$('#modal').on("submit", ".js-create-form", function(){
    // this = element with class "js-create-form"
    var form = $(this);
    $.ajax({
        url: form.attr('action'),
        // serializing all the data from the form, and posting it to the server
        data: form.serialize(),
        type: form.attr('method'),
        dataType: 'json',
        success: function(data){
            if(data.form_is_valid) {
                appendToTable(data.obj);
            }
            $("#modal .modal-content").html(data.html_form);
        }
    });
    return false;
    /* NB: At the end of the function return false. 
    That’s because we are capturing the form submission event. 
    So to avoid the browser to perform a full HTTP POST to the server, 
    we cancel the default behavior returning false in the function. */
});


/* append new data to table */
function appendToTable(obj) {
    let rowCount = table.rows().count();
    table.row.add([
        rowCount+1,
        obj['fields']['product_code'],
        obj['fields']['name'], 
        obj['fields']['category'], 
        obj['fields']['price'],
        obj['fields']['quantity'], 
        obj['fields']['date_added'], 
        `<btn class="btn btn-warning btn-sm mb-1" onClick=updateRecord(${obj["pk"]})>
            <i class="fas fa-pencil-alt"></i>
            <span class="tooltiptext">Edit</span>
        </btn>
        <btn class="btn btn-danger btn-sm mb-1" onClick=deleteRecord(${obj["pk"]})>
            <i class="fas fa-trash"></i>
            <span class="tooltiptext">Remove</span>
        </btn>`,
    ]).node().id = `product-${obj['pk']}`;
    table.draw(false);
}


/* hooking into the click event of the element with onClick "updateRecord" attribute */
function updateRecord(pk) {
    $.ajax({
        url: `product/${pk}/update/`, 
        type: 'get',
        dataType: 'json',
        beforeSend: function(){
            $("#modal").modal("show");
        }, 
        success: function(data){
            $("#modal .modal-content").html(data.html_form);
        }
    });
}


/* hook on the create-form submit event (i.e. After update form is submitted) */
$('#modal').on("submit", ".js-update-form", function(){
    var form = $(this);
    $.ajax({
        url: form.attr('action'),
        data: form.serialize(),
        type: form.attr('method'),
        dataType: 'json',
        success: function(data){
            if(data.form_is_valid) {
                if(data.form_has_changed){
                    updateInTable(data.obj);
                }
                else {
                    $("#modal").modal("hide");
                }
            }
            $("#modal .modal-content").html(data.html_form);
        }
    });
    return false;
});


/* update table with new data */
function updateInTable(obj) {
    let targetRow = table.row(`#product-${obj['pk']}`);
    targetRow.data([
        targetRow.data()[0],
        obj['fields']['product_code'],
        obj['fields']['name'], 
        obj['fields']['category'], 
        obj['fields']['price'],
        obj['fields']['quantity'], 
        obj['fields']['date_added'],  
        `<btn class="btn btn-warning btn-sm mb-1" onClick=updateRecord(${obj["pk"]})>
            <i class="fas fa-pencil-alt"></i>
            <span class="tooltiptext">Edit</span>
        </btn>
        <btn class="btn btn-danger btn-sm mb-1" onClick=deleteRecord(${obj["pk"]})>
            <i class="fas fa-trash"></i>
            <span class="tooltiptext">Remove</span>
        </btn>`,
    ]);
}


/* hooking into the click event of the element with onClick "deleteRecord" attribute */
function deleteRecord(pk) {
    $.ajax({
        url: `product/${pk}/delete/`, 
        type: 'get',
        dataType: 'json',
        beforeSend: function(){
            $("#modal").modal("show");
        }, 
        success: function(data){
            $("#modal .modal-content").html(data.html_form);
        }
    });
}


/* After delete form is submitted */
$('#modal').on("submit", ".js-delete-form", function(){
    var form = $(this);
    $.ajax({
        url: form.attr('action'),
        data: form.serialize(),
        type: form.attr('method'),
        dataType: 'json',
        success: function(data){
            deleteInTable(data.obj_id);
            $("#modal").modal("hide");
        }
    });
    return false;
});


/* delete record from table */
function deleteInTable(obj_id) {
    let targetRow = table.row(`#product-${obj_id}`);
    targetRow.remove().draw();
}


/* don't display alert-msg when input field is focused */
$('#modal').on("focus", "input", function(){
    let alertMsg = document.querySelector('.alert');
    if (alertMsg) {
        alertMsg.style.display = 'none';
    }
});


/* ===== Summary of the functions ===== */
// 1. Initialize DataTable
// 2. Invoke create form
// 3. Handle create form submission
// 4. Append row with new data to table
// 5. Invoke update form
// 6. Handle update form submission
// 7. Update row with changed data
// 8. Invoke delete form
// 9. Handle delete form submission
// 10. Delete row containing data from table
