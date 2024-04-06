export { initSwitches }
function initSwitches(switches) {
    // 为每个switch元素添加点击事件监听器
    switches.children.forEach((switchElement) => {
        if (switches.selectElement == undefined) {
            if (switchElement.classList.contains("selected")) {
                switches.selectElement = switchElement;
            }
        } else {
            switchElement.classList.remove('selected');
        }
        switchElement.addEventListener('click', () => {
            switches.selectElement.classList.remove('selected');
            const lastIndex = switches.selectElement.getAttributeNode('index').value;
            // 将当前点击的switch元素添加selected类
            switchElement.classList.add('selected');
            switches.selectElement = switchElement;
            const currentIndex = switches.selectElement.getAttributeNode('index').value;
            switches.dispatchEvent(new CustomEvent("onChangeSelect", { detail: { lastIndex: lastIndex, currentIndex: currentIndex } }));
        });
    });


    if (switches.selectElement == undefined && switches.children.length > 0) {
        switches.selectElement = switches.children[0];
    }
}