import React, { useState, useEffect } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../../functions/product";
import ProductCreateForm from "../../../components/forms/ProductCreateForm";
import { getCategories, getCategorySubs } from "../../../functions/category";
import FileUpload from "../../../components/forms/FileUpload";
import {LoadingOutlined } from '@ant-design/icons';

const initialState = {
  title: "",
  description: "",
  price: "",
  categories: [],
  category: "",
  subs: [],
  shipping: ["Yes", "No"],
  quantity: "",
  images: [],
  colors: ["Black", "Brown", "Silver", "White", "Blue", "Golden"],
  brands: ["Apple","Lenovo","HP","MSI","Samsung","Microsoft","Asus","DELL","SAMSUNG"],
  color: "",
  brand: "",
};

const ProductCreate = () => {
  const [values, setValues] = useState(initialState);
  const [subOptions, setSubOptions] = useState([]);
  const [showSubs, setShowSub] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //redux
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    //when mounting and unmounting the ui refreshes
    loadCategory();
  }, []);

  const loadCategory = () =>
    getCategories().then((c) => setValues({ ...values, categories: c.data }));

  const handleSubmit = (e) => {
    e.preventDefault();
    createProduct(values, user.token)
      .then((res) => {
        // console.log(res);
        window.alert(`"${res.data.title}" is created successfully`);
        navigate("/admin/products");
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.err);
      });
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    //console.log(e.target.name, " ===== " , e.target.value);
  };

  const handleCategoryChange = (e) => {
    e.preventDefault();
    console.log("CLICKED CATEGORY", e.target.value);
    setValues({ ...values, subs: [], [e.target.name]: e.target.value });
    getCategorySubs(e.target.value).then((res) => {
      console.log("SUB OPTIONS ON CATEGORY CLICK", res);
      setSubOptions(res.data);
    });
    setShowSub(true);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2" id="sideNav">
          <AdminNav />
        </div>
        <div className="col-md-10" id="hero">
          {loading ? (<LoadingOutlined  className="text-white h1 center"/> 
          ):
          (<h4  id="headers">PRODUCT CREATE</h4>)}

          <br />
          <br />
          <br />
         
          <div >
            <FileUpload
              values={values}
              setValues={setValues}
              setLoading={setLoading}
            />
          </div>

          <ProductCreateForm
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            setValues={setValues}
            values={values}
            handleCategoryChange={handleCategoryChange}
            subOptions={subOptions}
            showSubs={showSubs}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCreate;
