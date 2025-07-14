//console.log($.fn.jquery); //打印jQuery版本

var G_id = "";
var G_leng = 'zh';
var G_lengS = {};
var G_pass = '';
var G_pass_sha_256 = ''; //长度64个字符串
var G_save_data = '';//远程 table 值 加密后的结果
//console.log(G_id);
var G_save_json = ''; // 远程 tablejson值 用于判断表格是否更新
//saveBool = true 不判断数据是否更新,都要保存
function saveData(saveBool = false, callback = null) {
    let str = JSON.stringify(luckysheet.getAllSheets())
    if (!saveBool && G_save_json === str) {
        return;
    }
    let str2 = Encrypt(str, G_pass);

    var data = {
        attrs: {'custom-data': G_pass_sha_256 + str2},
        id: G_id,//挂件唯一id
    };
    jQuery.ajax('/api/attr/setBlockAttrs', {
        dataType: 'json',
        type: 'POST',
        cache: false,
        contentType: 'application/json',
        data: JSON.stringify(data),
        error: function (xhr, status, error) {
            alertModal('save error')
        },
        success: function (data) {
            if (data.code < 0) {
                alertModal('save error1')
                return
            }
            G_save_json = str;
            G_save_data = str2;
            if (saveBool) {
                alertModal(G_lengS.saveSuccess)
            }
            if (callback) {
                callback()
            }
        },
    })
}

function closeTable() {
    $('#pass_input_2')?.val("")
    $('#pass_input_1')?.val("")

    G_pass = '';
    G_save_json = '';
    window.luckysheet.destroy()
    initPage();
}

function getData() {
    var data = {
        id: G_id,//挂件唯一id
    };
    jQuery.ajax('/api/attr/getBlockAttrs', {
        dataType: 'json',
        type: 'POST',
        cache: false,
        contentType: 'application/json',
        data: JSON.stringify(data),
        error: function (xhr, status, error) {
            alertModal('get data Error')
        },
        success: function (data) {
            if (data.code < 0) {
                alertModal('get data Error1')
                return;
            }
            if (data.data.hasOwnProperty('custom-data')) {
                let str = data.data['custom-data'];
                if (str.length < 64) {
                    G_pass_sha_256 = '';
                    G_save_data = '';
                    G_pass = '';
                }
                //获取前64个字符
                G_pass_sha_256 = str.substring(0, 64);
                G_save_data = str.substring(64);
            } else {
                G_pass_sha_256 = '';
                G_save_data = '';
                G_pass = '';
            }
            initPage()
        },
    })
}

function initModal2() {
    let html = `
    <div class="modal2-body">
    <div class="modal-header">
    <div class="modal-title">${G_lengS.changePass}:</div>
    <div class="modal2-close" onclick="modal2.close()">&times;</div>
    </div>
        <table class="pass_table">
            <tr>
                <td>${G_lengS.pass}:</td>
                <td><input type="password" id="pass_input_1"></td>
            </tr>
            <tr>
                <td>${G_lengS.repeat}:</td>
                <td><input type="password" id="pass_input_2"></td>
            </tr>
        </table>
        <button id='buttonChange'>${G_lengS.change}</button>
    </div>`
    $('#modal2').html(html)
}

function changePass() {
    let pass1 = $('#pass_input_1').val()
    let pass2 = $('#pass_input_2').val()

    if (pass1 !== pass2 || pass1.length < 1) {
        alertModal(G_lengS.passDifferent)
        return;
    }
    G_pass = passSha256(pass1);
    G_pass_sha_256 = passSha256_2(G_pass);

    saveData(true, function () {
        $('#pass_input_2')?.val("")
        $('#pass_input_1')?.val("")
        modal2.close()
    })
}

function initPage() {
    let html = '';
    if (G_pass_sha_256 === '') {
        //初始化密码
        html = `<div class="pass_input">
        ${G_lengS.setPass}:<br />
        <table class="pass_table">
            <tr>
                <td>${G_lengS.pass}:</td>
                <td><input type="password" id="pass_input1"></td>
            </tr>
            <tr>
                <td>${G_lengS.repeat}:</td>
                <td><input type="password" id="pass_input2"></td>
            </tr>
        </table>
        <button id="buttonOpen">${G_lengS.open}</button>
    </div>`;
    } else {
        html = `<div class="pass_input">
        <input type="password" id="pass_input"><button id="buttonDecrypt">${G_lengS.decrypt}</button></div>`;
    }
    $('#EncryptExcel').hide()
    $('#pass_body').html(html);
    $('#loading').hide();
    $('#pass_body').show();
}

function initTable() {
    $('#pass_input1')?.val('')
    $('#pass_input2')?.val('')
    $('#pass_input')?.val('')
    $('#pass_body').hide();
    $('#loading').hide();
    $('#EncryptExcel').show()
    let options = getOption();
    luckysheet.create(options)
}

function setPass1() {
    let pass1 = $('#pass_input1').val().trim();
    let pass2 = $('#pass_input2').val().trim();
    if (pass1 !== pass2 || pass1.length < 1) {
        alertModal(G_lengS.passDifferent)
        return;
    }
    G_pass = passSha256(pass1);
    G_pass_sha_256 = passSha256_2(G_pass);
    initTable();
}

function DecryptTable() {
    let pass = $('#pass_input').val().trim();
    let pass_1 = passSha256_2(passSha256(pass));
    if (pass_1 != G_pass_sha_256) {
        alertModal(G_lengS.passError)
        return;
    }
    G_pass = passSha256(pass);
    initTable();
}

function passSha256(pass) {
    return get_sha256('jX8tD2qM' + pass + 'xF8rK7eP')
}

function passSha256_2(pass) {
    return get_sha256('xS5aH6vR' + pass + 'eN4gS0xJ')
}

function init() {
    G_id = window.frameElement.parentElement.parentElement.getAttribute("data-node-id");
    G_leng = navigator.language.indexOf('zh') > -1 ? 'zh' : 'en'
    if (G_leng === 'zh') {
        G_lengS = {
            'decrypt': '解密',
            'setPass': '设置密码',
            'pass': '密码',
            'repeat': '重复',
            'open': '打开',
            'passDifferent': '两次输入密码不一致,或者密码为空',
            'passError': '密码错误',
            'saveSuccess': '保存成功',
            'changePass': '修改密码',
            'change': '修改',
        }
    } else {
        G_lengS = {
            'decrypt': 'decrypt',
            'setPass': 'set password',
            'pass': 'password',
            'repeat': 'repeat',
            'open': 'open',
            'passDifferent': 'The password entered twice is inconsistent,Or the password is empty',
            'passError': 'passError',
            'saveSuccess': 'save Success',
            'changePass': 'change password',
            'change': 'change',
        }
    }
}

function get_sha256(str) {
// 计算SHA256哈希值
    var sha256 = CryptoJS.SHA256(str);
// 将哈希值转换为字符串
    return sha256.toString(CryptoJS.enc.Hex);
}

//加密方法
function Encrypt(word, key) {
    key = CryptoJS.enc.Utf8.parse(get_sha256('mS4lP1dX' + key + 'bO1eY3gM'));
    iv = CryptoJS.enc.Utf8.parse(get_sha256('mE5rS9jW' + key + 'cT0jZ4dT'))

    let srcs = CryptoJS.enc.Utf8.parse(word);
    let encrypted = CryptoJS.AES.encrypt(srcs, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    let encryptedHexStr = CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
    return encryptedHexStr.toString();
    // return encrypted.ciphertext.toString().toUpperCase();   //不需要加密base64的时候可以直接返回
}

//解密方法
function Decrypt(word, key) {
    key = CryptoJS.enc.Utf8.parse(get_sha256('mS4lP1dX' + key + 'bO1eY3gM'));
    iv = CryptoJS.enc.Utf8.parse(get_sha256('mE5rS9jW' + key + 'cT0jZ4dT'))

    let encryptedHexStr = CryptoJS.enc.Base64.parse(word);
    let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    let decrypt = CryptoJS.AES.decrypt(srcs, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
}

//获取配置,初始化数据
function getOption() {
    let data = {
        container: 'EncryptExcel',
        lang: G_leng, // 设定表格语言
        showinfobar: false,//隐藏信息栏
        row: 30, // 行数
        column: 14, // 列数
        uploadImage: function () {
            return false; // 禁止图片上传
        },
        //showtoolbar:false,
        showtoolbarConfig: [
            'save',//保存
            'close',//关闭保存
            'pass',//设置密码
            '|',
            'findAndReplace',//查找和替换
            '|',
            'undo', //撤销
            'redo', //重做
            'paintFormat', //格式刷
            '|',

            'font',//字体
            '|',
            'fontSize',//字号
            '|',

            'bold',//粗体(Ctrl+B)
            'italic',//斜体(Ctrl+I)
            'strikethrough',//删除线(Alt+Shift+5)
            'underline',//下划线(Alt+Shift+6)
            'textColor',//文本颜色
            '|',

            'fillColor',//背景颜色
            'border',//边框
            'mergeCell',//合并单元格
            '|',

            'horizontalAlignMode',//水平对齐方式
            'verticalAlignMode',//垂直对齐方式
            'textWrapMode',//文本换行方式
            'textRotateMode',//文本旋转方式
            '|',

            'currencyFormat', //货币格式
            'percentageFormat',//百分比格式
            'numberIncrease',//'增加小数位数'
            'numberDecrease',//'减少小数位数'
            'moreFormats',//更多格式
            '|',

            // 'image',//插入图片
            'link',//插入链接
            // 'chart',//图表
            'postil',//批注
            // 'pivotTable',//数据透视表
            '|',

            'function',//公式
            'frozenMode',//冻结方式
            'sortAndFilter',//排序和筛选
            'conditionalFormat',//条件格式
            'dataVerification',//数据验证
            'splitColumn',//分列
            // 'screenshot',//截图
            //'protection',//工作表保护
            // 'print',//打印
            // 'exportXlsx',//导出
        ],
        //右键菜单
        cellRightClickConfig: {
            copy: true, // 复制
            copyAs: true, // 复制为
            paste: true, // 粘贴
            insertRow: true, // 插入行
            insertColumn: true, // 插入列
            deleteRow: true, // 删除选中行
            deleteColumn: true, // 删除选中列
            deleteCell: true, // 删除单元格
            hideRow: true, // 隐藏选中行和显示选中行
            hideColumn: true, // 隐藏选中列和显示选中列
            rowHeight: true, // 行高
            columnWidth: true, // 列宽
            clear: true, // 清除内容
            matrix: false, // 矩阵操作选区
            sort: false, // 排序选区
            filter: false, // 筛选选区
            chart: false, // 图表生成
            image: false, // 插入图片
            link: false, // 插入链接
            data: true, // 数据验证
            cellFormat: true // 设置单元格格式
        },
        hook: {
            updated: function (operate) {
                // console.log(luckysheet.getAllSheets())
                saveData()
            },

        },
        data: [{
            "name": "Sheet1",
            "color": "",
            "index": 0,
            "status": 0,
            "order": 0,
            "celldata": [],
            "config": {},
        }],
    }
    if (G_save_data !== '') {
        let arr = JSON.parse(Decrypt(G_save_data, G_pass))
        data.data = arr;
    }
    return data;
}

function alertModal(str) {
    $('#alertModal').text(str)
    modal.showModal()
}