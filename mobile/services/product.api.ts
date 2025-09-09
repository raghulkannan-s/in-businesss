import { showErrorToast, api, Toast } from "./api";


async function get_products(): Promise<any> {
  try {
    const { data } = await api.get("/product");
    return data;
  } catch (err) {
    showErrorToast(err);
    throw err;
  }
}

async function create_product(payload: any): Promise<any> {
  try {
    const { data } = await api.post("/product/create", payload);
    Toast.show({
      type: "success",
      text1: data.message,
    });
    return data;
  } catch (err) {
    showErrorToast(err);
    throw err;
  }
}

async function update_product(payload: any): Promise<any> {
  try {
    const { data } = await api.put(`/product/update/${payload.id}`, payload);
    Toast.show({
      type: "success",
      text1: data.message,
    });
    return data;
  } catch (err) {
    showErrorToast(err);
    throw err;
  }
}

async function delete_product(id: string): Promise<any> {
  try {
    const { data } = await api.delete(`/product/delete/${id}`);
    Toast.show({
      type: "success",
      text1: data.message,
    });
    return data;
  } catch (err) {
    showErrorToast(err);
    throw err;
  }
}

export {
  create_product,
  get_products,
  update_product,
  delete_product,
};