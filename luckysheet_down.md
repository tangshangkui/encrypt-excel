# 下载
```
git clone https://github.com/dream-num/Luckysheet.git
cd Luckysheet
npm install
npm run build
```
拷贝 dist/ 文件到 luckysheet 目录
# 修改源码
src/locale/zh.js
```
toolbar: {
        save:'保存',
```
src/locale/en.js
```
toolbar: {
        save:'Save',
```

src/controllers/toobar.js
```
xport const toolbarIdMap = {
    save: '#luckysheet-icon-save', 
```
export function createToolbarHtml() { 内部增加
```
    const getToolbarHtml=function (key, name){
        return `
<div class="luckysheet-toolbar-button luckysheet-inline-block disabled" data-tips="${toolbar[key]}"
        id="luckysheet-icon-${key}" role="button" style="user-select: none;">
            <div class="luckysheet-toolbar-button-outer-box luckysheet-inline-block"
            style="user-select: none;">
                <div class="luckysheet-toolbar-button-inner-box luckysheet-inline-block"
                style="user-select: none;">
                    <div class="luckysheet-icon luckysheet-inline-block " style="user-select: none;">
                        <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img luckysheet-icon-${key} iconfont-luckysheet luckysheet-iconfont-${name}"
                        style="user-select: none;">
                        </div>
                    </div>
                </div>
            </div>
        </div>
`
    }
```
export function createToolbarHtml() { 
```
 const htmlMap = {
        save:getToolbarHtml('save','baocun'), //'baocun' assets\iconfont\iconfont.json 中图标定义
```

修改后的文件保存在 luckysheet/change