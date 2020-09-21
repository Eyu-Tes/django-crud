/*  
    jQuery shortcut to tell the browser to wait for 
    all the HTML to be rendered before executing the code 
*/
$(function(){

    /* hooking into the click event of the element with class "js-create" */
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
            // after receiving data, render the partial form defined to partial_product_create.html
            success: function(data){
                $("#modal .modal-content").html(data.html_form)
            }
        });
    })
});



/*
    The element with class ".js-create-form" didn’t exist on the initial page load of the index.html template. 
    So we can’t register a listener to an element that doesn’t exists. 
*/
$('#modal').on("submit", ".js-create-form", function(){
    var form = $(this);
    $.ajax({
        url: form.attr('action'),
        data: form.serialize(),
        type: form.attr('method'),
        dataType: 'json',
        success: function(data){
            if(data.form_is_valid) {
                appendToTable(data.obj);
                // $("#modal").modal("hide");
            }
            else {
                
            }
            $("#modal .modal-content").html(data.html_form);
        }
    });
    return false;
});

let t = $('#table_id');
console.log(t.rows.count);
function appendToTable(obj) {
    // let lastRow = document.querySelector("tbody tr:last-child");
    // let newRowCount = Number(lastRow.querySelector('td:first-child').innerHTML) + 1;
    // console.log(lastRow);

    // // true - copy node along its attributes and child nodes
    // let newRow = lastRow.cloneNode(true);
    // let tableDatas = newRow.querySelectorAll('td');

    // newRow.className = (newRowCount%2 ? "odd" : "even" );
    // tableDatas[0].innerHTML = newRowCount;
    // tableDatas[1].innerHTML = obj['product_code'];
    // tableDatas[2].innerHTML = obj['name'];
    // tableDatas[3].innerHTML = obj['category'];
    // tableDatas[4].innerHTML = obj['price'];
    // tableDatas[5].innerHTML = obj['quantity'];
    // tableDatas[4].innerHTML = obj['date_added'];
    // console.log(newRow);

    // console.log(obj.pk);
    // console.log(obj.fields.name);
    // console.log(obj.fields.product_code);
    // console.log(obj.fields.category);
    // console.log(obj.fields.price);
    // console.log(obj.fields.quatity);
    // console.log(obj.fields.date_added);

    let rowCount = t.rows.count();

    t.row.add([
        rowCount+1,
        obj['product_code'],
        obj['name'], 
        obj['category'], 
        obj['price'],
        obj['quantity'], 
        obj['date_added'], 
    ]);
}