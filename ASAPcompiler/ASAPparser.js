function formatAndRunTXT(file) 
{
    var code = String(fs.readFileSync(file)).replace(/[\[\]\(\)\n]/g, " ").split(";")
    code = code.filter(x=>x).map(x => x.match(/(?:[^\s"]+|"[^"]*")+/g).filter((x=> x && x != "\n")))
    for(var i = 0; i < code.length; i++)
    {
        console.log("BEFORE:", code[i])
        var current = code[i]
        for(var n = current.length - 1; n >= 0; n--)
        {
            var currentWord = current[n]
            
            if(Object.keys(allFuncsJSON).includes(currentWord))
            {
                var readAMt = parseInt(allFuncsJSON[currentWord])
                if(readAMt == -1) {
                    readAMt = parseInt(current[n+1]) + 1
                    //console.log(readAMt)
                }
                console.log("READING", currentWord, readAMt)
                
                var defreq = (amt) => {
                    code[i][n] = `${currentWord}(${current.slice(n + 1, n + readAMt + amt)})`
                    code[i].splice(n + 1, readAMt + amt)
                }
                switch(currentWord) {
                    case "PROC":
                        defreq(3)
                        break;
                    case "CALL":
                        defreq(2)
                        break;
                    default:
                        //defreq(2)
                        code[i][n] = `${currentWord}(${current.slice(n + 1, n + readAMt + 1)})`
                        code[i].splice(n + 1, readAMt)
                        console.log("REPLACED WITH:", code[i][n], "NOW", code[i])
                        break;
                }
            } else {
                if(currentWord != parseInt(currentWord) && currentWord[0] != '"')
                code[i][n] = `"${currentWord}"`
            }
        }
        console.log(code[i])
        eval(code[i][0])
    }
    
}