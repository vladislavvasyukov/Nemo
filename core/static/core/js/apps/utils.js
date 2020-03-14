function getOptions(input, href, additional) {
    return fetch(`${href}?q=${input}${additional ? '&' + additional : ''}`, {credentials: 'same-origin'})
        .then((response) => {
            return response.json()
        }).then((json) => {
            return {options: json}
        });
}

export const getTagOptions = (input) => getOptions(input, '/api/tags/');
