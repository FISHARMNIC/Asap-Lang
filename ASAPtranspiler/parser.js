var symbols = "(){}[]*!@#$%^&*()`~+,/<>?:\\= "

function parse(_this) {
    var build = ""
    var num = false
    var curr
    var inq = ""

    var parsed = []
    var chop = function () {
        //console.log("LLLL", build, "::", curr)
        if (inq == "") {
            if (build != "")
                parsed.push(build)
            if (curr != "" && curr != " ")
                parsed.push(curr)
            build = ""
        }
    }

    for (var i = 0; i < _this.length; i++) {
        curr = _this[i]
        if (symbols.includes(curr)) {
            if(inq != "")
            {
                build += curr
            }
            chop()
        } else {
            if (parseInt(curr) == curr) {
                if (num) {
                    build += curr
                }
                else {
                    num = true
                    chop()
                }
            } else { // not reading number
                if (curr == "'" || curr == '"') {
                    if (inq == "") // not already in quotes
                    {
                        if (build != "") parsed.push(build)
                        build = curr
                        //build += _this[i+1]
                        inq = curr
                    } else {
                        if (inq == curr) {
                            inq = ""
                            build += curr
                            parsed.push(build)
                            build = ""
                        }
                    }
                }
                if (num) {
                    num = false
                    chop()
                } else if (!(curr == "'" || curr == '"')) {
                    build += curr
                }
            }
        }
    }
    return parsed
}
