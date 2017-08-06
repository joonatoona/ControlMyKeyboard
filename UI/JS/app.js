let keyMap = [
    ["ESC", "_", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "PRTSCR", "SCRLK", "PAUSE"],
    ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "BACKSPACE", "INS", "HOME", "PAGEUP"],
    ["TAB", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\", "DELETE", "END", "PAGEDOWN"],
    ["CAPSLK", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "\'", "_", "RETURN", "_", "_", "_"],
    ["LSHIFT", "_", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "_", "RSHIFT", "_", "UP", "_"],
    ["LCTRL", "SUPER", "LALT", "_", "_", "_", "SPACE", "_", "_", "_", "RALT", "FN", "MENU", "RCTRL", "LEFT", "DOWN", "RIGHT"]
]

var entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;'
};

function escapeHtml (string) {
  return String(string).replace(/[&<>"'`=\/]/g, function (s) {
    return entityMap[s];
  });
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : null;
}

var ws = new WebSocket("wss://digitalfishfun.com/keyctrl");

function setKey(key) {
    let color = hexToRgb($("#color").val());
    ws.send(JSON.stringify({"key": key, "val": color}));
}

function createKeyboard() {
    for (row in keyMap) {
        let tr = $("#keyboard").append("<tr></tr>");
        for (key in keyMap[row]) {
            kn = keyMap[row][key]
            tr.append("<td id="+row+"."+key+" class=\""+kn+"\" onclick=setKey(\""+kn.replace("\\", "\\\\")+"\")>"+escapeHtml(kn)+"</td>");
        }
    }
}

ws.onmessage = (evt) => {
    dat = JSON.parse(evt.data)
    for (row in dat) {
        for (key in dat[row]) {
            if (key < 1) continue;
            document.getElementById(row+"."+(key-1)).style.background = "rgb("+dat[row][key]+")"
        }
    }
}

createKeyboard()