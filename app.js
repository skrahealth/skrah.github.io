var firebaseConfig = {
        apiKey: "AIzaSyD0Oya1Bd5ePTurIcGN5v7hTz1T57PycE4",
        authDomain: "sale-7a4a4.firebaseapp.com",
        databaseURL: "https://sale-7a4a4.firebaseio.com",
        projectId: "sale-7a4a4",
        storageBucket: "sale-7a4a4.appspot.com",
        messagingSenderId: "983963178156",
        appId: "1:983963178156:web:cfb1c54e9c293da5e13b09",
        measurementId: "G-494ZX2SZZN"
      };
      // Initialize Firebase
      var defaultProject = firebase.initializeApp(firebaseConfig);
      var db = firebase.firestore();


      const changeBtnStyle = (id,text)=>{
        let btn = $('#'+id);
        $('#'+id).html(text)
        $('#'+id).attr('disabled',true)
      }
      
      
      const revertBtnStyle = (id,revertedText)=>{
        let btn = $('#'+id);
        $('#'+id).html(revertedText)
        $('#'+id).attr('disabled',false)
      }

const SaveData = ()=>{
    changeBtnStyle('btnSave','Saving...')
    db.collection("ExpiryInfo")
    .doc()
    .set(objectifyForm($('form')
    .serializeArray()))
    .then(()=>{
        revertBtnStyle('btnSave','Save');
        $('#successMsg').show();
        setTimeout(()=>{
            $('#successMsg').hide();
        },3000)
    })
    .catch((e)=>{
        revertBtnStyle('btnSave','Save');
        $('#errorMsg').show();
        setTimeout(()=>{
            $('#errorMsg').hide();
        },3000)
    });
}

const getAllData = () => {
    db.collection("ExpiryInfo")
    .get()
    .then((querySnapshot)=>{
        let html ='';
        querySnapshot.forEach((doc)=>{
            html += `
                <tr>
                    <td>${doc.data().branch}</td>
                    <td>${doc.data().CustomerCode}</td>
                    <td>${doc.data().CustomerName}</td>
                    <td>${doc.data().PrCode}</td>
                    <td>${doc.data().ProductDescription}</td>
                    <td>${doc.data().BatchNo}</td>
                    <td>${doc.data().TradePrice}</td>
                    <td>${doc.data().ExpiryDate}</td>
                    <td>${doc.data().qty}</td>
                    <td>${doc.data().totalAmount}</td>
                </tr>
            
            `;
        })
        console.log(html)
        $('#tableBody').html(html);
    })
}
(()=>{
    $('#btnSave').click((e)=>{
        e.preventDefault();
        SaveData();
    });


    $('#errorMsg').hide();
    $('#successMsg').hide();
    if(window.location.href.includes('admin')){
        getAllData()
        $('#exportExcel').click(()=>{
            exportTableToExcel('excelTable','data')
        })
    }
})();

function fnExcelReport()
{
    var tab_text="<table border='2px'><tr bgcolor='#87AFC6'>";
    var textRange; var j=0;
    tab = document.getElementById('excelTable'); // id of table

    for(j = 0 ; j < tab.rows.length ; j++) 
    {     
        tab_text=tab_text+tab.rows[j].innerHTML+"</tr>";
        //tab_text=tab_text+"</tr>";
    }

    tab_text=tab_text+"</table>";
    tab_text= tab_text.replace(/<A[^>]*>|<\/A>/g, "");//remove if u want links in your table
    tab_text= tab_text.replace(/<img[^>]*>/gi,""); // remove if u want images in your table
    tab_text= tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params

    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE "); 

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer
    {
        txtArea1.document.open("txt/html","replace");
        txtArea1.document.write(tab_text);
        txtArea1.document.close();
        txtArea1.focus(); 
        sa=txtArea1.document.execCommand("SaveAs",true,"Say Thanks to Sumit.xls");
    }  
    else                 //other browser not tested on IE 11
        sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));  

    return (sa);
}


function exportTableToExcel(tableID, filename = ''){
    var downloadLink;
    var dataType = 'application/vnd.ms-excel';
    var tableSelect = document.getElementById(tableID);
    var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
    
    // Specify file name
    filename = filename?filename+'.xls':'excel_data.xls';
    
    // Create download link element
    downloadLink = document.createElement("a");
    
    document.body.appendChild(downloadLink);
    
    if(navigator.msSaveOrOpenBlob){
        var blob = new Blob(['\ufeff', tableHTML], {
            type: dataType
        });
        navigator.msSaveOrOpenBlob( blob, filename);
    }else{
        // Create a link to the file
        downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
    
        // Setting the file name
        downloadLink.download = filename;
        
        //triggering the function
        downloadLink.click();
    }
}
function objectifyForm(formArray) {//serialize data function

    var returnArray = {};
    for (var i = 0; i < formArray.length; i++){
      returnArray[formArray[i]['name']] = formArray[i]['value'];
    }
    returnArray['CreationDateTime'] = firebase.firestore.FieldValue.serverTimestamp();
    return returnArray;
  }




