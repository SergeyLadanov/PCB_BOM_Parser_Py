
var ResTableRowCount = 1;

const exampleModal = document.getElementById('exampleModal');


if (exampleModal) {
  exampleModal.addEventListener('show.bs.modal', event => {
    // Button that triggered the modal
    const button = event.relatedTarget
    // Extract info from data-bs-* attributes
    const recipient = button.getAttribute('data-bs-whatever')
    // If necessary, you could initiate an Ajax request here
    // and then do the updating in a callback.

    // Update the modal's content.
    const modalTitle = exampleModal.querySelector('.modal-title')
    const modalBodyInput = exampleModal.querySelector('.modal-body input')

    modalTitle.textContent = `Список для заказа ${recipient}`
    modalBodyInput.value = recipient
  })
}



function ClearResTable()
{
    ResTableRowCount = 1;
    let res_table = document.getElementById("res_table_body");
    res_table.innerHTML = "";
}

function AddRowResTable(bom_item)
{
    let res_table = document.getElementById("res_table_body");
    var index;
    let params = ""
    let links = ""

    for (index = 0; index < bom_item["params"].length; index++) 
    {
        params += `${bom_item["params"][index]}<br/>`;
    }


    for (index = 0; index < bom_item["ordering"].length; index++) 
    {
        links += `<p><a id="store_link" href="${bom_item["ordering"][index]["order_link"]}" target="_blank">${bom_item["ordering"][index]["store_name"]}</a></p>`;
    }

    // links += `<p><a id="store_link" href="#" >test</a></p>`;

    let svg_field = `<svg width="100" height="100"><circle id="status_circle" cx="50" cy="50" r="10" fill="gray"/></svg><p id="clicked_store"></p>`;

    let row_content = `<th scope="row">${ResTableRowCount}</th><td>${bom_item["name"]}</td><td>${bom_item["type"]}</td><td style="font-size:12px">${params}</td><td>${bom_item["count"]}</td><td id="links_col">${links}</td><td id="status_col" class="text-center">${svg_field}</td>`;

    res_table.innerHTML += `<tr>${row_content}</tr>`;

    ResTableRowCount++;
    
}



function onRowClick(tableId, statusCallBack, linkCallBack) {
    var table = document.getElementById(tableId);
    var rows = table.getElementsByTagName("tr");
 
    for (var i = 1; i < rows.length; i++) 
    { 
       var status_col = table.rows[i].querySelector("#status_col");
       var link_array = table.rows[i].getElementsByTagName("a");




       status_col.onclick = function(row) 
       {
          return function() 
          {
                statusCallBack(row);
          };
       }(table.rows[i]);



       for (var j = 0; j < link_array.length; j++) 
       { 
            link_array[j].onclick = function(row, store_link) 
            {
                return function() 
                {
                    linkCallBack(row, store_link);
                };
            }(table.rows[i], link_array[j]);
       }
    }
 }


 function swicthStatus(status_obj)
 {
    if (status_obj.getAttribute("fill") == 'gray')
    {
        status_obj.setAttribute("fill", 'yellow');  
    }
    else if (status_obj.getAttribute("fill") == 'yellow')
    {
        status_obj.setAttribute("fill", 'green'); 
    }
    else if (status_obj.getAttribute("fill") == 'green')
    {
        status_obj.setAttribute("fill", 'gray'); 
    }
 }


 function updateStatus(tableId, row) 
 {
    var table = document.getElementById(tableId);
    var rows = table.getElementsByTagName("tr");
 
    for (var i = 1; i < rows.length; i++) 
    { 
        var status_obj = table.rows[i].querySelector("#status_circle");

        if (table.rows[i] != row)
        {
            if (status_obj.getAttribute("fill") == 'yellow')
            {
                status_obj.setAttribute("fill", 'gray'); 
            }
        }
        else
        {
            status_obj.setAttribute("fill", 'yellow'); 
        }
    }
 }
 



$( "#handle_button" ).on( "click", function() 
    {
        let bom_table = document.getElementById("input_list");

        let device_count = parseInt(document.getElementById("deivice_count").value);

        let tech_reserve = (parseFloat(document.getElementById("tech_reserve").value) * 0.01) + 1.0;

        let res_skip_tol_checkbox = document.getElementById("skip_res_tol");
        let res_skip_power_checkbox = document.getElementById("skip_res_power");


        let cap_skip_tol_checkbox = document.getElementById("skip_cap_tol");
        let cap_skip_diel_checkbox = document.getElementById("skip_cap_dielectric");
        let cap_skip_voltage_checkbox = document.getElementById("skip_cap_voltage");

        let data  = {
            bom: bom_table.value,
            count: device_count,
            tech_res: tech_reserve,
            res_filter: {
                skip_tol: res_skip_tol_checkbox.checked,
                skip_power: res_skip_power_checkbox.checked,
            },
            cap_filter:
            {
                skip_tol: cap_skip_tol_checkbox.checked,
                skip_dielectric: cap_skip_diel_checkbox.checked,
                skip_voltage: cap_skip_voltage_checkbox.checked,
            }
        };

        //ClearResTable();
        //AddRowResTable("test","test1","test3","test4","https://mail.ru");

        //Отправка данных серверу, обработка ответа
        $.post("./bom_data", data, function(data){
            // alert("Данные успешно получены");
            var index;

            ClearResTable();

            for (index = 0; index < data.length; index++) 
            {
                AddRowResTable(data[index]);
            }


            onRowClick("res_table", function(row) 
            {
                const status_obj = row.querySelector("#status_circle");

                swicthStatus(status_obj);
                
            },
            function(row, store_link) 
            {
                updateStatus("res_table", row);
                const link_status = row.querySelector("#clicked_store");
                link_status.innerHTML = store_link.innerHTML;
            }
            );
            

        })
        // Обработчик неуспешной отправки данных
        .fail(function() {
            alert("Потеря связи с сервером");
        });
        // alert( "Handler for `click` called." );
    } 
);