function getOptions(input, href, additional) {
    return fetch(`${href}?q=${input}${additional ? '&' + additional : ''}`, {credentials: 'same-origin'})
        .then((response) => {
            return response.json()
        }).then((json) => {
            console.log(json)
            let options = [];
            for (let style of json) {
                options.push({
                    value: style.pk,
                    label: style.title
                });
            }
            return options;
        });
}

export const getTagOptions = (input) => getOptions(input, '/api/tags/');
