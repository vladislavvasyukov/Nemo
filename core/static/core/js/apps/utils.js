function getOptions(input, href, callback) {
    return fetch(`${href}?q=${input}`, {credentials: 'same-origin'})
        .then((response) => {
            return response.json()
        }).then((json) => {
            let data = [];
            for (let j of json) {
                data.push({
                    key: j.key,
                    value: j.key,
                    text: j.text,
                })
            }
            callback(data);
        });
}

export const getTagOptions = (input, callback) => getOptions(input, '/api/tags/', callback);
export const getProjectOptions = (input, callback) => getOptions(input, '/api/projects/', callback);
export const getUserOptions = (input, callback) => getOptions(input, '/api/users/', callback);
