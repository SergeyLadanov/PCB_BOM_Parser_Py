
var ResTableRowCount = 1;

function ClearResTable()
{
    ResTableRowCount = 1;
    let res_table = document.getElementById("res_table_body");
    res_table.innerHTML = "";
}

function AddRowResTable(name, type, parameters, count, links)
{
    let res_table = document.getElementById("res_table_body");

    let row_content = `<th scope="row">${ResTableRowCount}</th><td>${name}</td><td>${type}</td><td>${parameters}</td><td>${count}</td><td><a href="${links}" target="_blank">Elitan</a></td>`;

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
            alert("Данные успешно получены");
        })
        // Обработчик неуспешной отправки данных
        .fail(function() {
            alert("Потеря связи с сервером");
        });
        // alert( "Handler for `click` called." );
    } 
);