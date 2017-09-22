UE.plugins['justifyindex'] = function() {
    var domUtils = UE.dom.domUtils;
    var me = this;
    me.setOpt({
        'justifyindex': ['0', '8', '16', '24', '32'],
    });
    me.commands['justifyindex'] = {
        execCommand: function(cmdName, value) {
            this.execCommand('paragraph', 'p', {
                style: 'margin-left:' + value + 'px;margin-right:' + value +
                    'px'
            });
            return true;
        },
        queryCommandValue: function(cmdName) {
            var pN = domUtils.filterNodeList(this.selection.getStartElementPath(),
                    function(node) {
                        return domUtils.isBlockElm(node)
                    }),
                value;
            if (pN) {
                var ml = domUtils.getComputedStyle(pN, 'margin-left').replace(
                    /[^\d]/g, '')
                var mr = domUtils.getComputedStyle(pN, 'margin-right').replace(
                    /[^\d]/g, '')
                value = ml == mr ? ml : 0;
                return !value ? 0 : value;
            }
            return 0;
        }
    };
};

UE.registerUI('justifyindex', function(editor, uiName) {
    var val = editor.options['justifyindex'] || [];
    if (!val.length) return null;
    for (var i = 0, ci, items = []; ci = val[i++];) {
        items.push({
            label: ci,
            value: ci,
            theme: editor.options.theme,
            onclick: function() {
                editor.execCommand("justifyindex", this.value);
            }
        })
    }
    var ui = new UE.ui.MenuButton({
        editor: editor,
        className: 'edui-for-justifyindex',
        title: '两端缩进',
        items: items,
        onbuttonclick: function() {
            var value = editor.queryCommandValue('justifyindex') || this
                .value;
            editor.execCommand("justifyindex", value);
        }
    });
    editor.addListener('selectionchange', function() {
        var state = editor.queryCommandState('justifyindex');
        if (state == -1) {
            ui.setDisabled(true);
        } else {
            ui.setDisabled(false);
            var value = editor.queryCommandValue('justifyindex');
            value && ui.setValue((value + '').replace(/%/, ''));
            ui.setChecked(state)
        }
    });
    return ui;
})
