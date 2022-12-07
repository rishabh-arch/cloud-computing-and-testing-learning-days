
const myReplace = (str, before, after) => {
    if (before.toLowerCase() === before) {
        return (str.replace(before, after));
    }
    else {
        return (str.replace(before, after.replace(after[0], after[0].toUpperCase())));
    }
}
const unique = (value, index, self) => {
    return self.indexOf(value) === index;
}

const ConvertText_Html = (input_text) => {
    var input_str; //store input
    var text_input; //store input after beging trim()med
    var output_html = ""; //store output
    var counter;

    input_str = input_text; //get input and store it in input_str
    text_input = input_str.trim(); //trim() input
    var urlArray = [];
    var matchArray;
    var HashArray = [];
    var matchHashArray;
    // var ContactArray = [];
    // var matchContactArray;
    var hashtags = /#[a-z]+/gi;
    // var regexContact = new RegExp("[0-9]{3}-[0-9]{2}-[0-9]{3}", "g");
    
    // while ((matchContactArray = regexContact.exec(input_text)) !== null) {
    //     var ContactToken = matchContactArray[0];
    //     ContactArray.push(ContactToken)
    // }

    while ((matchHashArray = hashtags.exec(input_text)) !== null) {
        var Hashtoken = matchHashArray[0];
        HashArray.push(Hashtoken.slice(1))
    }
    var regexToken = /(((ftp|https?):\/\/)[\-\w@:%_\+.~#?,&\/\/=]+)|((mailto:)?[_.\w-]+@([\w][\w\-]+\.)+[a-zA-Z]{2,3})/g;

    if (text_input.length > 0) {
        output_html += "<p style='color:black'>"; //begin by creating paragraph
        for (counter = 0; counter < text_input.length; counter++) {
            switch (text_input[counter]) {
                case '\n':
                    if (text_input[counter + 1] === '\n') {
                        output_html += "</p>\n<p>";
                        counter++;
                    }
                    else output_html += "<br>";
                    break;

                case ' ':
                    if (text_input[counter - 1] !== ' ' && text_input[counter - 1] !== '\t')
                        output_html += " ";
                    break;

                case '\t':
                    if (text_input[counter - 1] !== '\t')
                        output_html += " ";
                    break;

                case '"':
                    output_html += "&quot;";
                    break;

                default:
                    output_html += text_input[counter];

            }


        }
        output_html += "</p>";
    }

    while ((matchArray = regexToken.exec(output_html)) !== null) {
        var token = matchArray[0];
        urlArray.push(token)
    }

    var i;
    if (urlArray.length > 0) {
        urlArray = urlArray.filter(unique)
        for (i = 0; urlArray.length - 1 >= i; i++) {
            output_html = myReplace(output_html, urlArray[i], `<a href=${urlArray[i]} target=_blank>${urlArray[i]}</a>`)
        }
    }
    if (HashArray.length > 0) {
        HashArray = HashArray.filter(unique)
        for (i = 0; HashArray.length - 1 >= i; i++) {
            output_html = myReplace(output_html, HashArray[i], `<a href=/search?input=${HashArray[i]} target=_blank>${HashArray[i]}</a>`)
        }
    }
        return [output_html,HashArray]
}
export default ConvertText_Html;
