$(function () {
    //初始化,获得挂件id,设置语言
    init();
    //获取数据 成功后初始化页面
    getData();
    //修改密码框
    initModal2();
    $(document).on('click', '#buttonOpen', function () {
        //第一次打开文件,设置初始密码
        setPass1();
    });
    $(document).on('click', '#buttonDecrypt', function () {
        //第二次输入密码,解密表格
        DecryptTable();
    });

    $(document).on('click', '#luckysheet-icon-save', function () {
        //表格上面的保存按钮
        saveData(true)
    });
    $(document).on('click', '#luckysheet-icon-close', function () {
        //表格上面的关闭按钮
        closeTable()
    });
    $(document).on('click', '#luckysheet-icon-pass', function () {
        //表格上面的修改密码按钮
        modal2.showModal()
    });
    $(document).on('click', '#buttonChange', function () {
        //修改密码按钮
        changePass()
    });
})

