import swal from 'sweetalert2';


function getOptions(input, href, callback) {
    const token = localStorage.getItem("token");
    let headers = {
        "Content-Type": "application/json",
        "Authorization": `Token ${token}`,
    }

    let url = `${href}?q=${input}`;

    return fetch(`${href}?q=${input}`, {headers, credentials: 'same-origin'})
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

function showMessage(title, text, type) {
    swal.fire({
        type: type,
        title: title,
        html: text,
    })
}

export function showSuccessMessage(title, text) {
    showMessage(title, text, 'success')
}

export function showErrorMessage(title, text) {
    showMessage(title, text, 'error');
}

export function errorMessageToString(errors) {
    let errorMessage = 'Неизвестная ошибка';
    if (Array.isArray(errors) && errors.length > 0) {
        errorMessage = errors.join('<br />')
    } else if (typeof(errors) === 'string' && errors.length > 0) {
        errorMessage = errors;
    } else if (typeof(errors) === 'object') {
        let error_messages = [];
        for (const prop in errors) {
          if (errors.hasOwnProperty(prop)) {
              error_messages.push(`${prop}: ${errors[prop]}`);
          }
        }
        errorMessage = error_messages.join('<br />');
    }
    return errorMessage
}
