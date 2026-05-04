import axios from "axios"
import { Modal, Offcanvas } from "bootstrap"
import { useEffect, useState } from "react"

function ProductListPage() {
    const [listProducts, setListProducts] = useState([])

    const [detailsProductItem, setDetailsProductItem] = useState({})
    const [offcanvasDetailsProduct, setOffcanvasDetailsProduct] = useState()

    const [updateProductItem, setUpdateProductItem] = useState({})
    const [offcanvasUpdateProduct, setOffcanvasUpdateProduct] = useState()

    const [offcanvas, setOffcanvas] = useState()

    const [modalDeleteProduct, setModalDeleteProduct] = useState()
    const [deleteProductItem, setDeleteProductItem] = useState({})

    function getProducts() {
        axios.get('http://localhost:3000/products')
            .then((response) => {
                setListProducts(response.data)
            })
    }

    function createProduct() {
        const formCreateProduct = document.getElementById('form-create-product')
        const formData = new FormData(formCreateProduct)
        const productData = Object.fromEntries(formData)

        axios.post('http://localhost:3000/products', productData)
            .then(() => {
                getProducts()
                formCreateProduct.reset()
            })
    }

    function deleteProduct() {
        axios.delete(`http://localhost:3000/products/${deleteProductItem.id}`)
            .then(() => {
                toggleModalDeleteProduct()
                setDeleteProductItem({})
                getProducts()
            })
    }

    function updateProduct() {
        const formUpdateProduct = document.getElementById('form-update-product')
        const formData = new FormData(formUpdateProduct)
        const productData = Object.fromEntries(formData)

        axios.put(`http://localhost:3000/products/${updateProductItem.id}`, productData)
            .then(() => {
                toggleOffcanvasUpdateProduct({})
                getProducts()
            })
    }

    function initModalDeleteProduct() {
        const modalElement = document.getElementById('deleteProduct')
        const modal = new Modal(modalElement)
        setModalDeleteProduct(modal)
    }

    function toggleModalDeleteProduct(product) {
        setDeleteProductItem(product)
        modalDeleteProduct.toggle()
    }

    function initOffcanvasUpdateProduct() {
        const offcanvasElement = document.getElementById('updateProduct')
        const offcanvas = new Offcanvas(offcanvasElement, {
            backdrop: true
        })

        setOffcanvasUpdateProduct(offcanvas)
    }

    function toggleOffcanvasUpdateProduct(product) {
        setUpdateProductItem(product)
        offcanvasUpdateProduct.toggle()
    }



    function initOffcanvasDetailsProduct() {
        const offcanvasElement = document.getElementById('detailsProduct')
        const offcanvas = new Offcanvas(offcanvasElement, {
            backdrop: true
        })

        setOffcanvasDetailsProduct(offcanvas)
    }

    function toggleOffcanvasDetailsProduct(product) {
        setDetailsProductItem(product)
        offcanvasDetailsProduct.toggle()
    }


    function initOffcanvas() {
        const offcanvasElement = document.getElementById('createProduct')
        const offcanvas = new Offcanvas(offcanvasElement, {
            backdrop: true
        })

        setOffcanvas(offcanvas)
    }

    function openCreateProductModal() {
        offcanvas.show()
    }

    function closeCreateProductModal() {
        offcanvas.hide()
    }

    useEffect(() => {
        getProducts()
        initOffcanvas()
        initOffcanvasDetailsProduct()
        initModalDeleteProduct()
        initOffcanvasUpdateProduct()
    }, [])
    
    
    return (
        <>
            <div className="d-flex justify-content-end">
                <button className="btn btn-sm btn-success" onClick={openCreateProductModal}>Cadastrar</button>
            </div>
            <table className="table table-sm table-striped">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Nome</th>
                        <th>Custo</th>
                        <th>Venda</th>
                        <th>Descrição</th>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {listProducts.map((product, index) => (
                        <tr key={index}>
                            <td>{product.id}</td>
                            <td>{product.name}</td>
                            <td>{product.costPrice}</td>
                            <td>{product.price}</td>
                            <td>{product.description.slice(0, 80)}...</td>
                            <td className="d-flex justify-content-end gap-1">
                                <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => toggleOffcanvasDetailsProduct(product)}
                                >
                                    Detalhes
                                </button>
                                <button
                                    className="btn btn-sm btn-info"
                                    onClick={() => toggleOffcanvasUpdateProduct(product)}
                                >
                                    Atualizar
                                </button>
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => toggleModalDeleteProduct(product)}
                                >
                                    Deletar
                                </button>
                            </td>
                        </tr>
                    ))}
 
                </tbody>
            </table>

            <div className="modal fade" id="deleteProduct" tabIndex="-1" aria-labelledby="deleteProductLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="deleteProductLabel">Deletar produto</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <p className="text-center">Você está prestes a deletar o produto: </p>
                        <h4 className="text-center">{deleteProductItem.name}</h4>
                        <div className="alert alert-warning text-center">
                            <small>
                                Esta operação não poderá ser desfeita posteriormente
                            </small>    
                        </div>    
                    </div>
                    <div className="modal-footer d-flex justify-content-between">
                        <button type="button" className="btn btn-secondary" onClick={toggleModalDeleteProduct}>Cancelar</button>
                        <button type="button" className="btn btn-danger" onClick={deleteProduct}>Deletar</button>
                    </div>
                    </div>
                </div>
            </div>

           <div
                className="offcanvas offcanvas-start"
                tabIndex="-1"
                id="detailsProduct"
                aria-labelledby="detailsProductLabel"
            >
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="detailsProductLabel">Cadastro de produtos</h5>
                    <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">
                    <div className="mb-3">
                        <small htmlFor="productName" className="fw-bold">Nome</small>
                        <p>{detailsProductItem.name}</p>
                    </div>
                    <div className="mb-3">
                        <small htmlFor="productName" className="fw-bold">Custo</small>
                        <p>{detailsProductItem.costPrice}</p>
                    </div>
                    <div className="mb-3">
                        <small htmlFor="productName" className="fw-bold">Preço</small>
                        <p>{detailsProductItem.price}</p>
                    </div>
                    <div className="mb-3">
                        <small htmlFor="productName" className="fw-bold">Descrição</small>
                        <p>{detailsProductItem.description}</p>
                    </div>
                </div>
            </div>

            <div
                className="offcanvas offcanvas-start"
                tabIndex="-1"
                id="createProduct"
                aria-labelledby="createProductLabel"
            >
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="createProductLabel">Cadastro de produtos</h5>
                    <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">
                    <form className="form" id="form-create-product">
                        <div className="mb-3">
                            <label htmlFor="productName" className="form-label">Nome</label>
                            <input
                                type="text"
                                className="form-control"
                                id="productName"
                                name="name"
                                placeholder="Tênis Adidas..."
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="productCostPrice" className="form-label">Preço de custo</label>
                            <input
                                type="text"
                                className="form-control"
                                id="productCostPrice"
                                name="costPrice"
                                placeholder="R$ 7.00"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="productPrice" className="form-label">Preço de venda</label>
                            <input
                                type="text"
                                className="form-control"
                                id="productPrice"
                                name="price"
                                placeholder="R$ 10.00"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="productDescription" className="form-label">Descrição</label>
                            <textarea
                                className="form-control"
                                id="productDescription"
                                name="description" rows="3"
                                placeholder="Um produto de alta qualidade..."
                            ></textarea>
                        </div>
                        <div className="mb-3 d-flex justify-content-between">
                            <button type="button" className="btn btn-secondary btn-sm" onClick={closeCreateProductModal}> Cancelar </button>
                            <button type="button" className="btn btn-primary btn-sm" onClick={createProduct}> Cadastrar </button>
                        </div>
                    </form>
                </div>
            </div>

            <div
                className="offcanvas offcanvas-start"
                tabIndex="-1"
                id="updateProduct"
                aria-labelledby="updateProductLabel"
            >
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="updateProductLabel">Atualização de produtos</h5>
                    <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">
                    <form className="form" id="form-update-product">
                        <div className="mb-3">
                            <label htmlFor="productName" className="form-label">Nome</label>
                            <input
                                type="text"
                                className="form-control"
                                id="productName"
                                name="name"
                                defaultValue={updateProductItem.name}
                                placeholder="Tênis Adidas..."
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="productCostPrice" className="form-label">Preço de custo</label>
                            <input
                                type="text"
                                className="form-control"
                                id="productCostPrice"
                                name="costPrice"
                                defaultValue={updateProductItem.costPrice}
                                placeholder="R$ 7.00"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="productPrice" className="form-label">Preço de venda</label>
                            <input
                                type="text"
                                className="form-control"
                                id="productPrice"
                                name="price"
                                defaultValue={updateProductItem.price}
                                placeholder="R$ 10.00"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="productDescription" className="form-label">Descrição</label>
                            <textarea
                                className="form-control"
                                id="productDescription"
                                name="description" rows="3"
                                defaultValue={updateProductItem.description}
                                placeholder="Um produto de alta qualidade..."
                            ></textarea>
                        </div>
                        <div className="mb-3 d-flex justify-content-between">
                            <button type="button" className="btn btn-secondary btn-sm" onClick={toggleOffcanvasUpdateProduct}> Cancelar </button>
                            <button type="button" className="btn btn-primary btn-sm" onClick={updateProduct}> Atualizar </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default ProductListPage