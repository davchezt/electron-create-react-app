const isEmpty = (dataBody) => {
  for(let key in dataBody) {
    if(dataBody.hasOwnProperty(key))
      return false;
  }
  return true;
}

const isNotEmpty = (dataBody) => {
  for(let key in dataBody) {
    if(dataBody.hasOwnProperty(key))
      return true;
  }
  return false;
}

const parse = (dataBody) => {
  let formData = new FormData();

  if (isNotEmpty(dataBody) || !isEmpty(dataBody)) {
    for(let name in dataBody) {
      formData.append(name, dataBody[name]);
    }
  }

  return formData;
}

const get = (apiUrl, cb, debug = false) => {
  fetch(apiUrl, { method: 'GET' })
  .then((response) => debug ? response.text() : response.json())
  .then((responseJson) => {
    cb(JSON.stringify(responseJson));
  })
  .catch((error) => {
    cb(error);
  });
}

const getAuth = (apiUrl, jwtToken, cb, debug = false) => {
  fetch(apiUrl, {
    method: 'GET',
    headers: new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + jwtToken
    })
  })
  .then((response) => debug ? response.text() : response.json())
  .then((responseJson) => {
    cb(JSON.stringify(responseJson));
  })
  .catch((error) => {
    cb(error);
  });
}

const auth = (apiUrl, dataBody, cb, debug) => {
  fetch(apiUrl, { 
    method: 'POST', 
    body: JSON.stringify(dataBody), 
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .then(res => debug ? res.text() : res.json())
  .then(data => cb(debug ? data : JSON.stringify(data)))
  .catch(error => cb(error));
}

const post = (apiUrl, jwtToken, dataBody, cb, method = 'POST', debug = false) => {
  let formData = parse(dataBody);
  let objectBody = {};
  formData.forEach(function(value, key) {
    objectBody[key] = value;
  });
  
  fetch(apiUrl, {
    method: method,
    headers: new Headers({
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + jwtToken
    }),
    body: JSON.stringify(objectBody) // JSON.stringify(dataBody)
  })
  .then((response) => debug ? response.text() : response.json())
  .then((responseJson) => {
    cb(debug ? responseJson : JSON.stringify(responseJson));
  })
  .catch((error) => {
    cb(error);
  });
}

const put = (apiUrl, jwtToken, dataBody, cb, debug = false) => {
  post(apiUrl, jwtToken, dataBody, cb, 'PUT', debug);
}

const patch = (apiUrl, jwtToken, dataBody, cb, debug = false) => {
  post(apiUrl, jwtToken, dataBody, cb, 'PATCH', debug);
}

const del = (apiUrl, jwtToken, dataBody, cb, debug = false) => {
  post(apiUrl, jwtToken, dataBody, cb, 'DELETE', debug);
}

const upload = (apiUrl, jwtToken, dataBody, cb, debug = false) => {
  let formData = parse(dataBody);

  fetch(apiUrl, {
    method: 'POST',
    headers: new Headers({
      'Accept': 'application/json', // 'application/json, text/plain, */*',
      'Content-Type': 'multipart/form-data',
      'Authorization': 'Bearer ' + jwtToken
    }),
    body: formData
  })
  .then((response) => debug ? response.text() : response.json())
  .then((responseJson) => {
    cb(JSON.stringify(responseJson));
  })
  .catch((error) => {
    cb(error);
  });
}

export default {
  get,
  post,
  put,
  patch,
  del,
  upload,
  auth,
  getAuth
};