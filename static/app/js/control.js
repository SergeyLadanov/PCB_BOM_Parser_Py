
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

        let data  = {
            bom: bom_table.value,
            count: 1,
            tech_tol: 0.1,
            res_filter: {
                skip_tol: false,
                skip_power: false,
            },
            cap_filter:
            {
                skip_tol: false,
                skip_dielectric: false,
                skip_voltage: false,
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