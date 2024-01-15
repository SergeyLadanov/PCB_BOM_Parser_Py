

$( "#handle_button" ).on( "click", function() 
    {
        var bom_table = document.getElementById("input_list");

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
        //Отправка данных серверу, обработка ответа
        $.post("./bom_data", data, function(data){
            // alert("Настройки успешно применены");
        })
        // Обработчик неуспешной отправки данных
        .fail(function() {
            alert("Потеря связи с сервером");
        });
        // alert( "Handler for `click` called." );
    } 
);