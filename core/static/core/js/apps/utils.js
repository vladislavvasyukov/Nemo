import swal from 'sweetalert2';


function getOptions(input, href, callback, task_id=undefined, project_id=undefined) {
    const token = localStorage.getItem("token");
    let headers = {
        "Content-Type": "application/json",
        "Authorization": `Token ${token}`,
    }

    let url = `${href}?q=${input}`;
    if (task_id) {
        url += `&task_id=${task_id}`;
    }
    if (project_id) {
        url += `&project_id=${project_id}`;
    }

    return fetch(url, {headers, credentials: 'same-origin'})
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
export const getUserOptions = (input, callback, task_id=undefined, project_id=undefined) => {
    getOptions(input, '/api/users/', callback, task_id, project_id);
}

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

export function swalRequest(title, input_type, confirmButtonText, url, field_name, user, token, callback) {
    swal.fire({
        title: title,
        input: input_type,
        inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: confirmButtonText,
        cancelButtonText: 'Отмена',
        showLoaderOnConfirm: true,
        preConfirm: (value) => {
            let headers = {
                "Content-Type": "application/json",
            };

            if (token) {
                headers["Authorization"] = `Token ${token}`;
            }
            let body = JSON.stringify({[field_name]: value, creator_id: user.pk});

            return fetch(url, {headers, body, method: "POST" })
                .then(res => {
                    if (res.status < 500) {
                        return res.json().then(data => {
                            return {status: res.status, data};
                        })
                    } else {
                        swal.showValidationMessage('Ошибка');
                    }
                })
                .then(res => {
                    if (res.status === 200) {
                        if (res.data.success) {
                            callback();
                        } else {
                            swal.showValidationMessage(`Ошибка: ${errorMessageToString(res.data.message)}`);
                        }
                    } else {
                        swal.showValidationMessage('Ошибка');
                    }
                })
                .catch(error => {
                    swal.showValidationMessage(`Ошибка: ${error}`);
                })
        },
        allowOutsideClick: () => !swal.isLoading()
    }).then((result) => {
        showSuccessMessage('Успешо!', '');
    })
}

export function setLocation(curLoc) {
    curLoc = location.origin + curLoc;
    try {
        history.pushState(null, null, curLoc);
        return;
    } catch (e) {

    }
}
