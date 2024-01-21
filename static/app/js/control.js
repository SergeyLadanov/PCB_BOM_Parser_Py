
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
        params += `<p>${bom_item["params"][index]}</p>`;
    }


    for (index = 0; index < bom_item["ordering"].length; index++) 
    {
        links += `<p><a href="${bom_item["ordering"][index]["order_link"]}" target="_blank">${bom_item["ordering"][index]["store_name"]}</a></p>`;
    }

    let row_content = `<th scope="row">${ResTableRowCount}</th><td>${bom_item["name"]}</td><td>${bom_item["type"]}</td><td>${params}</td><td>${bom_item["count"]}</td><td>${links}</td>`;

    res_table.innerHTML += `<tr>${row_content}</tr>`;

    ResTableRowCount++;
    
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

        })
        // Обработчик неуспешной отправки данных
        .fail(function() {
            alert("Потеря связи с сервером");
        });
        // alert( "Handler for `click` called." );
    } 
);