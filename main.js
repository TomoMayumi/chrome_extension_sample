function $(id){
    return document.getElementById(id);
}

////////////////////////////////////////////////////////////////////////////////
// ユーザー設定項目 ここから                                                     //
////////////////////////////////////////////////////////////////////////////////

// ServerNameとSiteNameを環境に合わせて変更する
// 以下の初期設定はURLが"http://localhost/TimeTrackerNX/#timesheet/・・・"ような場合の例
const ServerName = 'chronos-2';
const SiteName = 'berkley';

// Web APIを実行するユーザーの認証情報を設定する
// Web APIはここで指定するユーザーの権限に従って実行される
// 以下の初期設定はサンプルデータの岡本さんの例
const UserName = '10042000398';

function WebAPI_Run(MethodType,APIString,RequestBody) {
    return new Promise( (resolve,reject) => {
        const request = new XMLHttpRequest();

        // サーバーとの通信状態が変わるたびに実行
        request.onreadystatechange = () => {
            const READYSTATE_COMPLETED = 4;
            const HTTP_STATUS_OK = 200;

            // サーバーとの通信が完了したかチェック
            if (request.readyState == READYSTATE_COMPLETED){
                // サーバーとの通信が完了し、通信ステータスが正常終了以外の場合
                if(request.status != HTTP_STATUS_OK) {
                    // 異常終了の表示
                    reject("【Status: " + request.status + "】\n\n" + request.responseText);
                }

                // サーバーとの通信が完了し、通信ステータスが正常終了の場合
                else {
                    // 正常終了(実行完了のダイアログとともに結果をWebページに出力)
                    resolve(request.responseText);
                }
            }
        };


        ////////////////////////////////////////////////////////////////////////////////
        // ユーザー設定項目 ここまで                                                     //
        ////////////////////////////////////////////////////////////////////////////////

        // Basic認証の情報を作成する
        var AuthorizeString = 'Basic ' + window.btoa(UserName + ':' + Password);

        // 実行するWeb APIのURL設定
        var URL = 'http://' + ServerName + '/' + SiteName + '/api' + APIString;

        // Web APIの実行
        request.open(MethodType, URL);
        request.setRequestHeader("Authorization",AuthorizeString); // 基本認証の設定
        if(MethodType == 'GET'){
            request.send();
        } else {
            request.setRequestHeader("Content-Type","application/json"); // 送信する情報のフォーマットを指定
            request.send(JSON.stringify(RequestBody));// サーバーに情報を送信する場合(PUTやPOST)、JSON形式のデータを送信する
        }
    });
}

window.onload = () => {
    $("button").onclick = async () => {
        $("button").disabled = true;
        const MethodType = $("MethodType").value;
        const APIString = $("APIString").value;
        const RequestBody = JSON.parse($("RequestBody").value);
        $("result").innerHTML = await WebAPI_Run(MethodType,APIString,RequestBody);
        $("button").disabled = false;
    };
};

