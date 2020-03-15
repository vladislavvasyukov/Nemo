function getOptions(input, href, callback) {
    return fetch(`${href}?q=${input}`, {credentials: 'same-origin'})
        .then((response) => {
            return response.json()
        }).then((json) => {
            callback(json);
        });
}

export const getTagOptions = (input, callback) => getOptions(input, '/api/tags/', callback);
export const getProjectOptions = (input, callback) => getOptions(input, '/api/projects/', callback);
