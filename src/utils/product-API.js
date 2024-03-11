import md5 from "md5";

export const mainUrl = "http://api.valantis.store:40000/";

const checkResponse = (res) => {
  return res.ok
    ? res.json()
    : res.json().then((err) => {
        console.log(`Ошибка ${err}`);
        return Promise.reject(err);
      });
};

export const sendRequest = async (options) => {
  try {
    const res = await fetch(mainUrl, options);
    return await checkResponse(res);
  } catch (err) {
    console.log(err.message);
    return await sendRequest(options);
  }
};

const getTimestamp = () => {
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  return `${today.getFullYear()}${month < 10 ? `0${month}` : month}${
    day < 10 ? `0${day}` : day
  }`;
};

export const getProductsIDs = (offset = 0, selection = 150) => {
  return sendRequest({
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "X-Auth": md5(`Valantis_${getTimestamp()}`),
    },
    body: JSON.stringify({
      action: "get_ids",
      params: { offset: offset, limit: selection },
    }),
  });
};

export const getProductsItems = (ids) => {
  return sendRequest({
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "X-Auth": md5(`Valantis_${getTimestamp()}`),
    },
    body: JSON.stringify({
      action: "get_items",
      params: { ids },
    }),
  });
};

export const getAvailableFields = () => {
  return sendRequest({
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "X-Auth": md5(`Valantis_${getTimestamp()}`),
    },
    body: JSON.stringify({
      action: "get_fields",
    }),
  });
};

export const getBrandsFields = (offset = 0, selection = 10000) => {
  return sendRequest({
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "X-Auth": md5(`Valantis_${getTimestamp()}`),
    },
    body: JSON.stringify({
      action: "get_fields",
      params: { field: "brand", offset: offset, limit: selection },
    }),
  });
};

export const getFilteredProductsId = (field, value_field) => {
  return sendRequest({
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "X-Auth": md5(`Valantis_${getTimestamp()}`),
    },
    body: JSON.stringify({
      action: "filter",
      params: { [field]: value_field },
    }),
  });
};
